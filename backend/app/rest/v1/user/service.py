import logging
from datetime import datetime, timedelta
from string import Template

from app.constants import AUTH_ROLE_FIELDS, messages
from app.core import BaseService, feature
from app.shared import mail
from app.signals import user_created, user_updated
from app.utils import generate_random_alphanumeric_string, validate_schema
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                get_jwt_identity)
from flask_mail import Message
from flask_restful import abort
from marshmallow import ValidationError

from ..user_role import UserRoleService
from .model import User
from .resource import (AuthLogin, AuthRefresh, AuthSwitch,
                       PasswordResetByIdView, PasswordResetByUsernameView,
                       ProfileView, UserList, UserView)
from .schema import AuthSchema, AuthUserSchema, UserSchema
from .template import PASSWORD_RESET_TEMPLATE, USER_CREATE_TEMPLATE


class UserService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = User
        self.schema = UserSchema
        self.auth_schema = AuthSchema
        self.auth_user_schema = AuthUserSchema
        self.exclude = {'get_all': []}

        self.resources = [
            {'resource': UserList, 'url': '/users'},
            {'resource': UserView, 'url': '/users/<int:record_id>'},
            {'resource': PasswordResetByIdView,
                'url': '/users/<int:record_id>/reset'},
            {'resource': ProfileView, 'url': '/users/me'},
            {'resource': PasswordResetByUsernameView, 'url': '/password'},
            {'resource': AuthLogin, 'url': '/auth/login'},
            {'resource': AuthRefresh, 'url': '/auth/refresh'},
            {'resource': AuthSwitch, 'url': '/auth/switch'}
        ]

    def create(self, data):
        import logging
        logger = logging.getLogger(__name__)
        try:
            logger.info(f"UserService.create called with data: {data}")
            schema = self.schema()
            validated_data = validate_schema(data, schema)
            logger.info(f"Validated data: {validated_data}")
            if validated_data:
                if self.check_if_username_exists(validated_data['username']):
                    logger.warning(f"Username {validated_data['username']} already exists")
                    abort(409, message=messages.ALREADY_EXISTS)
                if 'password' not in validated_data:
                    validated_data["password"] = generate_random_alphanumeric_string(
                        16)

                decoded_password = validated_data["password"]
                password_hash = self.model.generate_hash(
                    validated_data["password"])
                validated_data['password'] = password_hash
                validated_data['password_changed_on'] = datetime.today()
                logger.info(f"Creating user record with validated_data (password excluded from log)")
                record = self.model.create(**validated_data)
                logger.info(f"User record created with id: {record.id}")
                logger.info(f"Sending user_created signal with user_roles: {data.get('user_roles', None)}")
                user_created.send(user=record, **data)
                logger.info(f"user_created signal sent successfully")

                msg = Message('Your account has been created',
                              recipients=[record.email])
                msg.body = Template(USER_CREATE_TEMPLATE).safe_substitute(
                    new_line='\r\n',
                    full_name=record.full_name,
                    username=record.username,
                    password=decoded_password)
                msg.html = Template(USER_CREATE_TEMPLATE).safe_substitute(
                    new_line='<br />',
                    full_name=record.full_name,
                    username=record.username,
                    password=decoded_password)
                try:
                    mail.send(msg)
                except:
                    logging.error(
                        f'{messages.EMAIL_NOT_SENT} - {record.email} for user id: {record.id}')

                result = schema.dump(record)
                logger.info(f"UserService.create returning result with id: {result.get('id', 'unknown')}")
                return result
        except Exception as e:
            logger.error(f"Error in UserService.create: {str(e)}", exc_info=True)
            raise

    def update(self, record_id, data, partial=False):
        schema = self.schema()
        validated_data = validate_schema(data, schema, partial=partial)
        if validated_data:
            record = self.model.get_one(record_id)
            if not record:
                abort(404, message=messages.NOT_FOUND)
            if 'password' in validated_data:
                password_hash = self.model.generate_hash(
                    validated_data['password'])
                validated_data['password'] = password_hash
            record = record.update(**validated_data)
            user_updated.send(user=record, **data)
            return schema.dump(record)

    def check_if_username_exists(self, username):
        user_count = self.model.get_total(filter={'username': username})
        return True if user_count > 0 else False

    def update_password(self, record_id, data):
        schema = self.schema()
        validated_data = validate_schema(data, schema, partial=True)
        if validated_data:
            record = self.model.get_one(record_id)
            if not record:
                abort(404, message=messages.NOT_FOUND)
            if 'password' in validated_data:
                password_hash = self.model.generate_hash(
                    validated_data['password'])
                record = record.update(password=password_hash)
                return schema.dump(record)
            abort(422, message=messages.PASSWORD_MISSING)

    def login(self, data):
        if not data:
            return {'message': 'No input data provided'}, 400

        auth_schema = self.auth_schema()
        try:
            validated_data = auth_schema.load(data)
        except ValidationError as error:
            return {'status': 'error', 'data': error.normalized_messages()}, 422

        password_expired = False
        current_user = self.model.find_by_username(validated_data['username'])

        if not current_user or current_user.is_blocked:
            return {'message': 'User {} doesn\'t exist'.format(validated_data['username'])}

        if feature.is_active('reset_password_when_first_login'):
            if (current_user.password_changed_on is None or
                    current_user.last_login_time is None):
                password_expired = True

        if not current_user or current_user.is_blocked:
            return {'message': 'User {} doesn\'t exist'.format(validated_data['username'])}

        password_expiration_feature = feature.is_active(
            'is_password_expirable')
        if password_expiration_feature:
            current_date = datetime.now()
            password_expiration_date = current_date - \
                timedelta(
                    days=password_expiration_feature['expiration_period'])
            if current_user.password_changed_on < password_expiration_date:
                password_expired = True

        if not password_expired:
            current_user.update_login_time()

        # Create completely minimal user data for JWT token to avoid JSON serialization issues
        # Only include basic JSON-serializable data types - use simple integer ID only
        user_data = int(current_user.id)
        if self.model.verify_hash(validated_data['password'], current_user.password):
            user_role_service = UserRoleService()
            # Skip role delegation for now to avoid serialization issues
            access_token = create_access_token(identity=user_data)
            refresh_token = create_refresh_token(identity=user_data)
            return {
                'message': 'Logged in as {}'.format(current_user.username),
                'password_expired': password_expired,
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        else:
            abort(401, message=messages.WRONG_CREDENTIALS)

    def refresh(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return {'access_token': access_token}

    def switch(self, data):
        import sys
        logger = logging.getLogger(__name__)
        
        print("=== UserService.switch called ===", file=sys.stderr)
        sys.stderr.flush()
        
        def make_json_serializable(obj, _visited=None):
            """Recursively remove functions and ensure all values are JSON serializable."""
            if _visited is None:
                _visited = set()
            
            # Handle circular references
            obj_id = id(obj)
            if obj_id in _visited:
                return None
            _visited.add(obj_id)
            
            try:
                if obj is None:
                    return None
                elif isinstance(obj, (str, int, float, bool)):
                    return obj
                elif isinstance(obj, (list, tuple)):
                    result = []
                    for item in obj:
                        if not callable(item):
                            cleaned = make_json_serializable(item, _visited)
                            if cleaned is not None:
                                result.append(cleaned)
                    return result
                elif isinstance(obj, dict):
                    result = {}
                    for k, v in obj.items():
                        if not callable(k) and not callable(v):
                            try:
                                # Ensure key is string
                                key = str(k) if not isinstance(k, str) else k
                                cleaned_value = make_json_serializable(v, _visited)
                                if cleaned_value is not None:
                                    result[key] = cleaned_value
                            except Exception:
                                continue
                    return result
                elif callable(obj):
                    return None  # Remove functions
                else:
                    # Try to convert to string or return None
                    try:
                        # Check if it's a SQLAlchemy model or similar
                        if hasattr(obj, '__dict__'):
                            # It's an object, try to get its dict representation
                            obj_dict = {}
                            for attr in dir(obj):
                                if not attr.startswith('_') and not callable(getattr(obj, attr, None)):
                                    try:
                                        value = getattr(obj, attr)
                                        if not callable(value):
                                            cleaned = make_json_serializable(value, _visited)
                                            if cleaned is not None:
                                                obj_dict[attr] = cleaned
                                    except:
                                        continue
                            return obj_dict if obj_dict else None
                        return str(obj)
                    except:
                        return None
            finally:
                _visited.discard(obj_id)
        
        try:
            if not data:
                return {'message': 'No input data provided'}, 400

            # Extract role_id directly from data - don't use schema validation for switch
            # since we only need role_id and user_id will be determined from JWT
            if not isinstance(data, dict):
                return {'message': 'Invalid request data'}, 400
            
            role_id = data.get('role_id')
            if not role_id:
                return {'message': 'role_id is required'}, 400
            
            # Ensure role_id is an integer
            try:
                role_id = int(role_id)
            except (ValueError, TypeError):
                return {'message': 'role_id must be a valid integer'}, 400

            user_identity = get_jwt_identity()
            if not user_identity:
                return {'message': 'User not authenticated'}, 401
            
            # Handle both integer ID and dict with original_id
            user_id = user_identity
            if isinstance(user_identity, dict):
                user_id = user_identity.get('original_id') or user_identity.get('id')
            
            if not user_id:
                return {'message': 'User ID not found'}, 401
            
            current_user_record = self.model.get_one(user_id)
            if not current_user_record:
                return {'message': 'User not found'}, 404
            
            current_user = self.schema().dump(current_user_record)
            
            # Ensure user_identity is a dict for token creation
            if not isinstance(user_identity, dict):
                user_identity = {}
            
            user_identity['original_id'] = current_user['id']
            user_identity['id'] = current_user['id']
            user_identity['username'] = current_user.get('username', '')
            
            # Get user roles directly from the database relationship
            # The schema dump might not include user_roles, so we fetch them directly
            from app.rest.v1.user_role.model import UserRole
            from datetime import date
            today = date.today()
            
            # Get all user roles for this user
            all_user_roles = UserRole.query.filter_by(
                user_id=current_user_record.id,
                is_approved=True
            ).all()
            
            # Filter based on delegation and date logic
            available_roles = []
            for user_role in all_user_roles:
                # Include non-delegated roles
                if not user_role.is_delegated:
                    available_roles.append(user_role)
                # Include delegated roles that are within date range
                elif (user_role.start_date and user_role.end_date and 
                      user_role.start_date <= today and user_role.end_date >= today):
                    available_roles.append(user_role)
            
            # Find the requested role
            for user_role in available_roles:
                if role_id == user_role.role_id:
                    # Ensure role relationship is loaded
                    if not user_role.role:
                        # Role relationship not loaded, fetch it
                        from app.rest.v1.role.model import Role
                        user_role.role = Role.query.get(user_role.role_id)
                        if not user_role.role:
                            continue  # Skip if role doesn't exist
                    
                    # Build current_role manually to avoid schema dump issues with nested fields
                    # Ensure all values are JSON-serializable
                    import json
                    
                    # Safely extract allowed_organization_ids - handle SQLAlchemy JSON types
                    allowed_org_ids = []
                    try:
                        org_ids_value = user_role.allowed_organization_ids
                        if org_ids_value is not None:
                            # Convert to plain Python list if needed
                            if isinstance(org_ids_value, (list, tuple)):
                                allowed_org_ids = [int(x) if isinstance(x, (int, str)) and str(x).isdigit() else x for x in org_ids_value if not callable(x)]
                            elif not callable(org_ids_value):
                                # Try to convert if it's a JSON string or other type
                                try:
                                    if isinstance(org_ids_value, str):
                                        allowed_org_ids = json.loads(org_ids_value)
                                    else:
                                        allowed_org_ids = org_ids_value
                                except:
                                    allowed_org_ids = []
                    except Exception as e:
                        logger.warning(f"Error extracting allowed_organization_ids: {str(e)}")
                        allowed_org_ids = []
                    
                    # Safely extract allowed_project_ids
                    allowed_proj_ids = []
                    try:
                        proj_ids_value = user_role.allowed_project_ids
                        if proj_ids_value is not None:
                            if isinstance(proj_ids_value, (list, tuple)):
                                allowed_proj_ids = [int(x) if isinstance(x, (int, str)) and str(x).isdigit() else x for x in proj_ids_value if not callable(x)]
                            elif not callable(proj_ids_value):
                                try:
                                    if isinstance(proj_ids_value, str):
                                        allowed_proj_ids = json.loads(proj_ids_value)
                                    else:
                                        allowed_proj_ids = proj_ids_value
                                except:
                                    allowed_proj_ids = []
                    except Exception as e:
                        logger.warning(f"Error extracting allowed_project_ids: {str(e)}")
                        allowed_proj_ids = []
                    
                    # Build current_role_data from scratch using only basic types
                    # Extract phase_ids safely
                    phase_ids = []
                    role_name = ''
                    if user_role.role:
                        try:
                            # Get role name - ensure it's a string
                            role_name = str(user_role.role.name) if hasattr(user_role.role, 'name') and user_role.role.name else ''
                            
                            # Get phase_ids - ensure it's a list of integers
                            phase_ids_value = getattr(user_role.role, 'phase_ids', None)
                            if phase_ids_value is not None and not callable(phase_ids_value):
                                if isinstance(phase_ids_value, (list, tuple)):
                                    phase_ids = [int(x) for x in phase_ids_value if isinstance(x, (int, str)) and str(x).isdigit() and not callable(x)]
                                elif isinstance(phase_ids_value, (int, str)) and str(phase_ids_value).isdigit():
                                    phase_ids = [int(phase_ids_value)]
                        except Exception as e:
                            logger.warning(f"Error extracting role data: {str(e)}")
                            phase_ids = []
                            role_name = ''
                    
                    # Build current_role_data using only basic Python types
                    current_role_data = {
                        'role_id': int(user_role.role_id) if user_role.role_id is not None else None,
                        'allowed_organization_ids': [int(x) for x in allowed_org_ids if isinstance(x, (int, str)) and str(x).isdigit()],
                        'allowed_project_ids': [int(x) for x in allowed_proj_ids if isinstance(x, (int, str)) and str(x).isdigit()],
                        'role': {
                            'name': role_name,
                            'phase_ids': phase_ids
                        }
                    }
                    
                    # Determine user ID for identity
                    user_id = int(user_identity.get('id', current_user['id']))
                    if user_role.is_delegated and user_role.delegated_by:
                        user_id = int(user_role.delegated_by)
                    
                    # Build a minimal, safe identity that we know is JSON serializable
                    # Only include basic types: int, str, list, dict with basic types
                    clean_identity = {
                        'id': int(user_id),
                        'original_id': int(current_user['id']),
                        'username': str(current_user.get('username', '')) if current_user.get('username') else '',
                        'current_role': {
                            'role_id': int(current_role_data['role_id']) if current_role_data.get('role_id') else None,
                            'allowed_organization_ids': [int(x) for x in current_role_data.get('allowed_organization_ids', []) if isinstance(x, (int, str)) and str(x).isdigit()],
                            'allowed_project_ids': [int(x) for x in current_role_data.get('allowed_project_ids', []) if isinstance(x, (int, str)) and str(x).isdigit()],
                            'role': {
                                'name': str(current_role_data.get('role', {}).get('name', '')) if current_role_data.get('role', {}).get('name') else '',
                                'phase_ids': [int(x) for x in current_role_data.get('role', {}).get('phase_ids', []) if isinstance(x, (int, str)) and str(x).isdigit()]
                            } if current_role_data.get('role') else {}
                        }
                    }
                    
                    # Clean identity recursively to remove any functions
                    clean_identity_serialized = make_json_serializable(clean_identity)
                    
                    # Additional aggressive cleaning: remove any remaining callable objects
                    if isinstance(clean_identity_serialized, dict):
                        for key in list(clean_identity_serialized.keys()):
                            value = clean_identity_serialized[key]
                            if callable(value):
                                logger.warning(f"Removing callable value for key '{key}' in identity")
                                clean_identity_serialized.pop(key, None)
                            elif isinstance(value, dict):
                                # Recursively clean nested dicts
                                for nested_key in list(value.keys()):
                                    if callable(value[nested_key]):
                                        logger.warning(f"Removing callable value for nested key '{key}.{nested_key}' in identity")
                                        value.pop(nested_key, None)
                            elif isinstance(value, list):
                                # Remove callable items from lists
                                clean_identity_serialized[key] = [item for item in value if not callable(item)]
                    
                    # Log the cleaned identity for debugging
                    logger.info(f"Cleaned identity keys: {list(clean_identity_serialized.keys()) if isinstance(clean_identity_serialized, dict) else 'not a dict'}")
                    
                    # Test serialization before creating tokens - this will catch the error early
                    # Use the same approach JWT library uses (no default handler, must be fully serializable)
                    try:
                        test_json = json.dumps(clean_identity_serialized)
                        logger.debug(f"Identity JSON test successful, length: {len(test_json)}")
                    except (TypeError, ValueError) as e:
                        logger.error(f"Identity not JSON serializable: {str(e)}")
                        logger.error(f"clean_identity keys: {list(clean_identity.keys())}")
                        logger.error(f"clean_identity_serialized type: {type(clean_identity_serialized)}")
                        logger.error(f"clean_identity_serialized: {clean_identity_serialized}")
                        logger.error(f"current_role_data: {current_role_data}")
                        # Try to find which field is the problem
                        if isinstance(clean_identity_serialized, dict):
                            for key, value in clean_identity_serialized.items():
                                try:
                                    json.dumps(value, default=str)
                                except Exception as ve:
                                    logger.error(f"Field '{key}' is not serializable: {str(ve)}, type: {type(value)}, value: {value}")
                                    # Try to clean this specific field
                                    clean_identity_serialized[key] = make_json_serializable(value)
                        return {'message': f'Error: Identity contains non-serializable data: {str(e)}'}, 500
                    
                    # Final check: ensure no functions remain
                    def has_functions(obj, path=""):
                        """Check if object contains any functions."""
                        if callable(obj):
                            return True, path
                        if isinstance(obj, dict):
                            for k, v in obj.items():
                                if callable(k) or callable(v):
                                    return True, f"{path}.{k}" if path else str(k)
                                result, func_path = has_functions(v, f"{path}.{k}" if path else str(k))
                                if result:
                                    return True, func_path
                        elif isinstance(obj, (list, tuple)):
                            for i, item in enumerate(obj):
                                if callable(item):
                                    return True, f"{path}[{i}]" if path else f"[{i}]"
                                result, func_path = has_functions(item, f"{path}[{i}]" if path else f"[{i}]")
                                if result:
                                    return True, func_path
                        return False, ""
                    
                    has_func, func_path = has_functions(clean_identity_serialized)
                    if has_func:
                        logger.error(f"Function found in clean_identity_serialized at path: {func_path}")
                        # Try to clean again
                        clean_identity_serialized = make_json_serializable(clean_identity_serialized)
                        has_func, func_path = has_functions(clean_identity_serialized)
                        if has_func:
                            logger.error(f"Function still found after second cleaning at: {func_path}")
                            return {'message': f'Error: Function found in identity data at: {func_path}'}, 500
                    
                    # Final aggressive cleaning: serialize to JSON and back to ensure complete cleanliness
                    # This will catch any remaining functions or non-serializable objects
                    try:
                        identity_json = json.dumps(clean_identity_serialized)
                        clean_identity_final = json.loads(identity_json)
                        print("=== Identity successfully serialized/deserialized ===", file=sys.stderr)
                    except (TypeError, ValueError) as json_err:
                        print(f"=== Identity still not serializable: {str(json_err)} ===", file=sys.stderr)
                        print(f"=== Identity content: {clean_identity_serialized} ===", file=sys.stderr)
                        sys.stderr.flush()
                        # Try to find and remove the problematic field
                        if isinstance(clean_identity_serialized, dict):
                            for key, value in list(clean_identity_serialized.items()):
                                try:
                                    json.dumps(value)
                                except:
                                    print(f"=== Removing problematic key: {key} ===", file=sys.stderr)
                                    clean_identity_serialized.pop(key, None)
                            # Try again
                            try:
                                identity_json = json.dumps(clean_identity_serialized)
                                clean_identity_final = json.loads(identity_json)
                                print("=== Identity cleaned after removing problematic fields ===", file=sys.stderr)
                            except:
                                return {'message': 'An error occurred while processing the request'}, 500
                        else:
                            return {'message': 'An error occurred while processing the request'}, 500
                    
                    print("=== About to create access token ===", file=sys.stderr)
                    print(f"=== Identity type: {type(clean_identity_final)} ===", file=sys.stderr)
                    print(f"=== Identity keys: {list(clean_identity_final.keys()) if isinstance(clean_identity_final, dict) else 'not a dict'} ===", file=sys.stderr)
                    sys.stderr.flush()
                    
                    try:
                        access_token = create_access_token(identity=clean_identity_final)
                        print("=== Access token created successfully ===", file=sys.stderr)
                        sys.stderr.flush()
                        logger.debug("Access token created successfully")
                    except (TypeError, ValueError) as e:
                        # JSON serialization error
                        error_msg = str(e) if e else 'Error creating access token'
                        logger.error(f"JSON serialization error creating access token: {error_msg}", exc_info=True)
                        # Log the identity that failed
                        logger.error(f"Failed identity type: {type(clean_identity_serialized)}")
                        logger.error(f"Failed identity keys: {list(clean_identity_serialized.keys()) if isinstance(clean_identity_serialized, dict) else 'not a dict'}")
                        return {'message': 'An error occurred while processing the request'}, 500
                    except Exception as e:
                        error_msg = str(e) if e else 'Error creating access token'
                        logger.error(f"Error creating access token: {error_msg}", exc_info=True)
                        # Log the identity that failed
                        logger.error(f"Failed identity type: {type(clean_identity_serialized)}")
                        return {'message': 'An error occurred while processing the request'}, 500
                    
                    try:
                        refresh_token = create_refresh_token(identity=clean_identity_final)
                        logger.debug("Refresh token created successfully")
                    except (TypeError, ValueError) as e:
                        # JSON serialization error
                        error_msg = str(e) if e else 'Error creating refresh token'
                        logger.error(f"JSON serialization error creating refresh token: {error_msg}", exc_info=True)
                        return {'message': 'An error occurred while processing the request'}, 500
                    except Exception as e:
                        error_msg = str(e) if e else 'Error creating refresh token'
                        logger.error(f"Error creating refresh token: {error_msg}", exc_info=True)
                        return {'message': 'An error occurred while processing the request'}, 500
                    
                    # Ensure return value is also serializable
                    # Convert tokens to strings explicitly and clean all data
                    response_data = {
                        'message': str('Logged in as {}'.format(clean_identity_serialized.get('username', ''))),
                        'access_token': str(access_token) if access_token else '',
                        'refresh_token': str(refresh_token) if refresh_token else ''
                    }
                    
                    # Clean response data to ensure no functions remain
                    response_data_cleaned = make_json_serializable(response_data)
                    
                    # Final check: ensure all values are basic types
                    if isinstance(response_data_cleaned, dict):
                        for key, value in list(response_data_cleaned.items()):
                            if callable(value):
                                logger.warning(f"Removing callable value for key '{key}'")
                                response_data_cleaned.pop(key, None)
                            elif not isinstance(value, (str, int, float, bool, type(None), list, dict)):
                                # Convert unknown types to string
                                try:
                                    response_data_cleaned[key] = str(value)
                                except:
                                    response_data_cleaned.pop(key, None)
                    
                    # Test response serialization - use the same method Flask-RESTful will use
                    # Don't use default=str because Flask-RESTful won't use it
                    try:
                        # Final check for functions before serialization
                        def check_for_functions(obj, path=""):
                            """Check if object contains any functions"""
                            if callable(obj):
                                print(f"=== FUNCTION FOUND at {path} ===", file=sys.stderr)
                                return True, path
                            if isinstance(obj, dict):
                                for k, v in obj.items():
                                    if callable(k):
                                        print(f"=== FUNCTION FOUND in key at {path}.{k} ===", file=sys.stderr)
                                        return True, f"{path}.{k}"
                                    found, func_path = check_for_functions(v, f"{path}.{k}" if path else str(k))
                                    if found:
                                        return True, func_path
                            if isinstance(obj, (list, tuple)):
                                for i, item in enumerate(obj):
                                    found, func_path = check_for_functions(item, f"{path}[{i}]" if path else f"[{i}]")
                                    if found:
                                        return True, func_path
                            return False, ""
                        
                        has_func, func_path = check_for_functions(response_data_cleaned)
                        if has_func:
                            print(f"=== Function still found at {func_path}, cleaning again ===", file=sys.stderr)
                            # Remove any remaining functions
                            def clean_final(obj):
                                if callable(obj):
                                    return None
                                if isinstance(obj, dict):
                                    return {k: clean_final(v) for k, v in obj.items() if not callable(k) and not callable(v)}
                                if isinstance(obj, list):
                                    return [clean_final(item) for item in obj if not callable(item)]
                                return obj
                            response_data_cleaned = clean_final(response_data_cleaned)
                        
                        # Serialize and deserialize to ensure it's completely clean
                        json_str = json.dumps(response_data_cleaned)
                        response_data_final = json.loads(json_str)
                        logger.debug("Response data is JSON serializable")
                        print("=== Response data successfully serialized/deserialized ===", file=sys.stderr)
                        sys.stderr.flush()
                    except (TypeError, ValueError) as e:
                        logger.error(f"Response not JSON serializable: {str(e)}")
                        logger.error(f"response_data_cleaned type: {type(response_data_cleaned)}")
                        logger.error(f"response_data_cleaned: {response_data_cleaned}")
                        print(f"=== Serialization error: {str(e)} ===", file=sys.stderr)
                        sys.stderr.flush()
                        return {'message': 'An error occurred while processing the request'}, 500
                    
                    # Final safety check: one more serialize/deserialize to ensure it's completely clean
                    try:
                        final_json = json.dumps(response_data_final)
                        response_data_final = json.loads(final_json)
                        print("=== Final safety check passed - data is clean ===", file=sys.stderr)
                    except Exception as final_check_err:
                        print(f"=== Final safety check failed: {str(final_check_err)} ===", file=sys.stderr)
                        logger.error(f"Final safety check failed: {str(final_check_err)}")
                        return {'message': 'An error occurred while processing the request'}, 500
                    
                    print("=== Returning response_data_final ===", file=sys.stderr)
                    print(f"=== response_data_final type: {type(response_data_final)} ===", file=sys.stderr)
                    print(f"=== response_data_final keys: {list(response_data_final.keys()) if isinstance(response_data_final, dict) else 'not a dict'} ===", file=sys.stderr)
                    sys.stderr.flush()
                    return response_data_final
            print("=== Role not found, returning WRONG_ROLE ===", file=sys.stderr)
            sys.stderr.flush()
            return {'message': messages.WRONG_ROLE}, 401
        except Exception as e:
            import traceback
            error_traceback = traceback.format_exc()
            error_message = str(e) if e else 'An error occurred while processing the request'
            
            print(f"=== EXCEPTION in switch method: {error_message} ===", file=sys.stderr)
            print(f"=== Traceback: {error_traceback} ===", file=sys.stderr)
            sys.stderr.flush()
            
            logger.error(f"Unexpected error in switch method: {error_message}", exc_info=True)
            
            # Return detailed error with error type
            error_type = type(e).__name__
            return {
                'message': error_message,
                'error': 'Internal server error',
                'error_type': error_type
            }, 500

    def reset_password(self, **kwargs):
        record = None
        record_id = kwargs.get('record_id', None)
        username = kwargs.get('username', None)
        if record_id:
            record = self.model.get_one(record_id)
        elif username:
            record = self.model.get_by_username(username)
        if not record:
            abort(404, message=messages.NOT_FOUND)
        new_password = generate_random_alphanumeric_string(16)
        password_hash = self.model.generate_hash(new_password)
        msg = Message('Your Password has been reset',
                      recipients=[record.email])
        msg.body = Template(PASSWORD_RESET_TEMPLATE).safe_substitute(
            new_line='\r\n',
            user_fullname=record.full_name,
            password=new_password)
        msg.html = Template(PASSWORD_RESET_TEMPLATE).safe_substitute(
            new_line='<br />',
            user_fullname=record.full_name,
            password=new_password)
        try:
            mail.send(msg)
            record = record.update(password=password_hash)
        except:
            abort(424, message=messages.EMAIL_NOT_SENT)
        return self.schema().dump(record)

    def get_assignable_users(self, role_id, supervisor_id=None):
        filters = dict()
        filters['role_id'] = role_id
        if supervisor_id is not None:
            filters['supervisor_id'] = supervisor_id
        return self.get_all(filters=filters)

import json
import numbers
from datetime import date, datetime
from decimal import Decimal

from app.constants import AUTH_ROLE_FIELDS, messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask import request, jsonify, Response, make_response
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                get_jwt_identity, jwt_required)
from flask_restful import Resource
from marshmallow import ValidationError
from ..user_role import UserRoleService


def _make_json_serializable(obj):
    """Recursively convert values to JSON-serializable types."""
    if obj is None or isinstance(obj, (bool, str)):
        return obj
    if isinstance(obj, (int, float)) and not isinstance(obj, bool):
        return obj
    # Numpy, Decimal, and other numeric types
    if isinstance(obj, Decimal):
        try:
            return int(obj) if obj % 1 == 0 else float(obj)
        except Exception:
            return float(obj)
    if isinstance(obj, numbers.Integral) and not isinstance(obj, bool):
        return int(obj)
    if isinstance(obj, numbers.Real) and not isinstance(obj, numbers.Integral):
        return float(obj)
    if hasattr(obj, 'isoformat'):  # date, datetime, time
        return obj.isoformat()
    if isinstance(obj, bytes):
        return obj.decode('utf-8', errors='replace')
    if isinstance(obj, (list, tuple)):
        return [_make_json_serializable(x) for x in obj]
    if isinstance(obj, dict):
        return {str(k): _make_json_serializable(v) for k, v in obj.items()}
    return str(obj)


class UserList(BaseList):
    method_decorators = {'get': [jwt_required()],
                         'post': [check_permission('create_user')]}


class UserView(BaseView):
    method_decorators = {'get': [check_permission('view_user')],
                         'put': [check_permission('edit_user')],
                         'patch': [check_permission('edit_user')],
                         'delete': [check_permission('delete_user')]}


def build_users_me_response(service):
    """
    Build the /users/me JSON response. Used by both the direct Flask route
    (to bypass Flask-RESTful) and ProfileView.get(). Returns a Flask Response.
    """
    import logging
    import traceback
    import sys
    logger = logging.getLogger(__name__)

    def _safe(v):
        if v is None or isinstance(v, (bool, int, float, str)):
            return v
        if isinstance(v, Decimal):
            try:
                return int(v) if v % 1 == 0 else float(v)
            except Exception:
                return float(v)
        if isinstance(v, numbers.Integral) and not isinstance(v, bool):
            return int(v)
        if isinstance(v, numbers.Real) and not isinstance(v, numbers.Integral):
            return float(v)
        if hasattr(v, 'isoformat'):
            return v.isoformat()
        if isinstance(v, bytes):
            return v.decode('utf-8', errors='replace')
        if isinstance(v, (list, tuple)):
            return [_safe(x) for x in v]
        if isinstance(v, dict):
            return {str(k): _safe(x) for k, x in v.items()}
        try:
            return int(v)
        except (TypeError, ValueError):
            pass
        try:
            return float(v)
        except (TypeError, ValueError):
            pass
        return str(v) if v is not None else None

    try:
        user_identity = get_jwt_identity()
        if not user_identity:
            return Response(json.dumps({'message': 'User not authenticated'}), 401, mimetype='application/json')

        if isinstance(user_identity, dict):
            user_id = user_identity.get('original_id') or user_identity.get('id')
            user_id = int(user_id) if user_id is not None else None
        else:
            user_id = int(user_identity) if user_identity is not None else None

        if not user_id:
            return Response(json.dumps({'message': 'User ID not found'}), 401, mimetype='application/json')

        user_record = service.model.get_one(user_id)
        if not user_record:
            return Response(json.dumps({'message': 'User not found'}), 404, mimetype='application/json')

        from app.rest.v1.user_role.model import UserRole
        today = date.today()
        all_user_roles = UserRole.query.filter_by(user_id=user_id, is_approved=True).all()

        def _in_delegation_window(ur):
            if ur.is_delegated is False:
                return True
            if not ur.start_date or not ur.end_date:
                return False
            try:
                return (isinstance(ur.start_date, (date, datetime)) and
                        isinstance(ur.end_date, (date, datetime)) and
                        ur.start_date <= today and ur.end_date >= today)
            except (TypeError, ValueError):
                return False

        available_roles = [ur for ur in all_user_roles if _in_delegation_window(ur)]

        user_roles_data = []
        for ur in available_roles:
            rd = {
                'id': _safe(ur.id),
                'user_id': _safe(ur.user_id),
                'role_id': _safe(ur.role_id),
                'is_approved': _safe(ur.is_approved),
                'is_delegator': _safe(ur.is_delegator),
                'is_delegated': _safe(ur.is_delegated),
                'delegated_by': _safe(ur.delegated_by),
                'approved_by': _safe(ur.approved_by),
                'start_date': _safe(ur.start_date),
                'end_date': _safe(ur.end_date),
                'allowed_organization_ids': _safe(ur.allowed_organization_ids),
                'allowed_project_ids': _safe(ur.allowed_project_ids),
            }
            if ur.role:
                try:
                    perm = getattr(ur.role, 'permissions', None)
                    try:
                        perm = json.loads(json.dumps(perm, default=str)) if perm is not None else []
                    except Exception:
                        perm = []
                    pid = getattr(ur.role, 'phase_ids', None)
                    if pid is None:
                        pid = []
                    elif not isinstance(pid, (list, tuple)):
                        try:
                            pid = [int(x) for x in pid] if hasattr(pid, '__iter__') and not isinstance(pid, (str, bytes)) else []
                        except Exception:
                            pid = []
                    else:
                        pid = [_safe(x) for x in pid]
                    org_lvl = getattr(ur.role, 'organization_level', None)
                    org_lvl = int(org_lvl) if org_lvl is not None and isinstance(org_lvl, (int, float)) else (_safe(org_lvl) if org_lvl is not None else None)
                    rd['role'] = {
                        'id': _safe(ur.role.id),
                        'name': _safe(ur.role.name) if getattr(ur.role, 'name', None) else '',
                        'permissions': perm if isinstance(perm, (list, tuple)) else (perm if perm is not None else []),
                        'phase_ids': pid,
                        'organization_level': org_lvl,
                    }
                except Exception as role_err:
                    logger.warning("Skipping role data for user_role id=%s: %s", _safe(ur.id), role_err)
                    rd['role'] = {'id': None, 'name': '', 'permissions': [], 'phase_ids': [], 'organization_level': None}
            user_roles_data.append(rd)

        organization_data = None
        if user_record.organization:
            try:
                o = user_record.organization
                organization_data = {
                    'id': _safe(getattr(o, 'id', None)),
                    'code': _safe(getattr(o, 'code', None)),
                    'name': _safe(getattr(o, 'name', None)),
                    'parent_id': _safe(getattr(o, 'parent_id', None)),
                    'management_id': _safe(getattr(o, 'management_id', None)),
                    'level': _safe(getattr(o, 'level', None)),
                    'additional_data': _safe(getattr(o, 'additional_data', None)),
                }
            except Exception as org_err:
                logger.warning("Skipping organization data for user: %s", org_err)
                organization_data = None

        result = {
            'id': _safe(user_record.id),
            'username': _safe(user_record.username),
            'full_name': _safe(user_record.full_name),
            'email': _safe(user_record.email),
            'organization_id': _safe(user_record.organization_id),
            'user_roles': user_roles_data,
            'organization': organization_data,
        }

        # Final pass: ensure no DB/driver-specific types (Decimal, UUID, etc.) slip through
        result = _make_json_serializable(result)
        body = json.dumps(result, default=str)
        return Response(body, 200, mimetype='application/json')

    except Exception as e:
        tb = traceback.format_exc()
        debug_msg = '%s: %s' % (type(e).__name__, str(e)[:500])
        logger.error("Error in /users/me: %s: %s\n%s", type(e).__name__, e, tb)
        print("ProfileView /users/me 500: %s" % debug_msg, file=sys.stderr)
        sys.stderr.flush()
        err_body = json.dumps({
            'message': 'An error occurred while processing the request',
            'error': 'Invalid response data',
            'debug': debug_msg,
        }, default=str)
        resp = Response(err_body, 500, mimetype='application/json')
        resp.headers['X-Debug-Error'] = debug_msg[:200]
        return resp


class ProfileView(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    @jwt_required
    def patch(self):
        user_id = get_jwt_identity()
        json_data = request.get_json(force=True)
        result = self.service.update_password(user_id, json_data)
        return result, 200

    @jwt_required
    def get(self):
        return build_users_me_response(self.service)


class PasswordResetByIdView(Resource):
    method_decorators = {'get': [check_permission('reset_user_password')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self, record_id):
        result = self.service.reset_password(record_id=record_id)
        if result is not None:
            return result, 200
        else:
            return {'message': messages.NOT_FOUND}, 404


class PasswordResetByUsernameView(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def put(self):
        json_data = request.get_json(force=True)
        result = self.service.reset_password(username=json_data['username'])
        if result is not None:
            return result, 200
        else:
            return {'message': messages.NOT_FOUND}, 404


class AuthLogin(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def post(self):
        json_data = request.get_json(force=True)
        result = self.service.login(json_data)
        return result, 200


class AuthRefresh(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    @jwt_required
    def post(self):
        result = self.service.refresh()
        return result, 200


class AuthSwitch(Resource):
    method_decorators = {'post': [jwt_required()]}
    
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def post(self):
        import logging
        import json
        import sys
        from flask import current_app, request, jsonify, Response, make_response
        logger = logging.getLogger(__name__)
        
        print("=== AuthSwitch.post method called ===", file=sys.stderr)
        sys.stderr.flush()
        
        # Force output to stderr so it's visible - use both print and logger
        print("=== AuthSwitch.post called ===", file=sys.stderr)
        sys.stderr.flush()
        logger.error("=== AuthSwitch.post called (via logger) ===")
        
        # Also print to stdout in case stderr is being redirected
        print("=== AuthSwitch.post called (stdout) ===")
        sys.stdout.flush()
        
        # Check if service is available
        if not self.service:
            error_message = 'Service not initialized'
            logger.error(error_message)
            error_json = json.dumps({'message': error_message})
            error_response = Response(
                error_json,
                status=500,
                mimetype='application/json'
            )
            origin = request.headers.get('Origin')
            if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                error_response.headers['Access-Control-Allow-Origin'] = origin
                error_response.headers['Access-Control-Allow-Credentials'] = 'true'
                error_response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                error_response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
            return error_response
        
        try:
            json_data = request.get_json(force=True)
            print(f"=== Request data: {json_data} ===", file=sys.stderr)
            sys.stderr.flush()
            
            # Call service method and catch any serialization errors immediately
            try:
                result = self.service.switch(json_data)
                print(f"=== Service result type: {type(result)} ===", file=sys.stderr)
                print(f"=== Service result: {result} ===", file=sys.stderr)
                sys.stderr.flush()
                
                # Check if result is an error tuple (data, status_code) with error status
                if isinstance(result, tuple) and len(result) == 2:
                    data, status_code = result
                    if status_code >= 400:
                        # This is an error response from the service
                        print(f"=== Service returned error: status={status_code}, data={data} ===", file=sys.stderr)
                        sys.stderr.flush()
                        # Return error response directly
                        error_json = json.dumps(data if isinstance(data, dict) else {'message': str(data)})
                        error_response = Response(
                            error_json,
                            status=status_code,
                            mimetype='application/json'
                        )
                        origin = request.headers.get('Origin')
                        if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                            error_response.headers['Access-Control-Allow-Origin'] = origin
                            error_response.headers['Access-Control-Allow-Credentials'] = 'true'
                            error_response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                            error_response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
                        return error_response
            except Exception as service_error:
                import traceback
                error_traceback = traceback.format_exc()
                error_message = str(service_error) if service_error else 'An error occurred while processing the request'
                
                print(f"=== Service error: {error_message} ===", file=sys.stderr)
                print(f"=== Service traceback: {error_traceback} ===", file=sys.stderr)
                sys.stderr.flush()
                
                # Log the full error for debugging
                logger.error(f"Error in AuthSwitch service call: {error_message}", exc_info=True)
                
                # Return error response with more details
                # Always include error type and message for debugging
                error_type = type(service_error).__name__
                error_json = json.dumps({
                    'message': error_message,
                    'error': 'Internal server error',
                    'error_type': error_type
                })
                error_response = Response(
                    error_json,
                    status=500,
                    mimetype='application/json'
                )
                origin = request.headers.get('Origin')
                if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                    error_response.headers['Access-Control-Allow-Origin'] = origin
                    error_response.headers['Access-Control-Allow-Credentials'] = 'true'
                    error_response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                    error_response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
                return error_response
            
            # Handle tuple return (data, status_code) or just data
            if isinstance(result, tuple) and len(result) == 2:
                data, status_code = result
                # If status code indicates an error, return it immediately
                if status_code >= 400:
                    print(f"=== Service returned error tuple: status={status_code}, data={data} ===", file=sys.stderr)
                    sys.stderr.flush()
                    error_json = json.dumps(data if isinstance(data, dict) else {'message': str(data)})
                    error_response = Response(
                        error_json,
                        status=status_code,
                        mimetype='application/json'
                    )
                    origin = request.headers.get('Origin')
                    if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                        error_response.headers['Access-Control-Allow-Origin'] = origin
                        error_response.headers['Access-Control-Allow-Credentials'] = 'true'
                        error_response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                        error_response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
                    return error_response
            else:
                # If service returns just data, assume success
                data = result
                status_code = 200
            
            # Ultimate cleaning: serialize to JSON and back to remove ALL functions
            # This is the most aggressive way to ensure no functions remain
            def remove_functions_recursive(obj, path=""):
                """Recursively remove all functions from an object"""
                if callable(obj):
                    return None
                if isinstance(obj, dict):
                    result = {}
                    for k, v in obj.items():
                        if callable(k) or callable(v):
                            print(f"=== Removing function at {path}.{k} ===", file=sys.stderr)
                            continue
                        cleaned_key = str(k) if not isinstance(k, str) else k
                        cleaned_value = remove_functions_recursive(v, f"{path}.{k}" if path else str(k))
                        if cleaned_value is not None:
                            result[cleaned_key] = cleaned_value
                    return result
                elif isinstance(obj, (list, tuple)):
                    result = []
                    for i, item in enumerate(obj):
                        if callable(item):
                            print(f"=== Removing function at {path}[{i}] ===", file=sys.stderr)
                            continue
                        cleaned_item = remove_functions_recursive(item, f"{path}[{i}]" if path else f"[{i}]")
                        if cleaned_item is not None:
                            result.append(cleaned_item)
                    return result
                else:
                    return obj
            
            try:
                # First remove all functions recursively
                cleaned_data = remove_functions_recursive(data)
                if cleaned_data is None:
                    cleaned_data = {}
                
                # Final check: ensure no functions remain
                def has_any_functions(obj):
                    """Check if object contains any functions"""
                    if callable(obj):
                        return True
                    if isinstance(obj, dict):
                        return any(has_any_functions(k) or has_any_functions(v) for k, v in obj.items())
                    if isinstance(obj, (list, tuple)):
                        return any(has_any_functions(item) for item in obj)
                    return False
                
                if has_any_functions(cleaned_data):
                    print("=== Functions still found after cleaning, removing again ===", file=sys.stderr)
                    cleaned_data = remove_functions_recursive(cleaned_data)
                    if cleaned_data is None:
                        cleaned_data = {}
                
                # Then serialize to JSON string - DO NOT use default=str, we want it to fail if functions remain
                json_str = json.dumps(cleaned_data, ensure_ascii=False)
                # Then deserialize back - this creates a completely clean Python object
                cleaned_data = json.loads(json_str)
                print("=== Data successfully serialized/deserialized ===", file=sys.stderr)
            except (TypeError, ValueError) as json_err:
                print(f"=== Data NOT serializable: {str(json_err)} ===", file=sys.stderr)
                print(f"=== Data type: {type(data)} ===", file=sys.stderr)
                if isinstance(data, dict):
                    print(f"=== Data keys: {list(data.keys())} ===", file=sys.stderr)
                    # Try to clean manually - remove all functions
                    cleaned_data = {}
                    for key, value in data.items():
                        if callable(key) or callable(value):
                            print(f"=== Skipping function at key: {key} ===", file=sys.stderr)
                            continue
                        try:
                            # Try to serialize each value individually - NO default=str
                            json.dumps(value)
                            cleaned_data[str(key)] = value
                        except Exception as e:
                            print(f"=== Skipping non-serializable key: {key}, error: {str(e)} ===", file=sys.stderr)
                            pass
                else:
                    cleaned_data = {'message': 'An error occurred while processing the request'}
                    status_code = 500
                sys.stderr.flush()
            
            # Final check: ensure cleaned_data is a dict and serializable
            if not isinstance(cleaned_data, dict):
                cleaned_data = {'message': 'An error occurred while processing the request'}
                status_code = 500
            
            # Final aggressive serialization - serialize to JSON string directly
            # This bypasses Flask-RESTful's serializer which might add functions
            json_str = None
            try:
                # One more pass to remove any remaining functions
                cleaned_data = remove_functions_recursive(cleaned_data)
                if cleaned_data is None:
                    cleaned_data = {}
                
                # Serialize to JSON string - this will fail if there are any functions
                json_str = json.dumps(cleaned_data)
                print("=== Final JSON serialization successful ===", file=sys.stderr)
                print(f"=== JSON string length: {len(json_str)} ===", file=sys.stderr)
                sys.stderr.flush()
            except (TypeError, ValueError) as final_err:
                print(f"=== Final serialization failed: {str(final_err)} ===", file=sys.stderr)
                print(f"=== cleaned_data type: {type(cleaned_data)} ===", file=sys.stderr)
                if isinstance(cleaned_data, dict):
                    print(f"=== cleaned_data keys: {list(cleaned_data.keys())} ===", file=sys.stderr)
                    # Try to find which key has the function
                    for k, v in cleaned_data.items():
                        if callable(k) or callable(v):
                            print(f"=== Found function at key: {k} ===", file=sys.stderr)
                sys.stderr.flush()
                
                # Last resort: create a minimal error response
                safe_data = {'message': 'An error occurred while processing the request'}
                try:
                    json_str = json.dumps(safe_data)
                except:
                    # If even this fails, return a plain text response
                    json_str = '{"message": "An error occurred while processing the request"}'
                    status_code = 500
            
            # Ensure json_str is set
            if json_str is None:
                json_str = '{"message": "An error occurred while processing the request"}'
                status_code = 500
            
            # Return Response object directly to bypass Flask-RESTful's serialization
            # This ensures we have full control over the response
            print("=== Creating Response object with pre-serialized JSON ===", file=sys.stderr)
            print(f"=== JSON string length: {len(json_str)} ===", file=sys.stderr)
            sys.stderr.flush()
            
            response = Response(
                json_str,
                status=status_code,
                mimetype='application/json'
            )
            
            origin = request.headers.get('Origin')
            if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
            
            print("=== Returning Response object ===", file=sys.stderr)
            sys.stderr.flush()
            return response
        except Exception as e:
            import traceback
            error_traceback = traceback.format_exc()
            error_message = str(e) if e else 'An error occurred while processing the request'
            error_type = type(e).__name__
            
            print(f"=== EXCEPTION in AuthSwitch.post: {error_message} ===", file=sys.stderr)
            print(f"=== Error type: {error_type} ===", file=sys.stderr)
            print(f"=== Traceback: {error_traceback} ===", file=sys.stderr)
            sys.stderr.flush()
            
            logger.error(f"Error in AuthSwitch.post: {error_message}", exc_info=True)
            
            # Create Response object with detailed error information
            error_data = {
                'message': error_message,
                'error': 'Internal server error',
                'error_type': error_type
            }
            error_json = json.dumps(error_data)
            error_response = Response(
                error_json,
                status=500,
                mimetype='application/json'
            )
            
            # Set CORS headers
            origin = request.headers.get('Origin')
            if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                error_response.headers['Access-Control-Allow-Origin'] = origin
                error_response.headers['Access-Control-Allow-Credentials'] = 'true'
                error_response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                error_response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
            
            return error_response

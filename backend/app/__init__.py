import logging

from flask import Flask
from flask.logging import default_handler
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
# from healthcheck import HealthCheck  # Removed due to Python 3.13 compatibility

from app.celery import celery, init_celery
from app.config import setup_config
from app.constants.common import ADMIN_PREFIX, API_V1_PREFIX
from app.core import Feature
from app.logger import error_handler, info_handler
from app.rest.admin import admin_blueprint
from app.rest.v1 import api_v1
from app.shared import db, ma, mail


def create_app(**kwargs):
    app = Flask(__name__)

    config = setup_config(kwargs.get('app_env'))

    logger = logging.getLogger()
    logger.setLevel(config.log_level)
    logger.addHandler(info_handler)
    logger.addHandler(error_handler)
    
    # Add console handler for development - so errors are visible in terminal
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.ERROR)  # Only show errors in console
    console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)
    
    logger.removeHandler(default_handler)
    logger.info("Info logging is enabled")
    logger.error("Error logging is enabled")
    if config.log_level in ["DEBUG", "INFO", "NOTSET"]:
        logging.getLogger('werkzeug').disabled = True

    app.config['PROPAGATE_EXCEPTIONS'] = True
    app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = config.token_expiration
    app.config['SQLALCHEMY_DATABASE_URI'] = config.database_url
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_recycle': 160,
        'pool_pre_ping': True
    }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['FEATURES_CONFIG'] = config.features_config

    app.config['MAIL_SERVER'] = config.mail_server
    app.config['MAIL_PORT'] = config.mail_port
    app.config['MAIL_USERNAME'] = config.mail_username
    app.config['MAIL_PASSWORD'] = config.mail_password
    app.config['MAIL_USE_TLS'] = config.mail_use_tls
    app.config['MAIL_USE_SSL'] = config.mail_use_ssl
    app.config['MAIL_DEFAULT_SENDER'] = config.mail_default_sender

    if not kwargs.get('celery_worker'):
        init_celery(celery, app)

    # main init
    Feature(app)
    ma.init_app(app)
    mail.init_app(app)
    migrate = Migrate(compare_type=True)
    migrate.init_app(app, db)

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "expose_headers": ["content-range", "Content-Range"],
            "cors_methods": ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Origin", "Accept"],
            "supports_credentials": True
        }})
    
    # Ensure CORS headers are set on all responses, including Flask-RESTful responses
    @app.after_request
    def after_request(response):
        from flask import request
        origin = request.headers.get('Origin')
        if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
            # Always set CORS headers (override any existing ones to ensure they're correct)
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
            
            # Ensure Content-Range is exposed
            existing_expose = response.headers.get('Access-Control-Expose-Headers', '')
            expose_headers = ['content-range', 'Content-Range', 'Content-Type']
            if existing_expose:
                existing_list = [h.strip() for h in existing_expose.split(',')]
                expose_headers.extend([h for h in existing_list if h not in expose_headers])
            response.headers['Access-Control-Expose-Headers'] = ', '.join(expose_headers)
            
            # Log Content-Range header for debugging
            if 'content-range' in response.headers or 'Content-Range' in response.headers:
                logger.info(f"CORS: Content-Range header present: {response.headers.get('content-range') or response.headers.get('Content-Range')}")
        return response
    
    # Add error handler for Flask-RESTful HTTPException (from abort())
    @app.errorhandler(500)
    @app.errorhandler(422)
    @app.errorhandler(404)
    @app.errorhandler(400)
    def handle_http_error(e):
        from flask import request, jsonify
        from werkzeug.exceptions import HTTPException
        import json
        
        # Get error details - ensure message is always a plain string
        if isinstance(e, HTTPException):
            code = e.code
            # Flask-RESTful's abort() stores message in e.data
            message = str(e) if e else 'An error occurred'
            if hasattr(e, 'data') and isinstance(e.data, dict) and 'message' in e.data:
                data_msg = e.data['message']
                # Ensure it's a string, not an object with functions
                message = str(data_msg) if data_msg else message
            elif hasattr(e, 'description'):
                desc = e.description
                message = str(desc) if desc else message
        else:
            code = 500
            message = str(e) if e else 'An error occurred'
        
        # Ensure message is a plain string (no functions or complex objects)
        try:
            # Test if message is JSON serializable
            json.dumps(message)
        except (TypeError, ValueError):
            # If not, convert to string
            message = 'An error occurred while processing the request'
        
        # Log the error
        logger.error(f"HTTP error {code}: {message}")
        
        # Create error response - ensure all values are plain strings
        error_response = {
            'error': str(message),
            'message': str(message)
        }
        
        # Test serialization before creating response
        try:
            json.dumps(error_response)
        except (TypeError, ValueError) as json_err:
            logger.error(f"Error response not serializable: {str(json_err)}")
            error_response = {
                'error': 'An error occurred while processing the request',
                'message': 'An error occurred while processing the request'
            }
        
        response = jsonify(error_response)
        response.status_code = code
        
        # Set CORS headers
        origin = request.headers.get('Origin')
        if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
        
        return response
    
    # Add error handler to ensure CORS headers are set on all other exceptions
    @app.errorhandler(Exception)
    def handle_exception(e):
        from flask import request, jsonify
        from werkzeug.exceptions import HTTPException
        import traceback
        import json
        import os
        
        # Handle HTTPException (from Flask-RESTful abort())
        if isinstance(e, HTTPException):
            code = e.code
            message = str(e.description) if hasattr(e, 'description') and e.description else str(e) if e else 'An error occurred'
        else:
            # Log non-HTTP exceptions
            logger.error(f"Unhandled exception: {str(e)}")
            logger.error(traceback.format_exc())
            code = 500
            message = str(e) if e else 'An error occurred'
        
        # Ensure message is a plain string (no functions or complex objects)
        try:
            # Test if message is JSON serializable
            json.dumps(message)
        except (TypeError, ValueError):
            # If not, use generic message
            message = 'An error occurred while processing the request'
        
        # Create error response with error type for debugging
        error_type = type(e).__name__
        is_development = os.getenv('FLASK_ENV') == 'development' or os.getenv('APP_ENV') == 'development'
        
        if isinstance(e, HTTPException):
            error_message = str(message)
        else:
            # In development, show actual error; in production, show generic
            error_message = str(message) if is_development else 'An error occurred while processing the request'
        
        error_response = {
            'error': error_message,
            'message': error_message,
            'error_type': error_type
        }
        
        # Test serialization before creating response
        try:
            json.dumps(error_response)
        except (TypeError, ValueError) as json_err:
            logger.error(f"Error response not serializable: {str(json_err)}")
            error_response = {
                'error': 'An error occurred while processing the request',
                'message': 'An error occurred while processing the request',
                'error_type': error_type
            }
        
        response = jsonify(error_response)
        response.status_code = code
        
        # Set CORS headers
        origin = request.headers.get('Origin')
        if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
        
        return response
    
    jwt = JWTManager(app)
    
    # Add custom JSON encoder to handle functions and other non-serializable objects
    import json
    from json import JSONEncoder
    
    class SafeJSONEncoder(JSONEncoder):
        def default(self, obj):
            if callable(obj):
                return None  # Remove functions
            try:
                return super().default(obj)
            except TypeError:
                return str(obj)
    
    # Configure JWT to use the safe encoder
    app.config['JWT_JSON_ENCODER'] = SafeJSONEncoder
    
    # HealthCheck(app, "/healthcheck")  # Removed due to Python 3.13 compatibility

    # Direct Flask route for GET /api/v1/users/me to bypass Flask-RESTful (avoids 500 from representation layer)
    from flask_jwt_extended import jwt_required
    @app.route('/api/v1/users/me', methods=['GET'])
    @jwt_required()
    def users_me_direct():
        from app.rest.v1.user import UserService
        from app.rest.v1.user.resource import build_users_me_response
        return build_users_me_response(UserService())

    app.register_blueprint(api_v1, url_prefix=API_V1_PREFIX)
    app.register_blueprint(admin_blueprint, url_prefix=ADMIN_PREFIX)
    
    # Add a simple test route to bypass Flask-RESTful
    @app.route('/api/v1/test')
    def test_route():
        return {'status': 'success', 'message': 'Test route works'}
    
    # Add a users/profile route that delegates to ProfileView
    # This route exists because frontend calls /users/profile instead of /users/me
    @app.route('/api/v1/users/profile')
    def users_profile():
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        from app.rest.v1.user import UserService
        from app.rest.v1.user.schema import get_available_roles
        from app.rest.v1.user_role import UserRoleService
        
        try:
            verify_jwt_in_request()
            user_identity = get_jwt_identity()
            
            if not user_identity:
                return {'message': 'User not authenticated'}, 401
            
            # Get the actual user ID (handle both integer ID and dict with original_id)
            user_id = user_identity
            if isinstance(user_identity, dict):
                user_id = user_identity.get('original_id') or user_identity.get('id')
            
            if not user_id:
                return {'message': 'User ID not found'}, 401
            
            # Get the user service and user record
            user_service = UserService()
            user_record = user_service.model.get_one(user_id)
            
            if not user_record:
                return {'message': 'User not found'}, 404
            
            # Get user data with schema
            user_schema = user_service.schema()
            user_data = user_schema.dump(user_record)
            
            # Get user roles - filter to only approved roles
            from app.rest.v1.user_role.model import UserRole
            from datetime import date
            today = date.today()
            
            # Get all user roles for this user
            all_user_roles = UserRole.query.filter_by(
                user_id=user_id,
                is_approved=True
            ).all()
            
            # Filter based on delegation and date logic
            available_roles = []
            for user_role in all_user_roles:
                # Include non-delegated roles
                if user_role.is_delegated == False:
                    available_roles.append(user_role)
                # Include delegated roles that are within date range
                elif (user_role.start_date and user_role.end_date and 
                      user_role.start_date <= today and user_role.end_date >= today):
                    available_roles.append(user_role)
            
            # Serialize user roles with role information
            user_role_service = UserRoleService()
            user_role_schema = user_role_service.schema()
            user_roles_data = []
            
            for user_role in available_roles:
                try:
                    role_data = user_role_schema.dump(user_role)
                    # Remove any nested relationships that might cause serialization issues
                    # Keep only the basic fields we need
                    role_data_clean = {
                        'id': role_data.get('id'),
                        'user_id': role_data.get('user_id'),
                        'role_id': role_data.get('role_id'),
                        'is_approved': role_data.get('is_approved'),
                        'is_delegator': role_data.get('is_delegator'),
                        'is_delegated': role_data.get('is_delegated'),
                        'delegated_by': role_data.get('delegated_by'),
                        'approved_by': role_data.get('approved_by'),
                        'start_date': role_data.get('start_date'),
                        'end_date': role_data.get('end_date'),
                        'allowed_organization_ids': role_data.get('allowed_organization_ids'),
                        'allowed_project_ids': role_data.get('allowed_project_ids')
                    }
                    role_data = role_data_clean
                except Exception as dump_err:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Error dumping user_role: {str(dump_err)}")
                    # Create minimal role_data if dump fails
                    role_data = {
                        'id': user_role.id,
                        'user_id': user_role.user_id,
                        'role_id': user_role.role_id,
                        'is_approved': user_role.is_approved,
                        'is_delegator': user_role.is_delegator,
                        'is_delegated': user_role.is_delegated
                    }
                
                # Include the role name and details
                if user_role.role:
                    # Ensure permissions and phase_ids are JSON-serializable
                    permissions = user_role.role.permissions
                    if permissions is not None and not isinstance(permissions, (dict, list, str, int, float, bool, type(None))):
                        # If it's not a basic type, try to convert it
                        try:
                            import json
                            permissions = json.loads(json.dumps(permissions, default=str))
                        except:
                            permissions = None
                    
                    phase_ids = user_role.role.phase_ids
                    if phase_ids is not None and not isinstance(phase_ids, (dict, list, str, int, float, bool, type(None))):
                        # If it's not a basic type, try to convert it
                        try:
                            import json
                            phase_ids = json.loads(json.dumps(phase_ids, default=str))
                        except:
                            phase_ids = []
                    
                    role_data['role'] = {
                        'id': user_role.role.id,
                        'name': user_role.role.name,
                        'permissions': permissions,
                        'phase_ids': phase_ids,
                        'organization_level': user_role.role.organization_level
                    }
                user_roles_data.append(role_data)
            
            # Serialize organization if it exists - use only basic fields to avoid nested relationship issues
            organization_data = None
            if user_record.organization:
                try:
                    # Only include basic fields to avoid circular references and nested relationship issues
                    organization_data = {
                        'id': user_record.organization.id,
                        'code': user_record.organization.code,
                        'name': user_record.organization.name,
                        'parent_id': user_record.organization.parent_id,
                        'management_id': user_record.organization.management_id,
                        'level': user_record.organization.level if hasattr(user_record.organization, 'level') else None,
                        'additional_data': user_record.organization.additional_data if hasattr(user_record.organization, 'additional_data') else None
                    }
                except Exception as org_err:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Error serializing organization: {str(org_err)}")
                    # If organization serialization fails, just include the ID
                    organization_data = {
                        'id': user_record.organization.id if user_record.organization else None
                    }
            
            # Build response and serialize with default= to handle date, Decimal, numpy, etc.
            from flask import Response
            import json

            result = {
                'id': user_data.get('id'),
                'username': user_data.get('username'),
                'full_name': user_data.get('full_name'),
                'email': user_data.get('email'),
                'organization_id': user_data.get('organization_id'),
                'user_roles': user_roles_data,
                'organization': organization_data
            }

            def _safe_default(obj):
                try:
                    if hasattr(obj, 'isoformat'):
                        return obj.isoformat()
                    return str(obj)
                except Exception:
                    return repr(obj) if obj is not None else None

            body = json.dumps(result, default=_safe_default)
            return Response(body, status=200, mimetype='application/json')
        except Exception as e:
            import traceback
            from flask import Response
            import json
            traceback.print_exc()
            try:
                err_body = json.dumps({
                    'message': 'An error occurred while processing the request',
                    'error': 'Invalid response data',
                    'debug': f'{type(e).__name__}: {str(e)}'
                }, default=str)
            except Exception:
                err_body = '{"message":"An error occurred while processing the request","error":"Invalid response data"}'
            return Response(err_body, status=500, mimetype='application/json')

    # Add missing API endpoints for dashboard
    @app.route('/api/v1/reports/projects-count')
    def projects_count():
        from flask import jsonify
        response = jsonify({'count': 0})
        response.headers['Content-Range'] = 'reports 0-0/0'
        return response, 200
    
    # Add missing appeals endpoint
    @app.route('/api/v1/appeals', methods=['GET', 'OPTIONS'])
    def appeals():
        from flask import request, jsonify
        if request.method == 'OPTIONS':
            response = jsonify({})
            response.status_code = 200
            origin = request.headers.get('Origin')
            if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
                response.headers['Access-Control-Max-Age'] = '3600'
            return response
        response = jsonify({'data': [], 'total': 0})
        response.headers['Content-Range'] = 'appeals 0-0/0'
        return response, 200
    
    # Add missing interventions endpoint
    @app.route('/api/v1/interventions', methods=['GET', 'OPTIONS'])
    def interventions():
        from flask import request, jsonify
        if request.method == 'OPTIONS':
            response = jsonify({})
            response.status_code = 200
            origin = request.headers.get('Origin')
            if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
                response.headers['Access-Control-Max-Age'] = '3600'
            return response
        # Return empty list for now - this can be replaced with actual data later
        # The frontend expects an array directly, not wrapped in {'data': []}
        response = jsonify([])
        response.headers['Content-Range'] = 'interventions 0-0/0'
        return response, 200
    
    # Add missing project-details endpoint
    @app.route('/api/v1/project-details/<int:id>')
    def project_details(id):
        from flask import jsonify
        from app.rest.v1.project_detail.model import ProjectDetail
        try:
            detail = ProjectDetail.query.get(id)
            if detail:
                # Create a simple dict representation
                detail_data = {
                    'id': detail.id,
                    'project_id': detail.project_id,
                    'phase_id': detail.phase_id,
                    'start_date': detail.start_date.isoformat() if detail.start_date else None,
                    'end_date': detail.end_date.isoformat() if detail.end_date else None,
                    'summary': detail.summary,
                    'problem_statement': detail.problem_statement,
                    'goal': detail.goal,
                    'created_by': detail.created_by,
                    'modified_by': detail.modified_by,
                    'created_on': detail.created_on.isoformat() if detail.created_on else None,
                    'modified_on': detail.modified_on.isoformat() if detail.modified_on else None
                }
                response = jsonify(detail_data)
                response.headers['Content-Range'] = 'project-details 0-0/1'
                return response, 200
            else:
                return jsonify({'error': 'Project detail not found'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    with app.app_context():
        db.init_app(app)
        # Import all models to ensure they're registered before create_all()
        from app.rest.v1.function.model import Function  # noqa: F401
        from app.rest.v1.fund_source.model import FundSource  # noqa: F401
        from app.rest.v1.cost_category.model import CostCategory  # noqa: F401
        from app.rest.v1.cost_classification.model import CostClassification  # noqa: F401
        # db.session = db.create_scoped_session()
        db.create_all()

    return app

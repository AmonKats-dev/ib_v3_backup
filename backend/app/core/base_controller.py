from app.constants import messages
from app.utils import common_parser, validate_schema
from flask import json, request, jsonify
from flask_jwt_extended import jwt_required
from flask_restful import Resource
import logging

logger = logging.getLogger(__name__)


class BaseList(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        try:
            args = common_parser.parse_args()
            filters = json.loads(args['filter']) if args.get('filter') else dict()

            total = self.service.get_total(filters)
            result = self.service.get_all(args, filters)
        except Exception as e:
            logger.error(f"Error in GET request for {self.__class__.__name__}: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            error_response = jsonify({
                'error': str(e),
                'message': str(e)
            })
            error_response.status_code = 500
            origin = request.headers.get('Origin')
            if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                error_response.headers['Access-Control-Allow-Origin'] = origin
                error_response.headers['Access-Control-Allow-Credentials'] = 'true'
            return error_response
        
        # Ensure total is always a number
        if total is None:
            total = 0
        
        # Format Content-Range header: "{start}-{end}/{total}" or "*/{total}" if empty
        # Calculate the correct range based on pagination
        page = args.get('page', 1) or 1
        per_page = args.get('per_page', 10) or 10
        
        if isinstance(result, list):
            result_len = len(result)
            if result_len > 0:
                # Calculate start and end indices based on pagination
                if per_page == -1:
                    # No pagination - return all items
                    start_index = 0
                    end_index = result_len - 1
                else:
                    # Paginated response
                    start_index = (page - 1) * per_page
                    end_index = start_index + result_len - 1
                
                content_range = f"{start_index}-{end_index}/{total}"
            else:
                # Empty result
                if per_page == -1:
                    content_range = f"*/{total}"
                else:
                    start_index = (page - 1) * per_page
                    content_range = f"{start_index}-{start_index - 1}/{total}" if start_index > 0 else f"*/{total}"
        else:
            # Not a list result
            content_range = f"*/{total}"

        # Create response with proper headers
        response = jsonify(result)
        response.status_code = 200
        response.headers['content-range'] = content_range
        response.headers['Content-Range'] = content_range
        
        # Ensure CORS headers are set
        origin = request.headers.get('Origin')
        if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
        
        logger.info(f"Content-Range header set: {content_range}, total: {total}, result_len: {len(result) if isinstance(result, list) else 'N/A'}, page: {page}, per_page: {per_page}")
        
        return response

    def options(self):
        # Handle CORS preflight requests
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

    def post(self):
        try:
            json_data = request.get_json(force=True)
            logger.info(f"POST request received for {self.__class__.__name__}")
            logger.info(f"Request data keys: {list(json_data.keys()) if json_data else 'None'}")
            if 'user_roles' in json_data:
                logger.info(f"user_roles in request: {json_data.get('user_roles', None)}")
            result = self.service.create(json_data)
            if result is None:
                # This should not happen, but handle it gracefully
                logger.error("Service.create returned None")
                raise ValueError("Failed to create resource: service returned None")
            
            response = jsonify(result)
            response.status_code = 201
            # Ensure CORS headers are set
            origin = request.headers.get('Origin')
            if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Credentials'] = 'true'
                response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
            return response
        except Exception as e:
            # Handle HTTPException from abort() calls
            from werkzeug.exceptions import HTTPException
            if isinstance(e, HTTPException):
                # Flask-RESTful's abort() stores message in e.data
                error_message = str(e)
                if hasattr(e, 'data') and isinstance(e.data, dict) and 'message' in e.data:
                    error_message = e.data['message']
                elif hasattr(e, 'description'):
                    error_message = e.description
                
                # Log the error
                logger.error(f"HTTP error in POST request: {error_message}")
                
                error_response = jsonify({
                    'error': error_message,
                    'message': error_message
                })
                error_response.status_code = e.code if hasattr(e, 'code') else 500
            else:
                # Log the error for other exceptions
                logger.error(f"Error in POST request: {str(e)}")
                import traceback
                logger.error(traceback.format_exc())
                
                # Create error response with CORS headers
                error_response = jsonify({
                    'error': str(e),
                    'message': str(e)  # Return actual error message instead of generic one
                })
                error_response.status_code = 500
            
            # Ensure CORS headers are set on error response
            origin = request.headers.get('Origin')
            if origin and origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
                error_response.headers['Access-Control-Allow-Origin'] = origin
                error_response.headers['Access-Control-Allow-Credentials'] = 'true'
                error_response.headers['Access-Control-Allow-Methods'] = 'GET, PUT, POST, DELETE, OPTIONS, PATCH'
                error_response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept'
            
            return error_response


class BaseView(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self, record_id):
        result = self.service.get_one(record_id)
        if result is not None:
            return result, 200
        else:
            return {'message': messages.NOT_FOUND}, 404

    def put(self, record_id):
        return self.__update(record_id)

    def patch(self, record_id):
        return self.__update(record_id, True)

    def __update(self, record_id, partial=False):
        json_data = request.get_json(force=True)

        result = self.service.update(record_id, json_data, partial)
        return result, 200

    def delete(self, record_id):
        result = self.service.delete(record_id)
        return {"id": record_id, "previousData": result}, 200

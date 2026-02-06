from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask import request
from flask_jwt_extended import jwt_required, verify_jwt_in_request
from flask_restful import Resource


class ProjectList(BaseList):
    method_decorators = {'get': [check_permission('list_projects')],
                         'post': [check_permission('create_project')]}


class ProjectView(BaseView):
    method_decorators = {'get': [check_permission('view_project')],
                         'put': [check_permission('edit_project')],
                         'patch': [check_permission('edit_project')],
                         'delete': [check_permission('delete_project')]}


class ProjectActionView(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def post(self, record_id):
        import logging
        import traceback
        logger = logging.getLogger(__name__)
        
        # Manually verify JWT instead of using decorator to avoid Flask-RESTful parameter issues
        # This is necessary because @jwt_required decorator conflicts with Flask-RESTful's URL parameter passing
        try:
            verify_jwt_in_request()
        except Exception as jwt_error:
            logger.error(f"JWT verification failed: {str(jwt_error)}")
            from flask_restful import abort
            abort(401, message="Authentication required")
        
        try:
            json_data = request.get_json(force=True)
            logger.info(f"ProjectActionView.post - record_id: {record_id}, data: {json_data}")
            
            if not json_data:
                from flask_restful import abort
                from app.constants import messages
                logger.error("ProjectActionView.post - No request body provided")
                abort(400, message="Request body is required")
            
            result = self.service.manage_actions(
                project_id=record_id, data=json_data)
            
            logger.info(f"ProjectActionView.post - Result: {result is not None}")
            
            if result is None:
                from flask_restful import abort
                logger.error("ProjectActionView.post - manage_actions returned None")
                abort(422, message="Workflow action could not be completed. No result returned.")
            
            return result, 200
        except Exception as e:
            logger.error(f"Error in ProjectActionView.post: {str(e)}")
            logger.error(traceback.format_exc())
            from flask_restful import abort
            from app.constants import messages
            # Re-raise HTTP exceptions (from abort) as-is
            from werkzeug.exceptions import HTTPException
            if isinstance(e, HTTPException):
                raise
            abort(500, message=f"An error occurred while processing the request: {str(e)}")


class ProjectBulkActionView(Resource):
    method_decorators = {'post': [jwt_required]}
    
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def post(self):
        json_data = request.get_json(force=True)
        result = self.service.manage_bulk_actions(data=json_data)
        return result, 200

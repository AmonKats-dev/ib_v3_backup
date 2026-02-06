from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask_restful import abort


class ProjectManagementList(BaseList):
    method_decorators = {'get': [check_permission('list_project_management')],
                         'post': [check_permission('create_project_management')]}


class ProjectManagementView(BaseView):
    method_decorators = {'get': [check_permission('view_project_management')],
                         'put': [check_permission('edit_project_management')],
                         'patch': [check_permission('edit_project_management')]}

    def delete(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

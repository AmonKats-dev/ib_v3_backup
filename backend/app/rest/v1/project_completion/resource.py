from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask_restful import abort


class ProjectCompletionList(BaseList):
    method_decorators = {
        'post': [check_permission('create_project_completion')]}

    def get(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)


class ProjectCompletionView(BaseView):
    method_decorators = {'get': [check_permission('view_project_completion')],
                         'put': [check_permission('edit_project_completion')],
                         'patch': [check_permission('edit_project_completion')]}

    def delete(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

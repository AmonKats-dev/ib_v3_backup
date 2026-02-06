from flask_restful import abort

from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class ProjectDetailList(BaseList):
    method_decorators = {'get': [check_permission('view_project')]}

    def post(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)


class ProjectDetailView(BaseView):
    method_decorators = {'get': [check_permission('view_project')],
                         'put': [check_permission('edit_project')],
                         'patch': [check_permission('edit_project')]}

    def delete(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

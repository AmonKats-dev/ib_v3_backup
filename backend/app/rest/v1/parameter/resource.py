from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask_restful import abort


class ParameterList(BaseList):
    method_decorators = {'get': [check_permission('list_parameters')]}

    def post(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)


class ParameterView(BaseView):
    method_decorators = {'get': [check_permission('view_parameter')],
                         'put': [check_permission('edit_parameter')],
                         'patch': [check_permission('edit_parameter')]}

    def delete(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

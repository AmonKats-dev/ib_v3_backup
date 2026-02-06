from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class FunctionList(BaseList):
    method_decorators = {'get': [check_permission('list_functions')],
                         'post': [check_permission('create_function')]}


class FunctionView(BaseView):
    method_decorators = {'get': [check_permission('view_function')],
                         'put': [check_permission('edit_function')],
                         'patch': [check_permission('edit_function')],
                         'delete': [check_permission('delete_function')]}

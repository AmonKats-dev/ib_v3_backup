from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class ProgramList(BaseList):
    method_decorators = {'get': [check_permission('list_programs')],
                         'post': [check_permission('create_program')]}


class ProgramView(BaseView):
    method_decorators = {'get': [check_permission('view_program')],
                         'put': [check_permission('edit_program')],
                         'patch': [check_permission('edit_program')],
                         'delete': [check_permission('delete_program')]}

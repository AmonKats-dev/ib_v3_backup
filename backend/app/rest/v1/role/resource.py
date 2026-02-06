
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class RoleList(BaseList):
    method_decorators = {'get': [check_permission('list_roles')],
                         'post': [check_permission('create_role')]}


class RoleView(BaseView):
    method_decorators = {'get': [check_permission('view_role')],
                         'put': [check_permission('edit_role')],
                         'patch': [check_permission('edit_role')],
                         'delete': [check_permission('delete_role')]}

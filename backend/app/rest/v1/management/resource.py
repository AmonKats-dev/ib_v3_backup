from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class ManagementList(BaseList):
    method_decorators = {'get': [check_permission('list_managements')],
                         'post': [check_permission('create_management')]}


class ManagementView(BaseView):
    method_decorators = {'get': [check_permission('view_management')],
                         'put': [check_permission('edit_management')],
                         'patch': [check_permission('edit_management')],
                         'delete': [check_permission('delete_management')]}

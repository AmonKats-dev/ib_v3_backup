from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class CycleList(BaseList):
    method_decorators = {'get': [check_permission('list_cycles')],
                         'post': [check_permission('create_cycle')]}


class CycleView(BaseView):
    method_decorators = {'get': [check_permission('view_cycle')],
                         'put': [check_permission('edit_cycle')],
                         'patch': [check_permission('edit_cycle')],
                         'delete': [check_permission('delete_cycle')]}

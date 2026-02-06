from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class CostingList(BaseList):
    method_decorators = {'get': [check_permission('list_costings')],
                         'post': [check_permission('create_costing')]}


class CostingView(BaseView):
    method_decorators = {'get': [check_permission('view_costing')],
                         'put': [check_permission('edit_costing')],
                         'patch': [check_permission('edit_costing')],
                         'delete': [check_permission('delete_costing')]}

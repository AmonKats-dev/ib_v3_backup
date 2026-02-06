from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class CostClassificationList(BaseList):
    method_decorators = {'get': [check_permission('list_parameters')],
                         'post': [check_permission('edit_parameter')]}


class CostClassificationView(BaseView):
    method_decorators = {'get': [check_permission('view_parameter')],
                         'put': [check_permission('edit_parameter')],
                         'patch': [check_permission('edit_parameter')],
                         'delete': [check_permission('edit_parameter')]}


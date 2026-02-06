from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class UnitList(BaseList):
    method_decorators = {'get': [check_permission('list_units')],
                         'post': [check_permission('create_unit')]}


class UnitView(BaseView):
    method_decorators = {'get': [check_permission('view_unit')],
                         'put': [check_permission('edit_unit')],
                         'patch': [check_permission('edit_unit')],
                         'delete': [check_permission('delete_unit')]}

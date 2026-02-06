from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class NdpSdgList(BaseList):
    method_decorators = {'get': [check_permission('list_ndp_strategies')],
                         'post': [check_permission('create_ndp_strategy')]}


class NdpSdgView(BaseView):
    method_decorators = {'get': [check_permission('view_ndp_strategy')],
                         'put': [check_permission('edit_ndp_strategy')],
                         'patch': [check_permission('edit_ndp_strategy')],
                         'delete': [check_permission('delete_ndp_strategy')]}

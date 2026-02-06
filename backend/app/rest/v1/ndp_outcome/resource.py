from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class NdpOutcomeList(BaseList):
    method_decorators = {'get': [check_permission('list_ndp_outcomes')],
                         'post': [check_permission('create_ndp_outcome')]}


class NdpOutcomeView(BaseView):
    method_decorators = {'get': [check_permission('view_ndp_outcome')],
                         'put': [check_permission('edit_ndp_outcome')],
                         'patch': [check_permission('edit_ndp_outcome')],
                         'delete': [check_permission('delete_ndp_outcome')]}

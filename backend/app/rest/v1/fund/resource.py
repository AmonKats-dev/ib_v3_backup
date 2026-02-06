from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class FundList(BaseList):
    method_decorators = {'get': [check_permission('list_funds')],
                         'post': [check_permission('create_fund')]}


class FundView(BaseView):
    method_decorators = {'get': [check_permission('view_fund')],
                         'put': [check_permission('edit_fund')],
                         'patch': [check_permission('edit_fund')],
                         'delete': [check_permission('delete_fund')]}

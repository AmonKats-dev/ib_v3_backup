from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class CurrencyList(BaseList):
    method_decorators = {'get': [check_permission('list_currencies')],
                         'post': [check_permission('create_currency')]}


class CurrencyView(BaseView):
    method_decorators = {'get': [check_permission('view_currency')],
                         'put': [check_permission('edit_currency')],
                         'patch': [check_permission('edit_currency')],
                         'delete': [check_permission('delete_currency')]}

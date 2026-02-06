from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class CurrencyRateList(BaseList):
    method_decorators = {'get': [check_permission('list_currency_rate_rates')],
                         'post': [check_permission('create_currency_rate')]}


class CurrencyRateView(BaseView):
    method_decorators = {'get': [check_permission('view_currency_rate')],
                         'put': [check_permission('edit_currency_rate')],
                         'patch': [check_permission('edit_currency_rate')],
                         'delete': [check_permission('delete_currency_rate')]}

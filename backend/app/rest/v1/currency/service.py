from app.core import BaseService
from app.signals import user_created

from .model import Currency
from .resource import CurrencyList, CurrencyView
from .schema import CurrencySchema


class CurrencyService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Currency
        self.schema = CurrencySchema
        self.resources = [
            {'resource': CurrencyList, 'url': '/currencies'},
            {'resource': CurrencyView, 'url': '/currencies/<int:record_id>'}
        ]

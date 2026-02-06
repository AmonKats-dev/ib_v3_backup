from app.core import BaseService
from app.signals import user_created

from .model import CurrencyRate
from .resource import CurrencyRateList, CurrencyRateView
from .schema import CurrencyRateSchema


class CurrencyRateService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = CurrencyRate
        self.schema = CurrencyRateSchema
        self.resources = [
            {'resource': CurrencyRateList, 'url': '/currency-rates'},
            {'resource': CurrencyRateView, 'url': '/currency-rates/<int:record_id>'}
        ]

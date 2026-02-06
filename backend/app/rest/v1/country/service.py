from app.core import BaseService
from app.signals import user_created

from .model import Country
from .resource import CountryList, CountryView
from .schema import CountrySchema


class CountryService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Country
        self.schema = CountrySchema
        self.resources = [
            {'resource': CountryList, 'url': '/countries'},
            {'resource': CountryView, 'url': '/countries/<int:record_id>'}
        ]

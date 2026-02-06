from app.core import BaseService
from app.signals import user_created

from .model import Location
from .resource import LocationList, LocationView
from .schema import LocationSchema


class LocationService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.exclude = {
            'get_all': ['parent', 'children']
        }
        self.model = Location
        self.schema = LocationSchema
        self.resources = [
            {'resource': LocationList, 'url': '/locations'},
            {'resource': LocationView, 'url': '/locations/<int:record_id>'}
        ]

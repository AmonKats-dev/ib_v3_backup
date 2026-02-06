from app.core import BaseService
from app.signals import user_created

from .model import Sector
from .resource import SectorList, SectorView
from .schema import SectorSchema


class SectorService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Sector
        self.schema = SectorSchema
        self.resources = [
            {'resource': SectorList, 'url': '/sectors'},
            {'resource': SectorView, 'url': '/sectors/<int:record_id>'}
        ]

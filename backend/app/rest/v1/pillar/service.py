from app.core import BaseService
from app.signals import user_created

from .model import Pillar
from .resource import PillarList, PillarView
from .schema import PillarSchema


class PillarService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Pillar
        self.schema = PillarSchema
        self.resources = [
            {'resource': PillarList, 'url': '/pillars'},
            {'resource': PillarView, 'url': '/pillars/<int:record_id>'}
        ]

from app.core import BaseService
from app.signals import user_created

from .model import Unit
from .resource import UnitList, UnitView
from .schema import UnitSchema


class UnitService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Unit
        self.schema = UnitSchema
        self.resources = [
            {'resource': UnitList, 'url': '/units'},
            {'resource': UnitView, 'url': '/units/<int:record_id>'}
        ]

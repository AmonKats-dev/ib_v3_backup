from app.core import BaseService
from app.signals import user_created

from .model import Module
from .resource import ModuleList, ModuleView
from .schema import ModuleSchema


class ModuleService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Module
        self.schema = ModuleSchema
        self.resources = [
            {'resource': ModuleList, 'url': '/modules'},
            {'resource': ModuleView, 'url': '/modules/<int:record_id>'}
        ]

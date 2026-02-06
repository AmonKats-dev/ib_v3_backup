from app.core import BaseService
from app.signals import user_created

from .model import Instance
from .resource import InstanceList, InstanceView
from .schema import InstanceSchema


class InstanceService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Instance
        self.schema = InstanceSchema
        self.resources = [
            {'resource': InstanceList, 'url': '/instances'},
            {'resource': InstanceView, 'url': '/instances/<int:record_id>'}
        ]

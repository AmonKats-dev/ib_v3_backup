from app.core import BaseService
from app.signals import user_created

from .model import Management
from .resource import ManagementList, ManagementView
from .schema import ManagementSchema


class ManagementService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Management
        self.schema = ManagementSchema
        self.resources = [
            {'resource': ManagementList, 'url': '/managements'},
            {'resource': ManagementView, 'url': '/managements/<int:record_id>'}
        ]

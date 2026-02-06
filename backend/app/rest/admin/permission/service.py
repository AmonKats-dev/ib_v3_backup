from app.core import BaseService
from app.signals import user_created

from .model import Permission
from .resource import PermissionList, PermissionView
from .schema import PermissionSchema


class PermissionService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Permission
        self.schema = PermissionSchema
        self.resources = [
            {'resource': PermissionList, 'url': '/permissions'},
            {'resource': PermissionView, 'url': '/permissions/<int:record_id>'}
        ]

from app.core import BaseService
from app.signals import user_created

from .model import Role
from .resource import RoleList, RoleView
from .schema import RoleSchema


class RoleService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Role
        self.schema = RoleSchema
        self.resources = [
            {'resource': RoleList, 'url': '/roles'},
            {'resource': RoleView, 'url': '/roles/<int:record_id>'}
        ]

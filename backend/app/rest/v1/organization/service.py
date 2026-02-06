from app.core import BaseService
from app.signals import user_created

from .model import Organization
from .resource import OrganizationList, OrganizationView
from .schema import OrganizationSchema


class OrganizationService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.exclude = {
            "get_all": ["parent", "children"]
        }
        self.model = Organization
        self.schema = OrganizationSchema
        self.resources = [
            {'resource': OrganizationList, 'url': '/organizations'},
            {'resource': OrganizationView, 'url': '/organizations/<int:record_id>'}
        ]

from app.core import BaseService
from app.signals import user_created

from .model import DonorProject
from .resource import DonorProjectList, DonorProjectView
from .schema import DonorProjectSchema


class DonorProjectService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = DonorProject
        self.schema = DonorProjectSchema
        self.resources = [
            {'resource': DonorProjectList, 'url': '/donor-projects'},
            {'resource': DonorProjectView, 'url': '/donor-projects/<int:record_id>'}
        ]

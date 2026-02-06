from app.core import BaseService
from app.signals import user_created

from .model import Program
from .resource import ProgramList, ProgramView
from .schema import ProgramSchema


class ProgramService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.exclude = {
            "get_all": ["parent", "children"]
        }
        self.model = Program
        self.schema = ProgramSchema
        self.resources = [
            {'resource': ProgramList, 'url': '/programs'},
            {'resource': ProgramView, 'url': '/programs/<int:record_id>'}
        ]

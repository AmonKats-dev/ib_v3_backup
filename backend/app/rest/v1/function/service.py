from app.core import BaseService
from app.signals import user_created

from .model import Function
from .resource import FunctionList, FunctionView
from .schema import FunctionSchema


class FunctionService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.exclude = {
            "get_all": ["parent", "children"]
        }
        self.model = Function
        self.schema = FunctionSchema
        self.resources = [
            {'resource': FunctionList, 'url': '/functions'},
            {'resource': FunctionView, 'url': '/functions/<int:record_id>'}
        ]

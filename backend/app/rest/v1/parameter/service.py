from app.core import BaseService
from app.signals import user_created

from .model import Parameter
from .resource import ParameterList, ParameterView
from .schema import ParameterSchema


class ParameterService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Parameter
        self.schema = ParameterSchema
        self.resources = [
            {'resource': ParameterList, 'url': '/parameters'},
            {'resource': ParameterView, 'url': '/parameters/<int:record_id>'}
        ]

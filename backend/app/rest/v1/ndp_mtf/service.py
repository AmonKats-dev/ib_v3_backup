from app.core import BaseService
from app.signals import user_created

from .model import NdpMtf
from .resource import NdpMtfList, NdpMtfView
from .schema import NdpMtfSchema


class NdpMtfService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = NdpMtf
        self.schema = NdpMtfSchema
        self.resources = [
            {'resource': NdpMtfList, 'url': '/ndp-mtfs'},
            {'resource': NdpMtfView, 'url': '/ndp-mtfs/<int:record_id>'}
        ]

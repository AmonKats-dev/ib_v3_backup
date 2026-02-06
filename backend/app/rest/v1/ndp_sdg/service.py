from app.core import BaseService
from app.signals import user_created

from .model import NdpSdg
from .resource import NdpSdgList, NdpSdgView
from .schema import NdpSdgSchema


class NdpSdgService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = NdpSdg
        self.schema = NdpSdgSchema
        self.resources = [
            {'resource': NdpSdgList, 'url': '/ndp-sdgs'},
            {'resource': NdpSdgView, 'url': '/ndp-sdgs/<int:record_id>'}
        ]

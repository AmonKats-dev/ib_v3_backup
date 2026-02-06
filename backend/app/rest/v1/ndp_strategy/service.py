from app.core import BaseService
from app.signals import user_created

from .model import NdpStrategy
from .resource import NdpStrategyList, NdpStrategyView
from .schema import NdpStrategySchema


class NdpStrategyService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = NdpStrategy
        self.schema = NdpStrategySchema
        self.resources = [
            {'resource': NdpStrategyList, 'url': '/ndp-strategies'},
            {'resource': NdpStrategyView, 'url': '/ndp-strategies/<int:record_id>'}
        ]

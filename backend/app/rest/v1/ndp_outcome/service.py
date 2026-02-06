from app.core import BaseService
from app.signals import user_created

from .model import NdpOutcome
from .resource import NdpOutcomeList, NdpOutcomeView
from .schema import NdpOutcomeSchema


class NdpOutcomeService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = NdpOutcome
        self.schema = NdpOutcomeSchema
        self.resources = [
            {'resource': NdpOutcomeList, 'url': '/ndp-outcomes'},
            {'resource': NdpOutcomeView, 'url': '/ndp-outcomes/<int:record_id>'}
        ]

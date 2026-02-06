from app.core import BaseService
from app.signals import user_created

from .model import NdpGoal
from .resource import NdpGoalList, NdpGoalView
from .schema import NdpGoalSchema


class NdpGoalService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = NdpGoal
        self.schema = NdpGoalSchema
        self.resources = [
            {'resource': NdpGoalList, 'url': '/ndp-goals'},
            {'resource': NdpGoalView, 'url': '/ndp-goals/<int:record_id>'}
        ]

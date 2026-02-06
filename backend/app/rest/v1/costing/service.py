from app.core import BaseService
from app.signals import user_created

from .model import Costing
from .resource import CostingList, CostingView
from .schema import CostingSchema


class CostingService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.exclude = {
            'get_all': ['parent', 'children']
        }
        self.model = Costing
        self.schema = CostingSchema
        self.resources = [
            {'resource': CostingList, 'url': '/costings'},
            {'resource': CostingView, 'url': '/costings/<int:record_id>'}
        ]

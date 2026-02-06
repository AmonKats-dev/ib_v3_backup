from app.core import BaseService

from .model import CostClassification
from .resource import CostClassificationList, CostClassificationView
from .schema import CostClassificationSchema


class CostClassificationService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = CostClassification
        self.schema = CostClassificationSchema
        self.resources = [
            {'resource': CostClassificationList, 'url': '/cost-classifications'},
            {'resource': CostClassificationView, 'url': '/cost-classifications/<int:record_id>'}
        ]


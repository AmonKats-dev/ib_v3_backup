from app.core import BaseService

from .model import CostCategory
from .resource import CostCategoryList, CostCategoryView
from .schema import CostCategorySchema


class CostCategoryService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = CostCategory
        self.schema = CostCategorySchema
        self.resources = [
            {'resource': CostCategoryList, 'url': '/cost-categories'},
            {'resource': CostCategoryView, 'url': '/cost-categories/<int:record_id>'}
        ]


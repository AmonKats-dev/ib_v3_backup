from app.core import BaseService
from app.signals import user_created

from .model import Fund
from .resource import FundList, FundView
from .schema import FundSchema


class FundService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.exclude = {
            'get_all': ['parent', 'children']
        }
        self.model = Fund
        self.schema = FundSchema
        self.resources = [
            {'resource': FundList, 'url': '/funds'},
            {'resource': FundView, 'url': '/funds/<int:record_id>'}
        ]

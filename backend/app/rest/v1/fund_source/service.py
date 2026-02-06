from app.core import BaseService

from .model import FundSource
from .resource import FundSourceList, FundSourceView
from .schema import FundSourceSchema


class FundSourceService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = FundSource
        self.schema = FundSourceSchema
        self.resources = [
            {'resource': FundSourceList, 'url': '/fund-sources'},
            {'resource': FundSourceView, 'url': '/fund-sources/<int:record_id>'}
        ]


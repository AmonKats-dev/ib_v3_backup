from app.core import BaseService
from app.signals import user_created

from .model import Feature
from .resource import FeatureList, FeatureView
from .schema import FeatureSchema


class FeatureService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Feature
        self.schema = FeatureSchema
        self.resources = [
            {'resource': FeatureList, 'url': '/features'},
            {'resource': FeatureView, 'url': '/features/<int:record_id>'}
        ]

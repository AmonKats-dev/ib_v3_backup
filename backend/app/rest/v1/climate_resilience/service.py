from app.constants import messages
from app.core import BaseService
from app.signals import project_detail_created, project_detail_updated
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import ClimateResilience
from .resource import ClimateResilienceList
from .schema import ClimateResilienceSchema


class ClimateResilienceService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = ClimateResilience
        self.schema = ClimateResilienceSchema
        self.resources = [
            {'resource': ClimateResilienceList, 'url': '/climate-resilience'}
        ]

    def get_all(self, args, filters=dict()):
        if filters is None:
            filters = []
        if 'project_detail_id' in filters:
            project_detail = ProjectDetailService().get_one(
                filters['project_detail_id'])
            if project_detail is not None:
                return super().get_all(args, filters=filters)

        abort(404, message=messages.NOT_FOUND)

    def manage_climate_resilience(self, record, project_detail_id, delete=False):
        record['project_detail_id'] = project_detail_id
        if 'id' in record:
            self.update(record["id"], record)
        else:
            self.create(record)


@project_detail_created.connect
@project_detail_updated.connect
def update_climate_resilience(self, project_detail, **kwargs):
    record = kwargs.get("climate_resilience", None)
    if record is not None:
        service = ClimateResilienceService()
        service.manage_climate_resilience(
            record, project_detail['id'], delete=True)

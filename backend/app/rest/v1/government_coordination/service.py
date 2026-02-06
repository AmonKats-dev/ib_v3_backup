from app.constants import messages
from app.core import BaseService
from app.signals import project_detail_created, project_detail_updated
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import GovernmentCoordination
from .resource import GovernmentCoordinationList
from .schema import GovernmentCoordinationSchema


class GovernmentCoordinationService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = GovernmentCoordination
        self.schema = GovernmentCoordinationSchema
        self.resources = [
            {'resource': GovernmentCoordinationList,
                'url': '/government-coordinations'}
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

    def manage_government_coordinations(self, records, project_detail_id, delete=False):
        if delete:
            ids = []
            for record in records:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids, "project_detail_id": project_detail_id}
            self.delete_many(filter)

        for record in records:
            record['project_detail_id'] = project_detail_id
            if 'id' in record:
                self.update(record["id"], record)
            else:
                self.create(record)


@project_detail_created.connect
@project_detail_updated.connect
def update_government_coordination(self, project_detail, **kwargs):
    records = kwargs.get("government_coordinations", None)
    if records is not None:
        service = GovernmentCoordinationService()
        service.manage_government_coordinations(
            records, project_detail['id'], delete=True)

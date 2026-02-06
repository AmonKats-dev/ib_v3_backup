from app.constants import messages
from app.core import BaseService
from app.signals import activity_created, activity_updated, outputs_updated
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import Activity
from .resource import ActivityList
from .schema import ActivitySchema


class ActivityService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Activity
        self.schema = ActivitySchema
        self.resources = [
            {'resource': ActivityList, 'url': '/activities'}
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

    def manage_activities(self, records, project_id, project_detail_id, delete=False):
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
                result = self.update(record["id"], record)
                activity_updated.send(
                    activity=result, project_id=project_id, **record)
            else:
                errors = self.schema().validate(data=record, partial=False)
                if not errors:
                    result = self.create(record)
                    activity_created.send(
                        activity=result, project_id=project_id, **record)


@outputs_updated.connect
def update_activities(self, project_id, project_detail_id, **kwargs):
    records = kwargs.get("activities", None)
    if records is not None:
        service = ActivityService()
        service.manage_activities(
            records, project_id, project_detail_id, delete=True)

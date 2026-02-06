from flask_restful import abort

from app.constants import messages
from app.core import BaseService
from app.signals import me_report_updated

from ..project_detail import ProjectDetailService
from .model import MEActivity
from .resource import MEActivityList
from .schema import MEActivitySchema


class MEActivityService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = MEActivity
        self.schema = MEActivitySchema
        self.resources = [
            {'resource': MEActivityList, 'url': '/me-activities'}
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

    def manage_me_activities(self, records, me_report, delete=False):
        if delete:
            ids = []
            for record in records:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids, "me_report_id": me_report['id']}
            self.delete_many(filter)

        for record in records:
            record['project_detail_id'] = me_report['project_detail_id']
            record['me_report_id'] = me_report['id']
            if 'id' in record:
                self.update(record["id"], record)
            else:
                self.create(record)


@me_report_updated.connect
def update_me_activities(self, me_report, **kwargs):
    records = kwargs.get("me_activities", None)
    if records is not None:
        service = MEActivityService()
        service.manage_me_activities(records, me_report, delete=True)

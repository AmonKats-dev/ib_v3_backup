from flask_restful import abort

from app.constants import messages
from app.core import BaseService
from app.signals import me_report_updated

from ..project_detail import ProjectDetailService
from .model import MEOutput
from .resource import MEOutputList
from .schema import MEOutputSchema


class MEOutputService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = MEOutput
        self.schema = MEOutputSchema
        self.resources = [
            {'resource': MEOutputList, 'url': '/me-outputs'}
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

    def manage_me_outputs(self, records, me_report, delete=False):
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
def update_me_outputs(self, me_report, **kwargs):
    records = kwargs.get("me_outputs", None)
    if records is not None:
        service = MEOutputService()
        service.manage_me_outputs(records, me_report, delete=True)

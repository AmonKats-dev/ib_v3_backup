from app.constants import messages
from app.core import BaseService
from app.signals import me_report_updated
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import MERelease
from .resource import MEReleaseList
from .schema import MEReleaseSchema


class MEReleaseService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = MERelease
        self.schema = MEReleaseSchema
        self.resources = [
            {'resource': MEReleaseList, 'url': '/me-releases'}
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

    def manage_me_releases(self, records, me_report, delete=False):
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


# @me_report_updated.connect
def update_me_releases(self, me_report, **kwargs):
    records = kwargs.get("me_releases", None)
    if records is not None:
        service = MEReleaseService()
        service.manage_me_releases(records, me_report, delete=True)

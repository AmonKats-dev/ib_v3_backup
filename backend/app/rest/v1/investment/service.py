from app.constants import messages
from app.core import BaseService
from app.signals import activity_created, activity_updated, investment_updated
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import Investment
from .resource import InvestmentList
from .schema import InvestmentSchema


class InvestmentService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Investment
        self.schema = InvestmentSchema
        self.resources = [
            {'resource': InvestmentList, 'url': '/investments'}
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

    def manage_investments(self, records, project_id, activity, delete=False):
        fund_ids = []
        if delete:
            ids = []
            for record in records:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids, "activity_id": activity['id']}
            self.delete_many(filter)

        for record in records:
            fund_ids.append(record['fund_id'])
            record['project_detail_id'] = activity['project_detail_id']
            record['activity_id'] = activity['id']
            if 'id' in record:
                self.update(record["id"], record)
            else:
                errors = self.schema().validate(data=record, partial=False)
                if not errors:
                    self.create(record)
        investment_updated.send(project_id=project_id, fund_ids=fund_ids)


@activity_created.connect
def create_investments(self, activity, project_id, **kwargs):
    records = kwargs.get("investments", None)
    if records is not None:
        service = InvestmentService()
        service.manage_investments(records, project_id, activity, delete=False)


@activity_updated.connect
def update_investments(self, activity,  project_id, **kwargs):
    records = kwargs.get("investments", None)
    if records is not None:
        service = InvestmentService()
        service.manage_investments(records, project_id, activity, delete=True)

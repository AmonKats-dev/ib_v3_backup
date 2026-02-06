from flask_restful import abort

from app.constants import messages
from app.core import BaseService
from app.signals import project_option_created, project_option_updated

from ..project_detail import ProjectDetailService
from .model import RiskEvaluation
from .resource import RiskEvaluationList
from .schema import RiskEvaluationSchema


class RiskEvaluationService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = RiskEvaluation
        self.schema = RiskEvaluationSchema
        self.resources = [
            {'resource': RiskEvaluationList, 'url': '/risk-evaluations'}
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

    def manage_risk_evaluations(self, records, project_option, delete=False):
        if delete:
            ids = []
            for record in records:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids,
                      "project_option_id": project_option['id']}
            self.delete_many(filter)

        for record in records:
            record['project_detail_id'] = project_option['project_detail_id']
            record['project_option_id'] = project_option['id']
            if 'id' in record:
                self.update(record["id"], record)
            else:
                self.create(record)


@project_option_created.connect
def create_risk_evaluations(self, project_option, **kwargs):
    records = kwargs.get("risk_evaluations", None)
    if records is not None:
        service = RiskEvaluationService()
        service.manage_risk_evaluations(records, project_option, delete=False)


@project_option_updated.connect
def update_risk_evaluations(self, project_option, **kwargs):
    records = kwargs.get("risk_evaluations", None)
    if records is not None:
        service = RiskEvaluationService()
        service.manage_risk_evaluations(records, project_option, delete=True)

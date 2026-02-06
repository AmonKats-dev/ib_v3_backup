from flask_restful import abort

from app.constants import messages
from app.core import BaseService
from app.signals import project_option_created, project_option_updated

from ..project_detail import ProjectDetailService
from .model import FinancialEvaluation
from .resource import FinancialEvaluationList
from .schema import FinancialEvaluationSchema


class FinancialEvaluationService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = FinancialEvaluation
        self.schema = FinancialEvaluationSchema
        self.resources = [
            {'resource': FinancialEvaluationList, 'url': '/financial-evaluations'}
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

    def manage_financial_evaluation(self, record, project_option):
        record['project_detail_id'] = project_option['project_detail_id']
        record['project_option_id'] = project_option['id']
        if 'id' in record:
            self.update(record["id"], record)
        else:
            self.create(record)


@project_option_created.connect
@project_option_updated.connect
def upsert_financial_evaluation(self, project_option, **kwargs):
    record = kwargs.get("financial_evaluation", None)
    if record is not None:
        FinancialEvaluationService().manage_financial_evaluation(
            record, project_option)

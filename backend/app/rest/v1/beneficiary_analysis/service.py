from app.constants import messages
from app.core import BaseService
from app.signals import project_detail_created, project_detail_updated
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import BeneficiaryAnalysis
from .resource import BeneficiaryAnalysisList
from .schema import BeneficiaryAnalysisSchema


class BeneficiaryAnalysisService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = BeneficiaryAnalysis
        self.schema = BeneficiaryAnalysisSchema
        self.resources = [
            {'resource': BeneficiaryAnalysisList, 'url': '/beneficiary-analysis'}
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

    def manage_beneficiary_analysis(self, record, project_detail_id, delete=False):
        record['project_detail_id'] = project_detail_id
        if 'id' in record:
            self.update(record["id"], record)
        else:
            errors = self.schema().validate(data=record, partial=False)
            if not errors:
                self.create(record)


@project_detail_created.connect
@project_detail_updated.connect
def update_beneficiary_analysis(self, project_detail, **kwargs):
    record = kwargs.get("beneficiary_analysis", None)
    if record is not None:
        service = BeneficiaryAnalysisService()
        service.manage_beneficiary_analysis(
            record, project_detail['id'], delete=True)

from app.constants import FULL_ACCESS, messages
from app.core import BaseService
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import RiskAssessment
from .resource import RiskAssessmentList, RiskAssessmentView
from .schema import RiskAssessmentSchema


class RiskAssessmentService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = RiskAssessment
        self.schema = RiskAssessmentSchema
        self.resources = [
            {'resource': RiskAssessmentList, 'url': '/risk-assessments'},
            {'resource': RiskAssessmentView,
                'url': '/risk-assessments/<int:record_id>'}
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

    def get_one(self, record_id):
        record = super().get_one(record_id)
        if record is not None:
            if self._check_project_access(record['project_detail_id']):
                return record
        abort(404, message=messages.NOT_FOUND)

    def _check_project_access(self, project_id):
        project_detail = ProjectDetailService().model.get_one(project_id)
        return True if project_detail is not None else False

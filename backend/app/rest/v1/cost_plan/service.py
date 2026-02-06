from app.constants import messages
from app.core import BaseService
from app.signals import cost_plan_created, cost_plan_updated
from app.utils import validate_schema
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import CostPlan
from .resource import CostPlanList, CostPlanView
from .schema import CostPlanSchema


class CostPlanService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = CostPlan
        self.schema = CostPlanSchema
        self.resources = [
            {'resource': CostPlanList, 'url': '/cost-plans'},
            {'resource': CostPlanView,
                'url': '/cost-plans/<int:record_id>'}
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

    def create(self, data):
        schema = self.schema()
        validated_data = validate_schema(data, schema)
        if validated_data:
            if self._check_project_access(validated_data['project_detail_id']):
                record = self.model.create(**validated_data)
                result = schema.dump(record)
                cost_plan_created.send(cost_plan=result, **data)
                return result
            abort(404, message=messages.NOT_FOUND)

    def update(self, record_id, data, partial=False):
        schema = self.schema()
        validated_data = validate_schema(data, schema, partial=partial)
        if validated_data:
            record = self.model.get_one(record_id)
            if record is not None:
                if self._check_project_access(record.project_detail_id):
                    record = record.update(**validated_data)
                    result = schema.dump(record)
                    cost_plan_updated.send(cost_plan=result, **data)
                    return result
            abort(404, message=messages.NOT_FOUND)

    def _check_project_access(self, project_id):
        project_detail = ProjectDetailService().model.get_one(project_id)
        return True if project_detail is not None else False

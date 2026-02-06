from app.constants import messages
from app.core import BaseService
from app.signals import cost_plan_created, cost_plan_updated
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import CostPlanItem
from .resource import CostPlanItemList
from .schema import CostPlanItemSchema


class CostPlanItemService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = CostPlanItem
        self.schema = CostPlanItemSchema
        self.resources = [
            {'resource': CostPlanItemList, 'url': '/cost-plan-items'}
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

    def manage_cost_plan_items(self, records, cost_plan, delete=False):
        if delete:
            ids = []
            for record in records:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids, "cost_plan_id": cost_plan['id']}
            self.delete_many(filter)

        for record in records:
            record['project_detail_id'] = cost_plan['project_detail_id']
            record['cost_plan_id'] = cost_plan['id']
            if 'id' in record:
                self.update(record["id"], record)
            else:
                self.create(record)


@cost_plan_created.connect
@cost_plan_updated.connect
def update_cost_plan_items(self, cost_plan, **kwargs):
    records = kwargs.get("cost_plan_items", None)
    if records is not None:
        service = CostPlanItemService()
        service.manage_cost_plan_items(records, cost_plan, delete=True)

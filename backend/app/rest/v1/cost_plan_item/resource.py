from app.constants import messages
from app.core import BaseList
from app.core.cerberus import check_permission
from flask_restful import abort


class CostPlanItemList(BaseList):
    method_decorators = {
        'get': [check_permission('list_cost_plan_items')]}

    def post(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

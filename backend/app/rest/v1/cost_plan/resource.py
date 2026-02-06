from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask_restful import abort


class CostPlanList(BaseList):
    method_decorators = {'get': [check_permission('list_cost_plans')],
                         'post': [check_permission('create_cost_plan')]}


class CostPlanView(BaseView):
    method_decorators = {'get': [check_permission('view_cost_plan')],
                         'patch': [check_permission('edit_cost_plan')]}

    def put(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

    def delete(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

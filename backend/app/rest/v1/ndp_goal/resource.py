from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class NdpGoalList(BaseList):
    method_decorators = {'get': [check_permission('list_ndp_goals')],
                         'post': [check_permission('create_ndp_goal')]}


class NdpGoalView(BaseView):
    method_decorators = {'get': [check_permission('view_ndp_goal')],
                         'put': [check_permission('edit_ndp_goal')],
                         'patch': [check_permission('edit_ndp_goal')],
                         'delete': [check_permission('delete_ndp_goal')]}

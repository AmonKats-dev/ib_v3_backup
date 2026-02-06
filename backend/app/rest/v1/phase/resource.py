from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class PhaseList(BaseList):
    method_decorators = {'get': [check_permission('list_phases')],
                         'post': [check_permission('create_phase')]}


class PhaseView(BaseView):
    method_decorators = {'get': [check_permission('view_phase')],
                         'put': [check_permission('edit_phase')],
                         'patch': [check_permission('edit_phase')],
                         'delete': [check_permission('delete_phase')]}

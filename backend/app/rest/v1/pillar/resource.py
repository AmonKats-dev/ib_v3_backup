from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class PillarList(BaseList):
    method_decorators = {'get': [check_permission('list_pillars')],
                         'post': [check_permission('create_pillar')]}


class PillarView(BaseView):
    method_decorators = {'get': [check_permission('view_pillar')],
                         'put': [check_permission('edit_pillar')],
                         'patch': [check_permission('edit_pillar')],
                         'delete': [check_permission('delete_pillar')]}

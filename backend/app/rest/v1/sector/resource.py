from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class SectorList(BaseList):
    method_decorators = {'get': [check_permission('list_projects')],
                         'post': [check_permission('create_project')]}


class SectorView(BaseView):
    method_decorators = {'get': [check_permission('view_project')],
                         'put': [check_permission('edit_project')],
                         'patch': [check_permission('edit_project')],
                         'delete': [check_permission('delete_project')]}

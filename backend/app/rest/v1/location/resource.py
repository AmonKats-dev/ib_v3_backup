from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class LocationList(BaseList):
    method_decorators = {'get': [check_permission('list_locations')],
                         'post': [check_permission('create_location')]}


class LocationView(BaseView):
    method_decorators = {'get': [check_permission('view_location')],
                         'put': [check_permission('edit_location')],
                         'patch': [check_permission('edit_location')],
                         'delete': [check_permission('delete_location')]}

from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class OrganizationList(BaseList):
    method_decorators = {'get': [check_permission('list_organizations')],
                         'post': [check_permission('create_organization')]}


class OrganizationView(BaseView):
    method_decorators = {'get': [check_permission('view_organization')],
                         'put': [check_permission('edit_organization')],
                         'patch': [check_permission('edit_organization')],
                         'delete': [check_permission('delete_organization')]}

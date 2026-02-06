from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class DonorProjectList(BaseList):
    method_decorators = {'get': [check_permission('list_donor_projects')],
                         'post': [check_permission('create_donor_project')]}


class DonorProjectView(BaseView):
    method_decorators = {'get': [check_permission('view_donor_project')],
                         'put': [check_permission('edit_donor_project')],
                         'patch': [check_permission('edit_donor_project')],
                         'delete': [check_permission('delete_donor_project')]}

from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class MEWorkflowList(BaseList):
    method_decorators = {'get': [check_permission('list_workflows')],
                         'post': [check_permission('create_workflow')]}


class MEWorkflowView(BaseView):
    method_decorators = {'get': [check_permission('view_workflow')],
                         'put': [check_permission('edit_workflow')],
                         'patch': [check_permission('edit_workflow')],
                         'delete': [check_permission('delete_workflow')]}

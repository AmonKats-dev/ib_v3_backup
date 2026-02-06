from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class CustomReportList(BaseList):
    method_decorators = {'get': [check_permission('list_custom_reports')],
                         'post': [check_permission('create_custom_report')]}


class CustomReportView(BaseView):
    method_decorators = {'get': [check_permission('view_custom_report')],
                         'put': [check_permission('edit_custom_report')],
                         'patch': [check_permission('edit_custom_report')],
                         'delete': [check_permission('delete_custom_report')]}

from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class FileTypeList(BaseList):
    method_decorators = {'get': [check_permission('list_file_types')],
                         'post': [check_permission('create_file_type')]}


class FileTypeView(BaseView):
    method_decorators = {'get': [check_permission('view_file_type')],
                         'put': [check_permission('edit_file_type')],
                         'patch': [check_permission('edit_file_type')],
                         'delete': [check_permission('delete_file_type')]}

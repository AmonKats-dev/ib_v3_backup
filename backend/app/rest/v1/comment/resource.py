from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class CommentList(BaseList):
    method_decorators = {'get': [check_permission('list_comments')],
                         'post': [check_permission('create_comment')]}


class CommentView(BaseView):
    method_decorators = {'get': [check_permission('view_comment')],
                         'put': [check_permission('edit_comment')],
                         'patch': [check_permission('edit_comment')],
                         'delete': [check_permission('delete_comment')]}

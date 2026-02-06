from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask_jwt_extended import jwt_required


class UserRoleList(BaseList):
    method_decorators = {'get': [jwt_required()],
                         'post': [jwt_required()]}


class UserRoleView(BaseView):
    method_decorators = {'get': [jwt_required()],
                         'put': [check_permission('edit_user')],
                         'patch': [check_permission('edit_user')],
                         'delete': [check_permission('delete_user')]}

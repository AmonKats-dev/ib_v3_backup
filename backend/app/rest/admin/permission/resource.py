from flask_jwt_extended import jwt_required

from app.core import BaseList, BaseView


class PermissionList(BaseList):
    method_decorators = [jwt_required]


class PermissionView(BaseView):
    method_decorators = [jwt_required]

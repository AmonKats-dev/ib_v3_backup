from flask_jwt_extended import jwt_required

from app.core import BaseList, BaseView


class InstanceList(BaseList):
    method_decorators = [jwt_required]


class InstanceView(BaseView):
    method_decorators = [jwt_required]

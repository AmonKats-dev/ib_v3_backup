from flask_jwt_extended import jwt_required

from app.core import BaseList, BaseView


class ModuleList(BaseList):
    method_decorators = [jwt_required]


class ModuleView(BaseView):
    method_decorators = [jwt_required]

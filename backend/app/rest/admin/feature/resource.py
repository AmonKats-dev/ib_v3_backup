from flask_jwt_extended import jwt_required

from app.core import BaseList, BaseView


class FeatureList(BaseList):
    method_decorators = [jwt_required]


class FeatureView(BaseView):
    method_decorators = [jwt_required]

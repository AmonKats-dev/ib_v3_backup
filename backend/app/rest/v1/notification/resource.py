from flask_restful import abort
from flask_jwt_extended import jwt_required

from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class NotificationList(BaseList):
    method_decorators = {'get': [jwt_required()]}

    def post(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)


class NotificationView(BaseView):
    method_decorators = {'get': [jwt_required()],
                         'delete': [jwt_required()]}

    def patch(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

    def put(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

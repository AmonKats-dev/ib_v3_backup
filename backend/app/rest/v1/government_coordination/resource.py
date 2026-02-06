from flask_restful import abort

from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission


class GovernmentCoordinationList(BaseList):
    method_decorators = {
        'get': [check_permission('list_government_coordinations')]}

    def post(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

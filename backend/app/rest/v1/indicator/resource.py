from flask_restful import abort

from app.constants import messages
from app.core import BaseList
from app.core.cerberus import check_permission


class IndicatorList(BaseList):
    method_decorators = {
        'get': [check_permission('list_indicators')]}

    def post(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

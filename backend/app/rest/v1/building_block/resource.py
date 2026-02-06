from flask_restful import abort

from app.constants import messages
from app.core import BaseList
from app.core.cerberus import check_permission


class BuildingBlockList(BaseList):
    method_decorators = {
        'get': [check_permission('list_building_blocks')]}

    def post(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

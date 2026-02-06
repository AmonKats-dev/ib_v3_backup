from app.constants import messages
from app.core import BaseList, BaseView
from app.core.cerberus import check_permission
from flask import request
from flask_jwt_extended import jwt_required
from flask_restful import Resource, abort


class MEReportList(BaseList):
    method_decorators = {'get': [check_permission('list_me_reports')],
                         'post': [check_permission('create_me_report')]}


class MEReportView(BaseView):
    method_decorators = {'get': [check_permission('view_me_report')],
                         'patch': [check_permission('edit_me_report')]}

    def put(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

    def delete(self, record_id):
        abort(405, message=messages.METHOD_NOT_ALLOWED)


class MEReportActionView(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    @jwt_required
    def post(self, record_id):
        json_data = request.get_json(force=True)
        result = self.service.manage_actions(
            me_report_id=record_id, data=json_data)
        return result, 200

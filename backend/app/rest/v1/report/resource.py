import json

from app.core.cerberus import check_permission
from app.utils import common_parser, validate_schema
from flask import json, make_response, render_template, request
from flask_jwt_extended import jwt_required
from flask_paginate import Pagination, get_page_parameter
from flask_restful import Resource


class PivotView(Resource):
    method_decorators = {'get': [check_permission('view_report_builder')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        args = common_parser.parse_args()
        filters = json.loads(args['filter']) if args.get('filter') else dict()
        result = self.service.get_project_pivot_report(filters)
        return result, 200


class ProjectCountView(Resource):
    method_decorators = {'get': [jwt_required()]}
    
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        result = self.service.get_project_count_report()
        return result, 200


class LocationReportView(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        result = self.service.get_location_report()
        return result, 200


class NdpReportView(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        result = self.service.get_ndp_report()
        return result, 200


class ProjectReportView(Resource):
    method_decorators = {
        'get': [check_permission('view_project_report')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        args = common_parser.parse_args()
        filters = json.loads(args['filter']) if args.get('filter') else dict()
        result = self.service.get_project_report(filters)
        return result, 200


class ProjectMinReportView(Resource):
    method_decorators = {
        'get': [check_permission('view_project_report')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        args = common_parser.parse_args()
        filters = json.loads(args['filter']) if args.get('filter') else dict()
        result = self.service.get_project_min_report(filters)
        return result, 200


class PSIPReportView(Resource):
    method_decorators = {
        'get': [check_permission('view_psip_report')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        result = self.service.get_psip_report()
        return result, 200


class PublicPipReportView(Resource):
    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        args = common_parser.parse_args()
        page = request.args.get(get_page_parameter(), type=int, default=1)
        result = self.service.get_pip_min_report(page)
        pagination = Pagination(css_framework='foundation', page=page,
                                total=result['total'], record_name='result')
        headers = {'Content-Type': 'text/html'}
        return make_response(
            render_template('pip_min_report.html', title='Project',
                            projects=result['projects'], pagination=pagination), 200, headers)

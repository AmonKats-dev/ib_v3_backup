import json

from app.constants import messages
from app.core.cerberus import check_permission
from app.utils import common_parser, validate_schema
from flask import json, make_response, render_template, request
from flask_paginate import Pagination, get_page_parameter
from flask_restful import Resource, abort


class HealthCheckView(Resource):
    method_decorators = {'get': [check_permission('api_health_check')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        return messages.OK, 200


class ProjectsList(Resource):
    method_decorators = {'get': [check_permission('get_all_projects')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        args = common_parser.parse_args()
        filters = json.loads(args['filter']) if args.get('filter') else dict()

        result = self.service.get_all_projects(filters)
        return result, 200


class ProjectDetailedView(Resource):
    method_decorators = {'get': [check_permission('get_project_details')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self, record_id):
        result = self.service.get_project_details(record_id)
        return result, 200


class ProjectCoaDetailedView(Resource):
    method_decorators = {
        'get': [check_permission('get_project_details_by_coa')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self, project_coa_code):
        result = self.service.get_project_details_by_coa(project_coa_code)
        return result, 200


class ProjectNdpDetailedView(Resource):
    method_decorators = {
        'get': [check_permission('get_project_details_by_ndp_code')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self, ndp_code):
        result = self.service.get_project_details_by_ndp_code(ndp_code)
        return result, 200


class DonorProjectCreateView(Resource):
    method_decorators = {'post': [check_permission('create_donor_project')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def post(self):
        json_data = request.get_json(force=True)
        result = self.service.create_donor_project(json_data)
        return result, 201


class AmpIntegrationView(Resource):
    method_decorators = {'get': [check_permission('list_amp_data')],
                         'post': [check_permission('sync_amp_data')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        args = common_parser.parse_args()
        filters = json.loads(args['filter']) if args.get('filter') else dict()
        result = self.service.get_amp_data(filters)
        return result, 200

    def post(self):
        json_data = request.get_json(force=True)
        result = self.service.sync_amp(json_data)
        return result, 201


class PbsProjectIntegrationView(Resource):
    method_decorators = {'get': [check_permission('list_pbs_data')],
                         'post': [check_permission('sync_pbs_data')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        args = common_parser.parse_args()
        filters = json.loads(args['filter']) if args.get('filter') else dict()
        result = self.service.get_pbs_projects(filters)
        return result, 200

    def post(self):
        result = self.service.sync_pbs_projects()
        return result, 201


class NdpProjectIntegrationView(Resource):
    method_decorators = {'get': [check_permission('list_ndp_data')],
                         'post': [check_permission('sync_ndp_data')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        args = common_parser.parse_args()
        filters = json.loads(args['filter']) if args.get('filter') else dict()
        result = self.service.get_ndp_projects(filters)
        return result, 200

    def post(self):
        result = self.service.sync_ndp_projects()
        return result, 201


class PbsProjectLinkView(Resource):
    method_decorators = {'post': [check_permission('link_pbs_data')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

    def post(self):
        json_data = request.get_json(force=True)
        self.service.link_pbs_projects(json_data)
        return None, 200


class NdpProjectLinkView(Resource):
    method_decorators = {'post': [check_permission('link_ndp_data')]}

    def __init__(self, **kwargs):
        self.service = kwargs.get('service')

    def get(self):
        abort(405, message=messages.METHOD_NOT_ALLOWED)

    def post(self):
        json_data = request.get_json(force=True)
        self.service.link_ndp_projects(json_data)
        return None, 200

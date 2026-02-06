import base64
import json
from io import BytesIO

import numpy
import pandas as pd
import requests
from app.constants import messages
from app.core import BaseService
from app.utils import get_key_by_value_dict
from flask import current_app as app
from flask_restful import abort
from sqlalchemy import null

from ..donor_project import DonorProjectService
from ..project import ProjectService
from .model import (IntegrationAmp, IntegrationNdpProject,
                    IntegrationPbsProject, IntegrationSync)
from .resource import (AmpIntegrationView, DonorProjectCreateView,
                       HealthCheckView, NdpProjectIntegrationView,
                       NdpProjectLinkView, PbsProjectIntegrationView,
                       PbsProjectLinkView, ProjectCoaDetailedView,
                       ProjectDetailedView, ProjectNdpDetailedView,
                       ProjectsList)
from .schema import (DetailedPbsProjectSchema, DetailedProjectSchema,
                     IntegrationAmpSchema, IntegrationNdpProjectSchema,
                     IntegrationPbsProjectSchema, IntegrationSyncSchema,
                     ShortProjectSchema)

PBS_API_URL = 'https://pbsopenapi.finance.go.ug/graphql'


class IntegrationNdpProjectService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = IntegrationNdpProject
        self.schema = IntegrationNdpProjectSchema
        self.resources = []


class IntegrationPbsProjectService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = IntegrationPbsProject
        self.schema = IntegrationPbsProjectSchema
        self.resources = []


class IntegrationAmpService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = IntegrationAmp
        self.schema = IntegrationAmpSchema
        self.resources = []


class IntegrationSyncService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = IntegrationSync
        self.schema = IntegrationSyncSchema
        self.resources = []


class IntegrationService():
    def __init__(self, **kwargs):
        self.resources = [
            {'resource': HealthCheckView, 'url': '/integrations/healthcheck'},
            {'resource': ProjectsList, 'url': '/integrations/aims/get-all-projects'},
            {'resource': AmpIntegrationView, 'url': '/integrations/amp'},
            {'resource': ProjectNdpDetailedView,
                'url': '/integrations/ndp/project-details/<string:ndp_code>'},
            {'resource': NdpProjectLinkView, 'url': '/integrations/ndp/link'},
            {'resource': NdpProjectIntegrationView,
                'url': '/integrations/ndp/projects'},
            {'resource': PbsProjectIntegrationView,
                'url': '/integrations/pbs/projects'},
            {'resource': PbsProjectLinkView,
                'url': '/integrations/pbs/link'},
            {'resource': DonorProjectCreateView,
                'url': '/integrations/aims/share-project-details'},
            {'resource': ProjectDetailedView,
             'url': '/integrations/aims/get-project-details/<int:record_id>'},
            {'resource': ProjectCoaDetailedView,
             'url': '/integrations/pbs/get-project-details/<string:project_coa_code>'}]

    def add_resources(self, blueprint):
        for item in self.resources:
            blueprint.add_resource(item['resource'], item['url'],
                                   resource_class_kwargs={'service': self})

    def get_all_projects(self, filters):
        project_service = ProjectService()
        schema = ShortProjectSchema(many=True)
        records = project_service.model.get_list(per_page=-1, filter=filters)
        return schema.dump(records)

    def get_project_details(self, project_id):
        project_service = ProjectService()
        schema = DetailedProjectSchema()
        record = project_service.model.get_one(project_id)
        return schema.dump(record)

    def get_project_details_by_coa(self, project_coa_code):
        project_service = ProjectService()
        schema = DetailedPbsProjectSchema()
        record = project_service.model.get_list(
            filter={"budget_code": project_coa_code})
        if record:
            return schema.dump(record[0])
        return abort(404, message=messages.NOT_FOUND)

    def get_project_details_by_ndp_code(self, ndp_pip_code):
        project_service = ProjectService()
        schema = DetailedPbsProjectSchema()
        record = project_service.model.get_list(
            filter={"ndp_pip_code": ndp_pip_code})
        if record:
            return schema.dump(record[0])
        return abort(404, message=messages.NOT_FOUND)

    def create_donor_project(self, data):
        service = DonorProjectService()
        result = service.create(data)

    def sync_amp(self, data):
        sync_service = IntegrationSyncService()
        amp_service = IntegrationAmpService()
        sync_data = {
            'system': 'AMP',
            'status': 'SUCCESS',
            'records_synced': 0,
            'error_message': ''
        }
        keys = {
            'project_title': 'Unnamed: 1',
            'project_status': 'Unnamed: 2',
            'agreement_title': 'Unnamed: 9',
            'agreement_sign_date': 'Unnamed: 11',
            'agreement_effective_date': 'Unnamed: 12',
            'agreement_close_date': 'Unnamed: 13',
            'donor': 'Unnamed: 14',
            'donor_commitment_date': 'Unnamed: 15',
            'financing_instrument': 'Unnamed: 16',
            'executing_agency': 'Unnamed: 21',
            'implementing_agency': 'Unnamed: 21',
            'planned_commitment_amount': 'Unnamed: 27',
            'actual_commitment_amount': 'Actual Commitments.6',
            'actual_disbursement_amount': 'Actual Disbursements.6',
        }
        project_codes = dict()
        prefix, b64_content = data['content'].split(",", 1)
        file_content = base64.b64decode(b64_content)
        file_io = BytesIO(file_content)
        projects = ProjectService().get_budgeted_projects()
        for project in projects:
            project_codes[project['id']] = project['budget_code']

        excel_object = pd.ExcelFile(
            file_io, engine='openpyxl')
        df = excel_object.parse(
            sheet_name='Formatted', index_col=0, skiprows=6)

        df[keys['agreement_sign_date']] = pd.to_datetime(
            df[keys['agreement_sign_date']], dayfirst=True, errors='coerce').dt.strftime('%Y-%m-%d')
        df[keys['agreement_effective_date']] = pd.to_datetime(
            df[keys['agreement_effective_date']], dayfirst=True, errors='coerce').dt.strftime('%Y-%m-%d')

        df[keys['agreement_close_date']] = pd.to_datetime(
            df[keys['agreement_close_date']], dayfirst=True, errors='coerce').dt.strftime('%Y-%m-%d')

        df[keys['donor_commitment_date']] = pd.to_datetime(
            df[keys['donor_commitment_date']], dayfirst=True, errors='coerce').dt.strftime('%Y-%m-%d')
        df = df.replace(numpy.nan, 'None')

        sync_record = sync_service.create(sync_data)
        for index, row in df.iterrows():
            project_id = None
            project_coa_code = str(index).zfill(4)
            parsed_data = {'project_coa_code': project_coa_code,
                           'integration_sync_id': sync_record['id']}
            for key, value in keys.items():
                parsed_data[key] = row[value] if row[value] != 'None' else None
            records = amp_service.get_all(
                filters={"project_coa_code": project_coa_code, "agreement_title": row[keys['agreement_title']]})
            if records:
                amp_service.update(records[0]['id'], parsed_data, partial=True)
                sync_data['records_synced'] += 1
            else:
                project_id = self._search_project_by_coa_code(
                    project_coa_code, project_codes)
                if project_id is not None:
                    parsed_data['project_id'] = project_id
                    amp_service.create(parsed_data)
                    sync_data['records_synced'] += 1
        sync_service.update(sync_record['id'], sync_data, partial=True)

    def get_amp_data(self, filters):
        return IntegrationAmpService().get_all(filters=filters)

    def _authenticate_pbs(self):
        query = """
            mutation {
                login(
                    data: {
                    User_Name: "Nita"
                    Password: "Nita1290W"
                    ipAddress: "192.168.5.0"
                    }
                ) {
                    access_token
                    refresh_token
                }
            }
        """
        response = requests.post(PBS_API_URL, json={'query': query})
        if response.status_code == 200:
            pbs_auth = json.loads(response.text)
            return pbs_auth['data']['login']['access_token']

    def sync_pbs_projects(self):
        sync_service = IntegrationSyncService()
        pbs_project_service = IntegrationPbsProjectService()

        access_token = self._authenticate_pbs()
        headers = {"Authorization": f"Bearer {access_token}"}

        query = """
            query {
                cgActiveIbpProjects {
                    Vote_Code
                    Vote_Name
                    Programme_Code
                    Programme_Name
                    SubProgramme_Code
                    SubProgramme_Name
                    Sub_SubProgramme_Code
                    Sub_SubProgramme_Name
                    Project_Code
                    Project_Name
                    Status
                }
            }
        """
        response = requests.post(PBS_API_URL, json={
                                 'query': query},  headers=headers)
        if response.status_code == 200:
            pbs_data = json.loads(response.text)
            sync_data = {
                'system': 'PBS',
                'status': 'SUCCESS',
                'records_synced': 0,
                'error_message': ''
            }
            args = {'per_page': -1, 'page': 1,
                    'sort_field': 'id', 'sort_order': 'ASC'}
            existing_pbs_projects = pbs_project_service.get_all(args=args)
            existing_codes = []
            for item in existing_pbs_projects:
                existing_codes.append(item['project_coa_code'])
            sync_record = sync_service.create(sync_data)
            for project in pbs_data['data']['cgActiveIbpProjects']:
                if project['Project_Code'] not in existing_codes:
                    pbs_data = {
                        'project_coa_code': project['Project_Code'],
                        'project_name': project['Project_Name'],
                        'project_status': project['Status'],
                        'vote_code': project['Vote_Code'],
                        'vote_name': project['Vote_Name'],
                        'program_code': project['Programme_Code'],
                        'program_name': project['Programme_Name'],
                        'subprogram_code': project['SubProgramme_Code'],
                        'subprogram_name': project['Sub_SubProgramme_Name'],
                        'integration_sync_id': sync_record['id']
                    }
                    pbs_project_service.create(pbs_data)
                    existing_codes.append(project['Project_Code'])
                    sync_data['records_synced'] += 1
            sync_service.update(sync_record['id'], sync_data, partial=True)
        return True

    def get_pbs_projects(self, filters):
        return IntegrationPbsProjectService().get_all(filters=filters)

    def link_pbs_projects(self, data):
        pbs_service = IntegrationPbsProjectService()
        project_service = ProjectService()
        if len(data) > 0:
            for link in data:
                pbs_service.update(link['pbs_project_id'], {
                                   'project_id': link['project_id']}, partial=True)
                project_service.update(link['project_id'], {
                                       'budget_code': link['project_coa_code']}, partial=True)

    def sync_ndp_projects(self):
        program_url = "https://dev.ndpme.go.ug/ndpdb/api/programs.json?paging=false"
        project_url = "https://dev.ndpme.go.ug/ndpdb/api/trackedEntityInstances.json?ouMode=ALL&trackedEntityType=YFOAuiimQNh&fields=attributes[displayName,attribute,value],orgUnit,programOwners[*]&skipPaging=true"

        username = 'ibp.developer'
        password = 'Dhis@2022#'

        sync_service = IntegrationSyncService()
        sync_data = {
            'system': 'NDP',
            'status': 'SUCCESS',
            'records_synced': 0,
            'error_message': ''
        }

        sync_record = sync_service.create(sync_data)
        response = requests.get(program_url, auth=(username, password))
        if response.status_code is 200:
            ndp_programs = dict()
            for program in json.loads(response.text)['programs']:
                if program:
                    ndp_programs[program['displayName'][0:2]] = program['id']

            response = requests.get(project_url, auth=(username, password))
            if response.status_code is 200:

                ndp_project_service = IntegrationNdpProjectService()
                args = {'per_page': -1, 'page': 1,
                        'sort_field': 'id', 'sort_order': 'ASC'}
                existing_ndp_projects = ndp_project_service.get_all(args=args)
                existing_codes = []
                for item in existing_ndp_projects:
                    existing_codes.append(item['ndp_pip_code'])

                program_data = json.loads(response.text)[
                    'trackedEntityInstances']
                for item in program_data:
                    if len(item['programOwners']) > 0:
                        ndp_program_id = item['programOwners'][0]['program']
                        ndp_project = self._format_ndp_item_by_title(
                            item['attributes'])
                        if (ndp_project['ndp_pip_code'] and
                                ndp_project['ndp_pip_code'] not in existing_codes):
                            ndp_data = {
                                'ndp_pip_code': ndp_project['ndp_pip_code'],
                                'project_name': ndp_project['project_name'],
                                'implementation_status': ndp_project['implementation_status'],
                                'planned_start_date': ndp_project['planned_start_date'],
                                'planned_end_date': ndp_project['planned_end_date'],
                                'description': ndp_project['description'],
                                'total_cost': ndp_project['total_cost'],
                                'program_code': get_key_by_value_dict(ndp_program_id, ndp_programs),
                                'integration_sync_id': sync_record['id']
                            }
                            ndp_project_service.create(ndp_data)
                            existing_codes.append(ndp_project['ndp_pip_code'])
                            sync_data['records_synced'] += 1

        sync_service.update(sync_record['id'], sync_data, partial=True)
        return True

    def get_ndp_projects(self, filters):
        return IntegrationNdpProjectService().get_all(filters=filters)

    def link_ndp_projects(self, data):
        ndp_project_service = IntegrationNdpProjectService()
        project_service = ProjectService()
        if len(data) > 0:
            for link in data:
                ndp_project_service.update(link['ndp_project_id'], {
                    'project_id': link['project_id']}, partial=True)
                project_service.update(link['project_id'], {
                                       'ndp_pip_code': link['ndp_pip_code']}, partial=True)

    def _search_project_by_coa_code(self, coa_code, projects=dict()):
        for project_id, project_coa_code in projects.items():
            if coa_code == project_coa_code:
                return project_id

    def _format_ndp_item_by_title(self, data):
        titles = {
            'ndp_pip_code': 'Ua2sjMzo6go',
            'project_name': 'GyA00lAFONP',
            'implementation_status': 'Fa3L6MarXZJ',
            'planned_start_date': 'k38zTXSGVk1',
            'planned_end_date': 'vn6bwFBupTG',
            'total_cost': 'SEztKNv45lk',
            'description': 'pGVLjJxRj6Z'
        }
        formatted_data = dict()
        if len(data) > 0:
            for item in data:
                key = get_key_by_value_dict(item['attribute'], titles)
                formatted_data[key] = item['value']
            for key, value in titles.items():
                if key not in formatted_data:
                    formatted_data[key] = None
        return formatted_data

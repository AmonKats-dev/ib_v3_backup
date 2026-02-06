import json

from app.constants import API_V1_PREFIX, BuildingBlockType, messages

from tests.helpers import (assert_error_method_not_allowed,
                           assert_error_not_found, assert_success_200,
                           get_valid_token)

from .test_phase import phase_create
from .test_project import project_create

COMPONENT_URL = f'{API_V1_PREFIX}/project-details'


def test_project_detail_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found(response)


def test_project_detail_crud(client):
    token = get_valid_token(client)
    project_detail_create(client, token)
    project_detail_list(client, token)
    project_detail_read(client, token)
    project_detail_update(client, token)
    project_detail_delete(client, token)


def test_project_detail_filter(client):
    token = get_valid_token(client)
    project_detail_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"project_id": 1, "phase_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)

    response = client.get(
        COMPONENT_URL + '?filter={"project_id": 2}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found(response)

    response = client.get(
        COMPONENT_URL + '?filter={"phase_id": 2}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found(response)


def project_detail_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def project_detail_list(client, token):
    response = client.get(
        COMPONENT_URL + '?filter={"project_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def project_detail_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def project_detail_create(client, token):
    project_create(client, token)

    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json"
    )
    data = json.loads(response.data)
    assert data["project_id"] == 1


def project_detail_update(client, token):
    data = {
        'situation_analysis': 'some more text',
        'responsible_officers': [
            {
                'title': 'Senior Analyst',
                'name': 'John Doe',
                'email': 'john@doe.com'
            }
        ],
        'beneficiary_analysis': {
            'year': 2021,
            'population': 1000000
        },
        'locations': [
            {
                'location_id': 1
            }
        ],
        'strategic_alignments': [
            {
                'plan': "some_plan"
            }
        ],
        'implementing_agencies': [
            {
                'organization_id': 1
            }
        ],
        'executing_agencies': [
            {
                'organization_id': 1
            }
        ],
        'government_coordinations': [
            {
                'organization_id': 1,
                'description': "some_text",
            }
        ],
        'components': [
            {
                'name': 'Component 1',
                'description': 'component description',
                'cost': '10000',
                'subcomponents': [{"name": "subcomponent 1"}]
            }
        ],
        'outcomes': [
            {
                'name': 'Increase in proportion of urban people',
                'indicators': [
                    {
                        'name': 'time taken',
                        'baseline': '2000',
                        'verification_means': 'some reason'
                    }
                ]
            }
        ],
        'outputs': [
            {
                'name': 'Forest based enterprises',
                'unit_id': 1,
                'output_value': '100',
                'outcome_ids': [1],
                'organization_ids': [1, 2],
                'indicators': [
                    {
                        'name': 'time taken',
                        'baseline': '2000',
                        'verification_means': 'some reason'
                    }
                ]
            }
        ],
        'activities': [
            {
                'name': 'Documentation',
                'output_ids': [1, 2],
                'start_date': '2020-12-01',
                'end_date': '2020-12-20',
                'investments': [
                    {
                        'costs': {
                            '2019': 1000,
                            '2020': 2000
                        },
                        'fund_id': 1,
                        'costing_id': 1
                    }
                ]
            }
        ],
        'om_costs': [
            {
                'costs': {
                    '2019': 1000,
                    '2020': 2000
                },
                'fund_id': 1,
                'costing_id': 1
            }
        ],
        'stakeholders': [
            {
                'name': 'Ministry',
                'responsibilities': 'full completion'
            }
        ],
        'post_evaluation': {
            'evaluation_methodology': 'some text',
            'achieved_outcomes': 'some text',
            'deviation_reasons': 'some text',
            'measures': 'some text',
            'lessons_learned': 'some text'
        },
        'climate_risks': [
            {
                'climate_hazard': 'Landslide',
                'exposure_risk': 'HIGH',
                'vulnerability_risk': 'MEDIUM',
                'overall_risk': 'LOW'
            }
        ],
        'climate_resilience': {
            'potential_description': 'Climate Resilience Description',
            'potential_amount': '10000'
        },
        'project_risks': [
            {
                'name': 'Risk',
                'impact_level': 'HIGH',
                'probability': 'MEDIUM',
                'score': 'LOW'
            }
        ],
        'project_options': [
            {
                'name': 'Construction of office',
                'cost': '20000',
                'score': 1,
                'funding_modality': 'PARTNERSHIP',
                'building_blocks': [
                    {
                        'module_type': BuildingBlockType.DEMAND_MODULE.value,
                        'score': 1
                    }
                ],
                'economic_evaluation': {
                    'enpv': '123.23',
                    'err': '1.32',
                    'appraisal_methodology': 'CEA'
                },
                'financial_evaluation': {
                    'fnpv': '123.23',
                    'irr': '1.32',
                    'appraisal_methodology': 'CEA'
                },
                'risk_evaluations': [
                    {
                        'occurrence': 'HIGH',
                        'impact': 'MEDIUM'
                    }
                ],
                'stakeholder_evaluations': [
                    {
                        'name': 'Patients Benefit',
                        'impact_sign': 'POSITIVE',
                        'beneficiary': 'DIRECT'
                    }
                ],
            }
        ]
    }
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["situation_analysis"] == "some more text"


def project_detail_delete(client, token):
    response = client.delete(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json"
    )
    assert_error_method_not_allowed(response)

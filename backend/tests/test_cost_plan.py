import json

from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_error_missing_field,
                           assert_error_not_found, assert_no_content_204,
                           assert_success_200, get_valid_token)

from .test_project_detail import project_detail_create

COMPONENT_URL = f'{API_V1_PREFIX}/cost-plans'


def test_cost_plan_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found(response)


def test_cost_plan_crud(client):
    token = get_valid_token(client)
    cost_plan_create(client, token)
    cost_plan_list(client, token)
    cost_plan_read(client, token)
    cost_plan_update(client, token)


def test_cost_plan_filter(client):
    token = get_valid_token(client)
    cost_plan_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"project_detail_id": 1, "year": "2022"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def cost_plan_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found


def cost_plan_list(client, token):
    response = client.get(
        COMPONENT_URL + '?filter={"project_detail_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def cost_plan_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def cost_plan_create(client, token):
    project_detail_create(client, token)
    data = {
        "year": 2022,
        "project_detail_id": 1,
        "cost_plan_activities": [
            {
                'name': 'Documentation',
                'output_ids': [1, 2],
                'start_date': '2020-12-01',
                'end_date': '2020-12-20',
            }
        ],
        "cost_plan_items": [
            {
                "amount": "1000",
                "fund_id": 1,
                "costing_id": 1,
            }
        ]
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_created_201(response)
    data = json.loads(response.data)
    assert data["id"] == 1
    assert data["cost_plan_status"] == "DRAFT"


def cost_plan_update(client, token):
    data = {
        "cost_plan_status": "SUBMITTED",
        "cost_plan_activities": [
            {
                "activity_id": 23,
                'name': 'Documentation 2',
                'output_ids': [1, 2],
                'start_date': '2021-12-01',
                'end_date': '2021-12-20',
            }
        ],
        "cost_plan_items": [
            {
                "amount": "2000",
                "fund_id": 2,
                "costing_id": 2
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
    assert data["cost_plan_status"] == "SUBMITTED"

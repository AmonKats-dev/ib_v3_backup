import json

from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_error_missing_field,
                           assert_error_not_found, assert_no_content_204,
                           assert_success_200, get_valid_token)

from .test_project_detail import project_detail_create

COMPONENT_URL = f'{API_V1_PREFIX}/me-reports'


def test_me_report_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found(response)


def test_me_report_crud(client):
    token = get_valid_token(client)
    me_report_create(client, token)
    me_report_list(client, token)
    me_report_read(client, token)
    me_report_update(client, token)


def test_me_report_filter(client):
    token = get_valid_token(client)
    me_report_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"project_detail_id": 1, "quarter": "Q2"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def me_report_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found


def me_report_list(client, token):
    response = client.get(
        COMPONENT_URL + '?filter={"project_detail_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def me_report_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def me_report_create(client, token):
    project_detail_create(client, token)
    data = {
        "quarter": "Q2",
        "year": 2020,
        "project_detail_id": 1,
        "me_workflow_id": 1,
        "current_step": 1,
        "max_step": 1,
        "me_type": "Monitoring",
        "frequency": "ANNUAL",
        "data_collection_type": "Monitoring",
        "me_outputs": [
            {
                "output_id": 1,
                "output_progress": 60,
                "indicators": [{"id": 1, "target": 1231}]
            }
        ],
        "me_liabilities": [
            {
                "description": "contingency liability",
                "amount": "1000",
                "due_date": "2020-01-01"
            }
        ],
        "me_activities": [
            {
                "activity_id": 1,
                "activity_id": 23,
                "activity_status": "DELAYED",
                "expected_completion_date": "2020-01-01",
                "challenges": "some text",
                "measures": "some text",
                "budget_appropriation": "32000",
                "budget_allocation": "32000",
                "allocation_challenges": "some_text",
                "allocation_measures": "some_text",
                "financial_execution": "32000",
                "execution_challenges": "some_text",
                "execution_measures": "some_text",
                "next_budget_appropriation": "32000",
                "fund_source": "Donor"
            }
        ],
        "me_releases": [
            {
                "release_type": "PLANNED",
                "government_funded": {"2018": 23322, "2019": 24000},
                "donor_funded": {"2018": 23322, "2019": 24000}
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


def me_report_update(client, token):
    data = {
        "report_status": "SUBMITTED",
        "me_outputs": [
            {
                "output_id": 1,
                "output_progress": 60,
                "indicators": [{"id": 1, "target": 1231}]
            }
        ],
        "me_liabilities": [
            {
                "description": "contingency liability",
                "amount": "1000",
                "due_date": "2020-01-01"
            }
        ],
        "me_activities": [
            {
                "activity_id": 1,
                "activity_id": 23,
                "activity_status": "DELAYED",
                "expected_completion_date": "2020-01-01",
                "challenges": "some text",
                "measures": "some text",
                "budget_appropriation": "32000",
                "budget_allocation": "32000",
                "allocation_challenges": "some_text",
                "allocation_measures": "some_text",
                "financial_execution": "32000",
                "execution_challenges": "some_text",
                "execution_measures": "some_text",
                "next_budget_appropriation": "32000",
                "fund_source": "Donor"
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
    assert data["report_status"] == "SUBMITTED"

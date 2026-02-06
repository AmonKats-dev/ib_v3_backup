import json

from app.constants import messages
from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_custom_error,
                           assert_error_missing_field, assert_no_content_204,
                           assert_success_200, get_valid_token)

from .test_organization import organization_create
from .test_phase import phase_create
from .test_program import program_create
from .test_workflow import workflow_create

COMPONENT_URL = f'{API_V1_PREFIX}/projects'


def test_project_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_project_crud(client):
    token = get_valid_token(client)
    project_create(client, token)
    project_list(client, token)
    project_read(client, token)
    project_update(client, token)
    project_delete(client, token)


def test_project_filter(client):
    token = get_valid_token(client)
    project_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"organization_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    response = client.get(
        COMPONENT_URL + '?filter={"program_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1
    response = client.get(
        COMPONENT_URL + '?filter={"organization_id": 5}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0
    response = client.get(
        COMPONENT_URL + '?filter={"program_id": 5}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def project_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def project_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def project_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def project_create(client, token):
    organization_create(client, token)
    organization_create(client, token, 1, 2)
    organization_create(client, token, 2, 3)
    program_create(client, token)
    program_create(client, token, 1, 2, 2)
    program_create(client, token, 2, 3, 3)
    phase_create(client, token)
    workflow_create(client, token)
    data = {
        "name": "Road Construction",
        "summary": "summary",
        "start_date": "2020-01-01",
        "end_date": "2021-01-01",
        "organization_id": 3,
        "program_id": 3
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_created_201(response)
    data = json.loads(response.data)
    assert data["name"] == "Road Construction"
    assert data["project_status"] == 'DRAFT'
    assert data["code"] == '00001-001-001'


def project_update(client, token):
    data = dict()
    data["name"] = "New Road Construction"
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["name"] == "New Road Construction"


def test_project_without_organization(client):
    token = get_valid_token(client)
    phase_create(client, token)
    workflow_create(client, token)
    data = {
        "name": "Road Construction",
        "program_id": 1,
        "start_date": "2020-01-01",
        "end_date": "2021-01-01"
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_error_missing_field(response, "organization")


def test_project_with_wrong_organization(client):
    token = get_valid_token(client)
    phase_create(client, token)
    workflow_create(client, token)
    data = {
        "name": "Road Construction",
        "program_id": 1,
        "organization_id": 10,
        "start_date": "2020-01-01",
        "end_date": "2021-01-01"
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_custom_error(response, 422, messages.ORGANIZATION_NOT_FOUND)


def project_delete(client, token):
    response = client.delete(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json"
    )
    assert_success_200(response)
    data = json.loads(response.data)
    data["id"] = 1
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0

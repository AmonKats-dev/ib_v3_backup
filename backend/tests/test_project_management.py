import json

from app.constants import API_V1_PREFIX, BuildingBlockType, messages

from tests.helpers import (assert_error_method_not_allowed,
                           assert_error_not_found, assert_success_200,
                           get_valid_token)

from .test_phase import phase_create
from .test_project import project_create

COMPONENT_URL = f'{API_V1_PREFIX}/project-management'


def test_project_management_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found(response)


def test_project_management_crud(client):
    token = get_valid_token(client)
    project_management_create(client, token)
    project_management_list(client, token)
    project_management_read(client, token)
    project_management_update(client, token)
    project_management_delete(client, token)


def test_project_management_filter(client):
    token = get_valid_token(client)
    project_management_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"project_id": 1}',
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


def project_management_list(client, token):
    response = client.get(
        COMPONENT_URL + '?filter={"project_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def project_management_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def project_management_create(client, token):
    project_create(client, token)
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    data = json.loads(response.data)
    assert data["project_id"] == 1


def project_management_update(client, token):
    data = {
        "project_id": 1,
        "task": [{"id": 1, "name": "task 1"}],
        "link": {"link": True}
    }
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["link"] == {"link": True}


def project_management_delete(client, token):
    response = client.delete(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json"
    )
    assert_error_method_not_allowed

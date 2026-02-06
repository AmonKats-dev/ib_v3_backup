import json

from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_error_missing_field,
                           assert_no_content_204, assert_success_200,
                           get_valid_token)

COMPONENT_URL = f'{API_V1_PREFIX}/donor-projects'


def test_donor_project_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_donor_project_crud(client):
    token = get_valid_token(client)
    donor_project_create(client, token)
    donor_project_list(client, token)
    donor_project_read(client, token)
    donor_project_update(client, token)
    donor_project_delete(client, token)


def test_donor_project_filter(client):
    token = get_valid_token(client)
    donor_project_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"name": "Project 1"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def donor_project_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def donor_project_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def donor_project_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def donor_project_create(client, token):
    data = dict()
    data["name"] = "Project 1"
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_created_201(response)
    data = json.loads(response.data)
    assert data["id"] == 1


def donor_project_update(client, token):
    data = dict()
    data["name"] = "Project 2"
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["name"] == "Project 2"


def donor_project_delete(client, token):
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

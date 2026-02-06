import json

from tests.helpers import (assert_created_201, assert_error_missing_field,
                           assert_no_content_204, assert_success_200,
                           get_valid_token)

from app.constants.common import API_V1_PREFIX

COMPONENT_URL = f'{API_V1_PREFIX}/roles'


def role_create(client, token):
    data = {
        "name": "Administrator",
        "permissions": {"list_countries": {}},
        "organization_level": 2,
        "has_allowed_projects": True,
        "phase_ids": [1]
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_created_201(response)
    data = json.loads(response.data)
    assert data["id"] == 2
    assert data["organization_level"] == 2
    assert data["has_allowed_projects"] == True


def test_role_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def test_role_crud(client):
    token = get_valid_token(client)
    role_create(client, token)
    role_list(client, token)
    role_read(client, token)
    role_update(client, token)
    role_delete(client, token)


def test_role_filter(client):
    token = get_valid_token(client)
    role_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"name": "Administrator"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1

    response = client.get(
        COMPONENT_URL + '?filter={"name": "guest"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def role_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def role_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 2


def role_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/2',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['name'] == "Administrator"


def role_update(client, token):
    data = dict()
    data["name"] = "admin"
    response = client.patch(
        f'{COMPONENT_URL}/2',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["name"] == "admin"


def test_role_without_name(client):
    token = get_valid_token(client)
    data = {
        "permissions": {"list_countries": {}}
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_error_missing_field(response, "name")


def role_delete(client, token):
    response = client.delete(
        f'{COMPONENT_URL}/2',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json"
    )
    assert_success_200(response)
    data = json.loads(response.data)
    data["id"] = 2
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1

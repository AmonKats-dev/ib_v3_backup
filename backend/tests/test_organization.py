import json

from tests.helpers import (assert_created_201, assert_custom_error,
                           assert_error_missing_field, assert_no_content_204,
                           assert_success_200, get_valid_token)

from app.constants import messages
from app.constants.common import API_V1_PREFIX

COMPONENT_URL = f'{API_V1_PREFIX}/organizations'


def test_organization_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_organization_crud(client):
    token = get_valid_token(client)
    organization_create(client, token)
    organization_list(client, token)
    organization_read(client, token)
    organization_update(client, token)
    organization_delete(client, token)


def test_organization_filter(client):
    token = get_valid_token(client)
    organization_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"code": "001", "level":1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1
    organization_create(client, token, 1, 2)
    response = client.get(
        COMPONENT_URL + '?filter={"parent_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1
    response = client.get(
        COMPONENT_URL + '?filter={"code": "MIN"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0
    response = client.get(
        COMPONENT_URL + '?filter={"level": 3}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def organization_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def organization_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def organization_read(client, token, id=1, parent_id=None):
    response = client.get(
        f'{COMPONENT_URL}/{id}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == id
    assert data['parent_id'] == parent_id
    if parent_id is not None:
        assert data["parent"]["id"] == parent_id


def organization_create(client, token, parent_id=None, level=1):
    data = {
        "code": "001",
        "name": "Public Investment Department"
    }
    if parent_id is not None:
        data["parent_id"] = parent_id
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_created_201(response)
    data = json.loads(response.data)
    assert data["name"] == "Public Investment Department"
    assert data["parent_id"] == parent_id
    assert data["level"] == level
    if parent_id is not None:
        assert data["parent"]["id"] == parent_id


def organization_update(client, token):
    data = dict()
    data["name"] = "Public Investment Branch"
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["name"] == "Public Investment Branch"


def test_organization_without_code(client):
    token = get_valid_token(client)
    data = {
        "name": "Public Investment Branch"
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_error_missing_field(response, "code")


def test_organization_multi_level(client):
    token = get_valid_token(client)
    organization_create(client, token)
    organization_create(client, token, 1, 2)
    organization_read(client, token, id=2, parent_id=1)


def test_organization_wrong_multi_level(client):
    token = get_valid_token(client)
    organization_create(client, token)
    data = {
        "code": "001",
        "name": "Public Investment Department",
        "parent_id": 2
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_custom_error(response, 422, messages.PARENT_NOT_FOUND)


def test_organization_delete_parent(client):
    token = get_valid_token(client)
    organization_create(client, token)
    organization_create(client, token, 1, 2)
    organization_delete(client, token)


def organization_delete(client, token):
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

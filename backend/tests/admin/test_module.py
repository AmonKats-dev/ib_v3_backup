import json

from tests.helpers import (assert_created_201, assert_error_invalid_field_type,
                           assert_no_content_204, assert_success_200,
                           get_valid_token)

from app.constants.common import ADMIN_PREFIX

COMPONENT_URL = f'{ADMIN_PREFIX}/modules'


def test_module_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_module_crud(client):
    token = get_valid_token(client)
    module_create(client, token)
    module_list(client, token)
    module_read(client, token)
    module_update(client, token)
    module_delete(client, token)


def test_module_filter(client):
    token = get_valid_token(client)
    module_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"key": "project_summary"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0
    response = client.get(
        COMPONENT_URL + '?filter={"key": "responsible_officer"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def module_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def module_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def module_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def module_create(client, token):
    data = {
        "key": "responsible_officer",
        "name": "Responsible Officer",
        "module_actions": ["create", "read"]
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


def test_module_update_wrong_action(client):
    token = get_valid_token(client)
    data = {
        "module_actions": "some_string"
    }
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_error_invalid_field_type(response, "module_actions")


def module_update(client, token):
    data = {
        "show_in_menu": True,
        "module_actions": ["create", "update"]
    }
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["show_in_menu"] == True
    assert data["module_actions"] == ["create", "update"]


def module_delete(client, token):
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

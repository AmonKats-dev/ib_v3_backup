import json

from tests.helpers import (assert_created_201, assert_error_missing_field,
                           assert_no_content_204, assert_success_200,
                           get_valid_token)

from app.constants.common import API_V1_PREFIX

COMPONENT_URL = f'{API_V1_PREFIX}/user-roles'


def user_role_create(client, token):
    data = {
        "user_id": 1,
        "role_id": 1
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


def test_user_role_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def test_user_role_crud(client):
    token = get_valid_token(client)
    user_role_create(client, token)
    user_role_list(client, token)
    user_role_read(client, token)
    user_role_update(client, token)
    user_role_delete(client, token)


def test_user_role_filter(client):
    token = get_valid_token(client)
    user_role_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"user_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 2

    response = client.get(
        COMPONENT_URL + '?filter={"user_id": 2}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def user_role_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def user_role_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 2


def user_role_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/2',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['user_id'] == 1


def user_role_update(client, token):
    data = dict()
    data["allowed_organization_ids"] = "1,2"
    response = client.patch(
        f'{COMPONENT_URL}/2',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["allowed_organization_ids"] == "1,2"


def test_user_role_without_user_and_role(client):
    token = get_valid_token(client)
    data = {
        "allowed_organization_ids": "1"
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_error_missing_field(response, "user_id")
    assert_error_missing_field(response, "role_id")


def user_role_delete(client, token):
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

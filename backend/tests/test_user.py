import json

from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_custom_error,
                           assert_no_content_204, assert_success_200,
                           get_valid_token)

from .test_organization import organization_create

COMPONENT_URL = f'{API_V1_PREFIX}/users'


def test_user_filter(client):
    token = get_valid_token(client)
    user_create(client, token)
    response = client.get(
        COMPONENT_URL +
        '?filter={"username": "john_doe", "organization_id":1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1

    response = client.get(
        COMPONENT_URL + '?filter={"username": "john_doe2"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0
    response = client.get(
        COMPONENT_URL + '?filter={"organization_id": 5}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_user_crud(client):
    token = get_valid_token(client)
    user_create(client, token)
    user_list(client, token)
    user_read(client, token)
    user_update(client, token)
    user_update_password(client, token)
    user_delete(client, token)


def test_user_list_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 2


def user_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) > 1


def user_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/3',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['username'] == "john_doe"


def test_user_view_own_profile(client):
    token = get_valid_token(client)
    response = client.get(
        f'{COMPONENT_URL}/me',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['username'] == "test"


def test_user_strong_password(client):
    token = get_valid_token(client)
    data = dict()
    data["password"] = "some_pass123"
    response = client.patch(
        f'{COMPONENT_URL}/3',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_custom_error(response,  422, "password")


def user_create(client, token):
    organization_create(client, token)
    organization_create(client, token, 1, 2)
    organization_create(client, token, 2, 3)
    data = {
        "username": "john_doe",
        "password": "str0NGpass*",
        "full_name": "John Doe",
        "email": "john_doe@ibp.com",
        "phone": "+1987654321",
        "organization_id": 3
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_created_201(response)
    data = json.loads(response.data)
    assert data["username"] == "john_doe"
    assert data["organization_id"] == 3


def user_update(client, token):
    data = dict()
    data["full_name"] = "Jane Doe"
    response = client.patch(
        f'{COMPONENT_URL}/3',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["full_name"] == "Jane Doe"


def user_update_password(client, token):
    token = get_valid_token(client)
    data = dict()
    data["password"] = "str0NGpass*_new"
    response = client.patch(
        f'{COMPONENT_URL}/3',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    no_token = get_valid_token(
        client, username="john_doe", password="some_password")
    new_token = get_valid_token(
        client, username="john_doe", password="str0NGpass*_new")

    assert no_token is None
    assert len(new_token) > 50


def user_delete(client, token):
    response = client.delete(
        f'{COMPONENT_URL}/3',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json"
    )
    assert_success_200(response)
    data = json.loads(response.data)
    data["id"] = 3
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 2

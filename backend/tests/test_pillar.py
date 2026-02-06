import json

from app.constants import messages
from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_custom_error,
                           assert_error_missing_field, assert_no_content_204,
                           assert_success_200, get_valid_token)

COMPONENT_URL = f'{API_V1_PREFIX}/pillars'


def test_pillar_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_pillar_crud(client):
    token = get_valid_token(client)
    pillar_create(client, token)
    pillar_list(client, token)
    pillar_read(client, token)
    pillar_update(client, token)
    pillar_delete(client, token)


def test_pillar_filter(client):
    token = get_valid_token(client)
    pillar_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"code": "001"}',
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


def pillar_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def pillar_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def pillar_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def pillar_create(client, token):
    data = {
        "code": "001",
        "name": "Public Investment Department"
    }

    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_created_201(response)
    data = json.loads(response.data)
    assert data["name"] == "Public Investment Department"


def pillar_update(client, token):
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


def test_pillar_without_code(client):
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


def pillar_delete(client, token):
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

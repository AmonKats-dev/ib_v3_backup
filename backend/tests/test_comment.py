import json

from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_error_missing_field,
                           assert_no_content_204, assert_success_200,
                           get_valid_token)

COMPONENT_URL = f'{API_V1_PREFIX}/comments'


def test_phase_filter(client):
    token = get_valid_token(client)
    comment_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"project_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def test_comment_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_comment_crud(client):
    token = get_valid_token(client)
    comment_create(client, token)
    comment_list(client, token)
    comment_read(client, token)
    comment_update(client, token)
    comment_delete(client, token)


def comment_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def comment_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def comment_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def comment_create(client, token):
    data = {
        "project_id": 1,
        "content": "Some new comment"
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


def comment_update(client, token):
    data = dict()
    data["content"] = "Changed comment"
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["content"] == "Changed comment"


def test_comment_without_project_id(client):
    token = get_valid_token(client)
    data = dict()
    data["content"] = "Better comment"
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_error_missing_field(response, "project_id")


def comment_delete(client, token):
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

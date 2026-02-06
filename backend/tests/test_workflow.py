import json

from tests.helpers import (assert_created_201, assert_error_duplicate_entry,
                           assert_error_missing_field, assert_no_content_204,
                           assert_success_200, get_valid_token)

from app.constants.common import API_V1_PREFIX

COMPONENT_URL = f'{API_V1_PREFIX}/workflows'


def test_workflow_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_workflow_crud(client):
    token = get_valid_token(client)
    workflow_create(client, token)
    workflow_list(client, token)
    workflow_read(client, token)
    workflow_update(client, token)
    workflow_delete(client, token)


def test_workflow_filter(client):
    token = get_valid_token(client)
    workflow_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"step": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1
    response = client.get(
        COMPONENT_URL + '?filter={"step": 2}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def workflow_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def workflow_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def workflow_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1
    assert data['actions'] == ["submit"]


def workflow_create(client, token):
    data = {
        "role_id": 1,
        "step": 1,
        "phases": [1],
        "status_msg": "in draft",
        "actions": ["submit"]
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


def workflow_update(client, token):
    data = dict()
    data["status_msg"] = "draft"
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["status_msg"] == "draft"


def test_workflow_with_duplicate_step(client):
    token = get_valid_token(client)
    workflow_create(client, token)
    data = {
        "role_id": 1,
        "step": 1,
        "phases": [1],
        "status_msg": "in draft"
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_error_duplicate_entry(response)


def test_workflow_without_step(client):
    token = get_valid_token(client)
    data = {
        "role_id": 1,
        "status_msg": "in draft"
    }
    response = client.post(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_error_missing_field(response, "step")


def workflow_delete(client, token):
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

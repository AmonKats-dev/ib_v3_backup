import json

from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_error_not_found,
                           assert_success_200, get_valid_token)

from .test_project_detail import project_detail_create

COMPONENT_URL = f'{API_V1_PREFIX}/human-resources'


def test_human_resource_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found(response)


def test_human_resource_crud(client):
    token = get_valid_token(client)
    human_resource_create(client, token)
    human_resource_list(client, token)
    human_resource_read(client, token)
    human_resource_update(client, token)


def test_human_resource_filter(client):
    token = get_valid_token(client)
    human_resource_create(client, token)
    response = client.get(
        COMPONENT_URL +
        '?filter={"project_detail_id": 1, "reporting_quarter": "Q2"}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def human_resource_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found


def human_resource_list(client, token):
    response = client.get(
        COMPONENT_URL + '?filter={"project_detail_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def human_resource_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def human_resource_create(client, token):
    project_detail_create(client, token)
    data = {
        "reporting_quarter": "Q2",
        "reporting_date": '2020-12-01',
        "project_detail_id": 1,
        "name": "John Doe",
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


def human_resource_update(client, token):
    data = {
        "reporting_quarter": "Q2",
        "reporting_date": '2020-12-01',
        "project_detail_id": 1,
        "name": "Jane Doe",
    }
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["name"] == "Jane Doe"

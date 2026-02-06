import json

from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_error_missing_field,
                           assert_no_content_204, assert_success_200,
                           get_valid_token)

from .test_ndp_outcome import ndp_outcome_create

COMPONENT_URL = f'{API_V1_PREFIX}/ndp-strategies'


def test_ndp_strategy_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_ndp_strategy_crud(client):
    token = get_valid_token(client)
    ndp_strategy_create(client, token)
    ndp_strategy_list(client, token)
    ndp_strategy_read(client, token)
    ndp_strategy_update(client, token)
    ndp_strategy_delete(client, token)


def test_ndp_strategy_filter(client):
    token = get_valid_token(client)
    ndp_outcome_create(client, token)
    ndp_strategy_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"name": "Strategy 1", "ndp_outcome_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1
    response = client.get(
        COMPONENT_URL + '?filter={"ndp_outcome_id": 2}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0
    response = client.get(
        COMPONENT_URL + '?filter={"ndp_goal_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def ndp_strategy_list_empty(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def ndp_strategy_list(client, token):
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1


def ndp_strategy_read(client, token):
    response = client.get(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data['id'] == 1


def ndp_strategy_create(client, token):
    data = {
        'name': 'Strategy 1',
        'ndp_outcome_id': 1
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


def ndp_strategy_update(client, token):
    data = dict()
    data["name"] = "Strategy 2"
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["name"] == "Strategy 2"


def ndp_strategy_delete(client, token):
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

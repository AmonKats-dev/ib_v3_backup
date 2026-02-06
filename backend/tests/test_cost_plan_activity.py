import json

from app.constants import messages
from app.constants.common import API_V1_PREFIX

from tests.helpers import (assert_error_method_not_allowed,
                           assert_error_not_found, assert_success_200,
                           get_valid_token)

from .test_cost_plan import cost_plan_create, cost_plan_update

COMPONENT_URL = f'{API_V1_PREFIX}/cost-plan-activities'


def test_cost_plan_activity_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found(response)


def test_cost_plan_activity_list(client):
    token = get_valid_token(client)
    cost_plan_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"project_detail_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1

    cost_plan_update(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"project_detail_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]["activity_id"] == 23

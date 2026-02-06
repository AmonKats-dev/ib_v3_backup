import json

from tests.helpers import (assert_error_method_not_allowed,
                           assert_error_not_found, assert_success_200,
                           get_valid_token)

from app.constants import messages
from app.constants.common import API_V1_PREFIX

from .test_me_report import me_report_create, me_report_update

COMPONENT_URL = f'{API_V1_PREFIX}/me-activities'


def test_me_activity_empty(client):
    token = get_valid_token(client)
    response = client.get(
        COMPONENT_URL,
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_not_found(response)


def test_me_activity_list(client):
    token = get_valid_token(client)
    me_report_create(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"project_detail_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1

    me_report_update(client, token)
    response = client.get(
        COMPONENT_URL + '?filter={"project_detail_id": 1}',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 1

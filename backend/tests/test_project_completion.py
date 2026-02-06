import json

from app.constants import API_V1_PREFIX

from tests.helpers import (assert_created_201, assert_success_200,
                           get_valid_token)

from .test_project import project_create

COMPONENT_URL = f'{API_V1_PREFIX}/project-completion'


def test_project_completion_create(client):
    token = get_valid_token(client)
    project_create(client, token)
    data = {
        'sustainability_plan': 'some plan',
        "project_id": 1,
        'outputs': [{'specifications': 'some requirement'}]
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


def test_project_completion_update(client):
    token = get_valid_token(client)
    test_project_completion_create(client)
    data = {
        "project_id": 1,
        'sustainability_plan': 'new plan',
    }
    response = client.patch(
        f'{COMPONENT_URL}/1',
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
        data=json.dumps(data)
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert data["sustainability_plan"] == 'new plan'

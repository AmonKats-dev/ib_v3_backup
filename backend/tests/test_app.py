import json

from tests.helpers import (
    assert_error_missing_token,
    assert_error_invalid_token,
    assert_success_200,
    get_valid_token,
)


def test_healthcheck(client):
    response = client.get("/healthcheck")
    data = json.loads(response.data)
    assert_success_200(response)
    assert data["status"] == "success"


def test_access_protected_endpoint_with_valid_token(client):
    token = get_valid_token(client)
    response = client.get(
        "/api/v1/countries",
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_success_200(response)
    data = json.loads(response.data)
    assert len(data) == 0


def test_access_protected_endpoint_without_token(client):
    response = client.get("/api/v1/countries", content_type="application/json")
    assert_error_missing_token(response)


def test_access_protected_endpoint_without_valid_token(client):
    token = "djkafkldhsfhl"
    response = client.get(
        "/api/v1/countries",
        headers=dict(Authorization="Bearer " + token),
        content_type="application/json",
    )
    assert_error_invalid_token(response)

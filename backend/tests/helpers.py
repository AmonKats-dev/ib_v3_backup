import json

from app.constants import messages

default_username = "test"
default_password = "test"


def login_user(client, username, password,):
    data = dict()
    data["username"] = username
    data["password"] = password

    response = client.post(
        "/api/v1/auth/login",
        content_type="application/json",
        data=json.dumps(data)
    )
    return response


def get_valid_token(client, username=None, password=None):
    username = username if username else default_username
    password = password if password else default_password
    response = login_user(client=client, username=username, password=password)
    data = json.loads(response.data)
    return data.get("access_token")


def assert_success_200(response):
    assert response.status_code == 200
    assert response.content_type == "application/json"


def assert_created_201(response):
    assert response.status_code == 201
    assert response.content_type == "application/json"


def assert_no_content_204(response):
    assert response.status_code == 204
    assert response.content_type == "application/json"


def assert_error(response, error_code):
    assert response.status_code == error_code
    assert response.content_type == "application/json"


def assert_error_missing_token(response):
    assert_error(response, 401)
    data = json.loads(response.data)
    assert data["msg"] == "Missing Authorization Header"


def assert_error_invalid_token(response):
    assert_error(response, 422)
    data = json.loads(response.data)
    assert data["msg"] == "Not enough segments"


def assert_error_token_expired(response):
    assert_error(response, 401)
    data = json.loads(response.data)
    assert data["errorCode"] == "TOKEN_EXPIRED"


def assert_error_no_access(response):
    assert_error(response, 403)
    data = json.loads(response.data)
    assert data["message"] == messages.NO_RECORD_ACCESS


def assert_error_duplicate_entry(response):
    assert_error(response, 500)
    data = json.loads(response.data)
    assert messages.UNIQUE_CONSTAINT_FAILED in data["message"]


def assert_error_missing_field(response, field):
    assert_error(response, 422)
    data = json.loads(response.data)
    assert field in data["message"]
    assert "Missing" in data["message"]


def assert_custom_error(response, error_code, field):
    assert_error(response, error_code)
    data = json.loads(response.data)
    assert field in data["message"]


def assert_error_not_found(response):
    assert_error(response, 404)
    data = json.loads(response.data)
    assert data["message"] == messages.NOT_FOUND


def assert_error_method_not_allowed(response):
    assert_error(response, 405)
    data = json.loads(response.data)
    assert data["message"] == messages.METHOD_NOT_ALLOWED


def assert_error_invalid_field_type(response, field):
    assert_error(response, 422)
    data = json.loads(response.data)
    assert field in data["message"]
    assert "Not a valid" in data["message"]

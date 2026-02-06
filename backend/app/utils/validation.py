import json

from flask_restful import abort
from marshmallow import ValidationError

from app.constants import messages


def validate_schema(json_data, schema, partial=False):
    if not json_data:
        abort(500, message=messages.NO_INPUT)
    try:
        data = schema.load(json_data, partial=partial)
    except ValidationError as error:
        abort(422, message=str(error.normalized_messages()))
    return data

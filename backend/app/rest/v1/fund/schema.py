from app.constants import messages
from app.core import BaseSchema, generate_schema
from marshmallow import ValidationError, fields, validate

schema = {}
schema["code"] = fields.Str(required=True, validate=validate.Length(max=20))
schema["name"] = fields.Str(required=True, validate=validate.Length(max=255))
schema["parent_id"] = fields.Integer(required=False, allow_none=True)
schema["parent"] = fields.Nested(
    "FundSchema", exclude=("children",), dump_only=True)
schema["children"] = fields.Nested(
    "FundSchema", exclude=("parent",), many=True, dump_only=True)
schema["level"] = fields.Integer(dump_only=True)
schema['is_donor'] = fields.Bool(required=False, allow_none=True)
schema["additional_data"] = fields.Raw(required=False, allow_none=True)

schema = generate_schema("fund", schema)
FundSchema = type("FundSchema", (BaseSchema,), schema)

from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema["code"] = fields.Str(required=True, validate=validate.Length(max=20))
schema["name"] = fields.Str(required=True, validate=validate.Length(max=255))
schema["fund_id"] = fields.Integer(required=False, allow_none=True)
schema["fund"] = fields.Nested("FundSchema", exclude=("children", "parent"), dump_only=True)
schema["additional_data"] = fields.Raw(required=False, allow_none=True)

schema = generate_schema("fund_source", schema)
FundSourceSchema = type("FundSourceSchema", (BaseSchema,), schema)


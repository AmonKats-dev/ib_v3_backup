from app.constants import messages
from app.core import BaseSchema, generate_schema
from marshmallow import ValidationError, fields, validate

schema = {}
schema["code"] = fields.Str(required=True, validate=validate.Length(max=20))
schema["name"] = fields.Str(required=True, validate=validate.Length(max=255))
schema["parent_id"] = fields.Integer(required=False, allow_none=True)
schema["parent"] = fields.Nested(
    "ProgramSchema", exclude=("children",), dump_only=True)
schema["children"] = fields.Nested(
    "ProgramSchema", exclude=("parent",), many=True, dump_only=True)
schema["level"] = fields.Integer(dump_only=True)
schema['organization_ids'] = fields.Str(
    required=False, allow_none=True)
# function_id and function - uncomment after running migration 7104944bd94b
# schema['function_id'] = fields.Integer(required=False, allow_none=True)
# schema["function"] = fields.Nested("FunctionSchema", dump_only=True)
schema["additional_data"] = fields.Raw(required=False, allow_none=True)

schema = generate_schema("program", schema)
ProgramSchema = type("ProgramSchema", (BaseSchema,), schema)

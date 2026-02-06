from app.constants import messages
from app.core import BaseSchema, generate_schema
from marshmallow import ValidationError, fields, validate

schema = {}
schema["code"] = fields.Str(required=True, validate=validate.Length(max=20))
schema["name"] = fields.Str(required=True, validate=validate.Length(max=255))

schema = generate_schema("pillar", schema)
PillarSchema = type("PillarSchema", (BaseSchema,), schema)

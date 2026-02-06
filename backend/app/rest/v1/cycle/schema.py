from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['sequence'] = fields.Int(required=True)
schema['config'] = fields.Raw(required=False, allow_none=True)

schema = generate_schema('cycle', schema)
CycleSchema = type('CycleSchema', (BaseSchema,), schema)

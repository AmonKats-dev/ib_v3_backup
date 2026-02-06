from marshmallow import fields, validate

from app.core import AuditSchema, BaseSchema, generate_schema

schema = {}
schema['code'] = fields.Str(required=True, validate=validate.Length(max=3))
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))

schema = generate_schema('unit', schema)
UnitSchema = type('UnitSchema', (AuditSchema, BaseSchema,), schema)

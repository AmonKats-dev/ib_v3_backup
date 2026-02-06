from marshmallow import fields, validate

from app.core import BaseSchema, generate_schema

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['sequence'] = fields.Int(required=True)

schema = generate_schema('phase', schema)
PhaseSchema = type('PhaseSchema', (BaseSchema,), schema)

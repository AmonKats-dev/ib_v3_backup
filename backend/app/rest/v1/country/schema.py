from marshmallow import fields, validate

from app.core import BaseSchema, generate_schema

schema = {}
schema['code'] = fields.Str(required=True, validate=validate.Length(max=3))
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))

schema = generate_schema('country', schema)
CountrySchema = type('CountrySchema', (BaseSchema,), schema)

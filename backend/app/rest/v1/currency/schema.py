from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['code'] = fields.Str(required=True, validate=validate.Length(max=3))
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['sign'] = fields.Str(
    required=False, validate=validate.Length(max=3), allow_none=True)

schema = generate_schema('currency', schema)
CurrencySchema = type('CurrencySchema', (BaseSchema,), schema)

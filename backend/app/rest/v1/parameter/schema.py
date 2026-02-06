from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['param_key'] = fields.Str(
    required=True, validate=validate.Length(max=100))
schema['param_value'] = fields.Raw(required=True)

schema = generate_schema('parameter', schema)
ParameterSchema = type('ParameterSchema', (BaseSchema,), schema)

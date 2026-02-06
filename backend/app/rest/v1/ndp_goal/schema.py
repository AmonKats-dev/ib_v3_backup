from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))

schema = generate_schema('ndp_goal', schema)
NdpGoalSchema = type('NdpGoalSchema', (BaseSchema,), schema)

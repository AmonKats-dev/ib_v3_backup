from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['ndp_outcome_id'] = fields.Int(required=True)

schema["ndp_outcome"] = fields.Nested("NdpOutcomeSchema", dump_only=True)

schema = generate_schema('ndp_strategy', schema)
NdpStrategySchema = type('NdpStrategySchema', (BaseSchema,), schema)

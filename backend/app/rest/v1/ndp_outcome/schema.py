from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['ndp_goal_id'] = fields.Int(required=True)

schema["ndp_goal"] = fields.Nested("NdpGoalSchema", dump_only=True)

schema = generate_schema('ndp_outcome', schema)
NdpOutcomeSchema = type('NdpOutcomeSchema', (BaseSchema,), schema)

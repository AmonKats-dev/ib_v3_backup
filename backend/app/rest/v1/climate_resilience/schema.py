from app.core import AdditionalSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['potential_description'] = fields.Str(required=False, allow_none=True)
schema['potential_amount'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['response_description'] = fields.Str(required=False, allow_none=True)
schema['response_amount'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['response_results'] = fields.Str(required=False, allow_none=True)
schema['response_preferred_option'] = fields.Str(
    required=False, validate=validate.Length(max=10), allow_none=True)
schema['risk_degree'] = fields.Str(required=False, allow_none=True)
schema['risk_location'] = fields.Str(required=False, allow_none=True)
schema['change_effects'] = fields.Str(required=False, allow_none=True)
schema['response_high'] = fields.Raw(required=False, allow_none=True)
schema['response_medium'] = fields.Raw(required=False, allow_none=True)
schema['response_low'] = fields.Raw(required=False, allow_none=True)

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('climate_resilience', schema)
ClimateResilienceSchema = type(
    'ClimateResilienceSchema', (BaseSchema,), schema)

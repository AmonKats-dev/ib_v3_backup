from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['baseline'] = fields.Str(
    required=True, validate=validate.Length(max=100))
schema['verification_means'] = fields.Str(required=True)
schema['risk_factors'] = fields.Str(required=False, allow_none=True)
schema['assumptions'] = fields.Str(required=False, allow_none=True)
schema['targets'] = fields.Raw(required=False, allow_none=True)

schema['entity_id'] = fields.Int(required=True)
schema['entity_type'] = fields.Str(
    required=True, validate=validate.Length(max=50))
schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('indicator', schema)
IndicatorSchema = type('IndicatorSchema', (AuditSchema, BaseSchema), schema)

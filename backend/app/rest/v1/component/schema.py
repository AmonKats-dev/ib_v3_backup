from app.constants import (EXPOSURE_RISK, OVERALL_CLIMATE_RISK,
                           VULNERABILITY_RISK)
from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}

schema['name'] = fields.Str(
    required=True, validate=validate.Length(max=255))
schema['description'] = fields.Str(required=False, allow_none=True)
schema['cost'] = fields.Str(
    required=True, validate=validate.Length(max=10))
schema['subcomponents'] = fields.Raw(required=False, allow_none=True)
schema['is_milestone'] = fields.Bool()

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('component', schema)
ComponentSchema = type(
    'ComponentSchema', (AdditionalSchema, AuditSchema, BaseSchema), schema)

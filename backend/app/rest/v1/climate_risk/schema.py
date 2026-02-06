from app.constants import (EXPOSURE_RISK, OVERALL_CLIMATE_RISK,
                           VULNERABILITY_RISK)
from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}

schema['climate_hazard'] = fields.Str(
    required=True, validate=validate.Length(max=255))
schema['climate_hazard_other'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['exposure_risk'] = fields.Str(
    required=True,  validate=validate.OneOf(EXPOSURE_RISK))
schema['vulnerability_risk'] = fields.Str(
    required=True,  validate=validate.OneOf(VULNERABILITY_RISK))
schema['overall_risk'] = fields.Str(
    required=True,  validate=validate.OneOf(OVERALL_CLIMATE_RISK))
schema['vulnerability_impact'] = fields.Str(required=False, allow_none=True)

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('climate_risk', schema)
ClimateRiskSchema = type(
    'ClimateRiskSchema', (AdditionalSchema, AuditSchema, BaseSchema), schema)

from app.constants import (RISK_MGMT_IMPACT, RISK_MGMT_PROBABILITY,
                           RISK_MGMT_SCORE)
from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}

schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['impact_level'] = fields.Str(
    required=True,  validate=validate.OneOf(RISK_MGMT_IMPACT))
schema['probability'] = fields.Str(
    required=True,  validate=validate.OneOf(RISK_MGMT_PROBABILITY))
schema['score'] = fields.Str(
    required=True,  validate=validate.OneOf(RISK_MGMT_SCORE))
schema['response'] = fields.Str(required=False)
schema['owner'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('project_risk', schema)
ProjectRiskSchema = type(
    'ProjectRiskSchema', (AdditionalSchema, AuditSchema, BaseSchema), schema)

from app.constants import RISK_IMPACT, RISK_OCCURRENCE
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField

schema = {}
schema['occurrence'] = fields.Str(
    required=True, validate=validate.OneOf(RISK_OCCURRENCE))
schema['impact'] = fields.Str(
    required=True,  validate=validate.OneOf(RISK_IMPACT))
schema['description'] = fields.String(required=False, allow_none=True)
schema['mitigation_plan'] = fields.String(required=False, allow_none=True)

schema['project_option_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('risk_evaluation', schema)
RiskEvaluationSchema = type('RiskEvaluationSchema',
                            (AuditSchema, BaseSchema), schema)

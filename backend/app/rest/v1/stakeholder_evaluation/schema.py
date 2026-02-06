from app.constants import STAKEHOLDER_BENEFICIARY, STAKEHOLDER_IMPACT_SIGN
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField

schema = {}
schema['name'] = fields.Str(
    required=True, validate=validate.Length(max=255))
schema['beneficiary'] = fields.Str(
    required=False,  validate=validate.OneOf(STAKEHOLDER_BENEFICIARY), allow_none=True)
schema['impact_sign'] = fields.Str(
    required=False,  validate=validate.OneOf(STAKEHOLDER_IMPACT_SIGN), allow_none=True)
schema['description'] = fields.String(required=False)

schema['project_option_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('stakeholder_evaluation', schema)
StakeholderEvaluationSchema = type('StakeholderEvaluationSchema',
                                   (AuditSchema, BaseSchema), schema)

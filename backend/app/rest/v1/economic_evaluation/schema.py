from app.constants import APPRAISAL_METHODOLOGY
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField

schema = {}
schema['enpv'] = fields.String(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['err'] = fields.String(
    required=False, validate=validate.Length(max=6), allow_none=True)
schema['summary'] = fields.String(required=False, allow_none=True)
schema['appraisal_methodology'] = fields.String(
    required=True, validate=validate.OneOf(APPRAISAL_METHODOLOGY))
schema['criteria'] = fields.Raw(required=False, allow_none=True)

schema['project_option_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('economic_evaluation', schema)
EconomicEvaluationSchema = type('EconomicEvaluationSchema',
                                (AuditSchema, BaseSchema), schema)

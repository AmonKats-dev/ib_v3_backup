from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['cost'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['description'] = fields.Str(required=False, allow_none=True)
schema['justification'] = fields.Str(required=False, allow_none=True)
schema['modality_justification'] = fields.Str(required=False, allow_none=True)
schema["score"] = fields.Int(required=False, allow_none=True)
schema["is_shortlisted"] = fields.Bool(required=False, allow_none=True)
schema["is_preferred"] = fields.Bool(required=False, allow_none=True)
schema['funding_modality'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['swot_analysis'] = fields.Str(required=False, allow_none=True)
schema['start_date'] = fields.Date(required=False, allow_none=True)
schema['end_date'] = fields.Date(required=False, allow_none=True)
schema['om_start_date'] = fields.Date(required=False, allow_none=True)
schema['om_end_date'] = fields.Date(required=False, allow_none=True)
schema['capital_expenditure'] = fields.Raw(required=False, allow_none=True)
schema['om_cost'] = fields.Raw(required=False, allow_none=True)

schema['value_for_money'] = fields.Str(required=False, allow_none=True)
schema['risk_allocation'] = fields.Str(required=False, allow_none=True)
schema['contract_management'] = fields.Str(required=False, allow_none=True)
schema['me_strategy'] = fields.Str(required=False, allow_none=True)

schema['project_detail_id'] = fields.Int(required=True)

schema['building_blocks'] = fields.Nested(
    'BuildingBlockSchema', dump_only=True, many=True)
schema['economic_evaluation'] = fields.Nested(
    'EconomicEvaluationSchema', dump_only=True)
schema['financial_evaluation'] = fields.Nested(
    'FinancialEvaluationSchema', dump_only=True)
schema['risk_evaluations'] = fields.Nested(
    'RiskEvaluationSchema', dump_only=True, many=True)
schema['stakeholder_evaluations'] = fields.Nested(
    'StakeholderEvaluationSchema', dump_only=True, many=True)

schema['files'] = fields.Nested('MediaSchema', dump_only=True, many=True)

schema = generate_schema('project_option', schema)
ProjectOptionSchema = type('ProjectOptionSchema',
                           (AuditSchema, BaseSchema), schema)

from app.constants import MEActivityStatus
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField

schema = {}
schema['activity_status'] = EnumField(MEActivityStatus, by_value=True)
schema['fund_source'] = fields.Str(
    default='Government of Uganda', validate=validate.OneOf(['Government of Uganda', 'Government of Jamaica', 'Donor']), allow_none=True)
schema['expected_completion_date'] = fields.Date(
    required=False, allow_none=True)
schema['challenges'] = fields.Str(required=False, allow_none=True)
schema['measures'] = fields.Str(required=False, allow_none=True)
schema['budget_appropriation'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['budget_supplemented'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['budget_allocation'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['financial_execution'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['allocation_challenges'] = fields.Str(required=False, allow_none=True)
schema['allocation_measures'] = fields.Str(required=False, allow_none=True)
schema['execution_challenges'] = fields.Str(required=False, allow_none=True)
schema['execution_measures'] = fields.Str(required=False, allow_none=True)

schema['activity_id'] = fields.Int(required=True)
schema['me_report_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema["activity"] = fields.Nested("ActivitySchema", only=(
    'id', 'name', 'output_ids', 'start_date', 'end_date', 'investments'), dump_only=True)

schema = generate_schema('me_output', schema)
MEActivitySchema = type('MEActivitySchema', (AuditSchema, BaseSchema), schema)

from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['sustainability_plan'] = fields.Str(required=False, allow_none=True)
schema['future_considerations'] = fields.Str(required=False, allow_none=True)
schema['lessons_learnt'] = fields.Str(required=False, allow_none=True)
schema['challenges_recommendations'] = fields.Str(
    required=False, allow_none=True)
schema['outcome_performance'] = fields.Raw(required=False, allow_none=True)
schema['outputs'] = fields.Raw(required=False, allow_none=True)
schema['actual_start_date'] = fields.Date(required=False, allow_none=True)
schema['actual_end_date'] = fields.Date(required=False, allow_none=True)
schema["project_id"] = fields.Integer(required=True)

schema = generate_schema('project_completion', schema)
ProjectCompletionSchema = type(
    'ProjectCompletionSchema', (AuditSchema, BaseSchema), schema)

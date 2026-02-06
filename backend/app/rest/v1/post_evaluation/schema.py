from marshmallow import fields, validate

from app.core import AuditSchema, BaseSchema, generate_schema

schema = {}
schema['evaluation_methodology'] = fields.Str(required=True)
schema['achieved_outcomes'] = fields.Str(required=True)
schema['deviation_reasons'] = fields.Str(required=True)
schema['measures'] = fields.Str(required=True)
schema['lessons_learned'] = fields.Str(required=True)

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('post_evaluation', schema)
PostEvaluationSchema = type(
    'PostEvaluationSchema', (AuditSchema, BaseSchema), schema)

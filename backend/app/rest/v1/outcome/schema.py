from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['description'] = fields.Str(required=False, allow_none=True)
schema['project_detail_id'] = fields.Int(required=True)
schema['indicators'] = fields.Nested(
    'IndicatorSchema', dump_only=True, many=True)

schema = generate_schema('outcome', schema)
OutcomeSchema = type('OutcomeSchema', (AuditSchema, BaseSchema), schema)

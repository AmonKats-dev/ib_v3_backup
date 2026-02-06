from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['output_ids'] = fields.Raw(required=True)
schema['start_date'] = fields.Date(required=True)
schema['end_date'] = fields.Date(required=True)
schema['description'] = fields.Str(required=False, allow_none=True)

schema['project_detail_id'] = fields.Int(required=True)
schema['investments'] = fields.Nested(
    'InvestmentSchema', dump_only=True, many=True)

schema = generate_schema('activity', schema)
ActivitySchema = type('ActivitySchema', (AuditSchema, BaseSchema), schema)

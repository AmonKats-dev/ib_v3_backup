from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField

schema = {}
schema['description'] = fields.Str(required=False, allow_none=True)
schema['amount'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['due_date'] = fields.Date(required=False, allow_none=True)

schema['me_report_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('me_liability', schema)
MELiabilitySchema = type(
    'MELiabilitySchema', (AuditSchema, BaseSchema), schema)

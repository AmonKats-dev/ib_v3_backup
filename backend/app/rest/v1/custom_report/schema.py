from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['is_public'] = fields.Bool()
schema['config'] = fields.Raw(required=False, allow_none=True)

schema = generate_schema('custom_report', schema)
CustomReportSchema = type('CustomReportSchema',
                          (AuditSchema, BaseSchema,), schema)

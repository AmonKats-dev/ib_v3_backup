from marshmallow import fields, validate

from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema

schema = {}
schema['project_detail_id'] = fields.Int(required=True)
schema['organization_id'] = fields.Int(required=True)

schema["organization"] = fields.Nested(
    "OrganizationSchema", dump_only=True, exclude=('children',))

schema = generate_schema('implementing_agency', schema)
ImplementingAgencySchema = type(
    'ImplementingAgencySchema', (AdditionalSchema, AuditSchema, BaseSchema), schema)

from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['project_detail_id'] = fields.Int(required=True)
schema['organization_id'] = fields.Int(required=False, allow_none=True)
schema['description'] = fields.String(required=True)

schema["organization"] = fields.Nested(
    "OrganizationSchema", dump_only=True, exclude=('children',))

schema = generate_schema('government_coordination', schema)
GovernmentCoordinationSchema = type(
    'GovernmentCoordinationSchema', (AdditionalSchema, AuditSchema, BaseSchema), schema)

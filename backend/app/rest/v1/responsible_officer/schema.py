from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['title'] = fields.Str(
    required=False, allow_none=True, validate=validate.Length(max=255))
schema['name'] = fields.Str(
    required=False, allow_none=True, validate=validate.Length(max=255))
schema['organization_name'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['address'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['phone'] = fields.Str(
    required=False, validate=validate.Length(max=15), allow_none=True)
schema['mobile_phone'] = fields.Str(
    required=False, validate=validate.Length(max=15), allow_none=True)
schema['email'] = fields.Str(
    required=False, allow_none=True, validate=validate.Length(max=100))

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('responsible_officer', schema)
ResponsibleOfficerSchema = type(
    'ResponsibleOfficerSchema', (AdditionalSchema, AuditSchema, BaseSchema), schema)

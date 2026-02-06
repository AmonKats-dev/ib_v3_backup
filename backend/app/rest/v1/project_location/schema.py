from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['location_type'] = fields.Str(
    required=False, validate=validate.Length(max=50), allow_none=True)
schema['country_name'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['administrative_post'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['location_name'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)

schema['project_detail_id'] = fields.Int(required=True)
schema['location_id'] = fields.Int(required=False, allow_none=True)

schema["location"] = fields.Nested(
    "LocationSchema", dump_only=True, exclude=('children',))

schema = generate_schema('project_location', schema)
ProjectLocationSchema = type(
    'ProjectLocationSchema', (AdditionalSchema, AuditSchema, BaseSchema), schema)

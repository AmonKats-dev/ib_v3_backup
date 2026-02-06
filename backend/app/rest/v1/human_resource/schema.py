from app.constants import INVOLVEMENT_LEVEL
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['reporting_date'] = fields.Date(required=True)
schema['reporting_quarter'] = fields.Str(
    required=False, validate=validate.Length(max=2), allow_none=True)
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['position'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['position'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['contact_details'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['involvement_level'] = fields.Str(
    required=False,  validate=validate.OneOf(INVOLVEMENT_LEVEL), allow_none=True)
schema['responsible_entity'] = fields.Str(
    required=False, validate=validate.Length(max=255))

schema["user"] = fields.Nested(
    "UserSchema", dump_only=True, only=('username', 'full_name',))

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('human_resource', schema)
HumanResourceSchema = type('HumanResourceSchema',
                           (AuditSchema, BaseSchema,), schema)

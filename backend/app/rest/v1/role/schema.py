from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['organization_level'] = fields.Int(required=False, allow_none=True)
schema['has_allowed_projects'] = fields.Bool(required=False, allow_none=True)
schema['permissions'] = fields.Raw(required=False, allow_none=True)
schema['phase_ids'] = fields.Raw(required=True)

schema['role_users'] = fields.Nested(
    "UserRoleSchema", exclude=("role", "user"), many=True, dump_only=True)

schema = generate_schema('role', schema)
RoleSchema = type('RoleSchema', (BaseSchema,), schema)

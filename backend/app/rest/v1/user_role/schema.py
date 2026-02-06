from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['user_id'] = fields.Int(required=True)
schema['role_id'] = fields.Int(required=True)
schema['allowed_organization_ids'] = fields.Raw(
    required=False, allow_none=True)
schema['allowed_project_ids'] = fields.Raw(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['is_approved'] = fields.Bool(allow_none=True)
schema['is_delegator'] = fields.Bool(allow_none=True)
schema['is_delegated'] = fields.Bool(allow_none=True)
schema['delegated_by'] = fields.Int(required=False, allow_none=True)
schema['approved_by'] = fields.Int(required=False, allow_none=True)
schema['start_date'] = fields.Date(required=False, allow_none=True)
schema['end_date'] = fields.Date(required=False, allow_none=True)

schema["user"] = fields.Nested(
    "UserSchema", dump_only=True)
schema["role"] = fields.Nested(
    "RoleSchema",  exclude=("role_users",), dump_only=True)
schema["approved"] = fields.Nested(
    "UserSchema", only=('username', 'full_name'), dump_only=True)

schema = generate_schema('user_role', schema)
UserRoleSchema = type('UserRoleSchema', (AuditSchema,
                                         AdditionalSchema, BaseSchema,), schema)

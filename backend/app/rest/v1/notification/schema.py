from app.constants import ProjectStatus
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField

schema = {}
schema['recipient_id'] = fields.Int(required=True)
schema['project_id'] = fields.Int(required=True)
schema["is_unread"] = fields.Bool(required=False, allow_none=True)
schema['project_status'] = EnumField(
    ProjectStatus, by_value=True, required=True)

schema['sender'] = fields.Nested(
    'UserSchema', dump_only=True, only=('username', 'full_name',))
schema['recipient'] = fields.Nested(
    'UserSchema', dump_only=True, only=('username', 'full_name', 'email'))
schema['project'] = fields.Nested(
    'ProjectSchema', dump_only=True, only=('id', 'name', 'phase_id'))
schema = generate_schema('notification', schema)
NotificationSchema = type('NotificationSchema',
                          (AuditSchema, BaseSchema,), schema)

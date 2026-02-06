from app.constants import ProjectStatus, messages
from app.core import AdditionalSchema, BaseSchema, generate_schema
from marshmallow import ValidationError, fields, validate
from marshmallow_enum import EnumField

schema = {}
schema["role_id"] = fields.Integer(required=True)
schema["actions"] = fields.Raw(required=False, allow_none=True)
schema["step"] = fields.Integer(required=True)
schema["status_msg"] = fields.Str(
    required=True, validate=validate.Length(max=255))
schema["revise_to_workflow_id"] = fields.Integer(
    required=False, allow_none=True)
schema["phases"] = fields.Raw(required=True)
schema["is_hidden"] = fields.Bool(required=False, allow_none=True)
schema["is_ipr"] = fields.Bool(required=False, allow_none=True)
schema['project_status'] = EnumField(ProjectStatus, by_value=True)
schema['file_type_ids'] = fields.Raw(required=False, allow_none=True)

schema['role'] = fields.Nested(
    'RoleSchema', only=('id', 'name'), dump_only=True)
schema["revised_workflow"] = fields.Nested(
    "WorkflowSchema", exclude=('revised_workflow',), dump_only=True)

schema = generate_schema("workflow", schema)
WorkflowSchema = type(
    "WorkflowSchema", (AdditionalSchema, BaseSchema,), schema)

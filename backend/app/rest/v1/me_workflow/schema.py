from app.constants import MEReportStatus, messages
from app.core import AdditionalSchema, BaseSchema, generate_schema
from marshmallow import ValidationError, fields, validate
from marshmallow_enum import EnumField

schema = {}
schema["role_id"] = fields.Integer(required=True)
schema["actions"] = fields.Raw(required=False, allow_none=True)
schema["step"] = fields.Integer(required=True)
schema["status_msg"] = fields.Str(
    required=True, validate=validate.Length(max=255))
schema["revise_to_me_workflow_id"] = fields.Integer(
    required=False, allow_none=True)
schema["is_hidden"] = fields.Bool(required=False, allow_none=True)
schema['report_status'] = EnumField(MEReportStatus, by_value=True)
schema['file_type_ids'] = fields.Raw(required=False, allow_none=True)

schema['role'] = fields.Nested(
    'RoleSchema', only=('id', 'name'), dump_only=True)
schema["revised_me_workflow"] = fields.Nested(
    "MEWorkflowSchema", exclude=('revised_me_workflow',), dump_only=True)

schema = generate_schema("me_workflow", schema)
MEWorkflowSchema = type(
    "MEWorkflowSchema", (AdditionalSchema, BaseSchema,), schema)

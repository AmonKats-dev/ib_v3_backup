import app.rest.v1.media as media
from app.constants import ProjectAction, messages
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import ValidationError, fields, validate
from marshmallow_enum import EnumField


def get_files(self, obj):
    media_schema = media.MediaService().schema(many=True)
    files = []
    for file in obj.files:
        file_created_on = file.created_on.replace(
            minute=0, second=0, microsecond=0)
        timeline_created_on = obj.created_on.replace(
            minute=0, second=0, microsecond=0)
        if not isinstance(file.meta, dict):
            file.meta = dict()
        if 'phase_id' not in file.meta:
            file.meta['phase_id'] = None
        if 'current_step' not in file.meta:
            file.meta['current_step'] = None
        if (file.meta['phase_id'] == obj.phase_id
                and file.meta['current_step'] == obj.current_step
                and file_created_on == timeline_created_on):
            files.append(file)
    return media_schema.dump(files)


schema = {}
schema["project_id"] = fields.Integer(required=True)
schema["phase_id"] = fields.Integer(required=True)
schema["workflow_id"] = fields.Integer(required=True)
schema['current_step'] = fields.Int(required=True)
schema['project_action'] = EnumField(ProjectAction, by_value=True)
schema["reason"] = fields.Str(required=False, allow_none=True)
schema['assigned_user_id'] = fields.Int(required=False, allow_none=True)

schema["phase"] = fields.Nested("PhaseSchema", dump_only=True)
schema["workflow"] = fields.Nested("WorkflowSchema", dump_only=True)
schema["user"] = fields.Nested(
    "UserSchema", dump_only=True, only=('username', 'full_name',))
schema["assigned_user"] = fields.Nested(
    "UserSchema", dump_only=True, only=('username', 'full_name',))

schema['files'] = fields.Method('get_files')
schema['get_files'] = get_files


schema = generate_schema("timeline", schema)
TimelineSchema = type("TimelineSchema", (AuditSchema, BaseSchema,), schema)

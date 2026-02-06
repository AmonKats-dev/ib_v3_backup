from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema["project_id"] = fields.Integer(required=True)
schema['task'] = fields.Raw(required=True)
schema['link'] = fields.Raw(required=False, allow_none=True)
schema['staff'] = fields.Raw(required=False, allow_none=True)

schema['project'] = fields.Nested('GanttSchema', dump_only=True)

schema = generate_schema('project_management', schema)
ProjectManagementSchema = type(
    'ProjectManagementSchema', (AuditSchema, BaseSchema), schema)

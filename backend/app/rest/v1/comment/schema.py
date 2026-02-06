from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['content'] = fields.Str(required=True)
schema['project_id'] = fields.Int(required=True)
schema["is_public"] = fields.Bool(required=False, allow_none=True)

schema = generate_schema('comment', schema)
CommentSchema = type('CommentSchema', (AuditSchema, BaseSchema,), schema)

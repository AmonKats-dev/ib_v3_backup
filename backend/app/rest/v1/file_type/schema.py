from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['is_required'] = fields.Bool(allow_none=True)
schema['phase_ids'] = fields.Raw(allow_none=True)
schema['extensions'] = fields.Raw(allow_none=True)

schema = generate_schema('file_type', schema)
FileTypeSchema = type('FileTypeSchema', (BaseSchema,), schema)

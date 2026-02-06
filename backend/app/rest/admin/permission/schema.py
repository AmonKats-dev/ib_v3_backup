from marshmallow import fields, validate

from app.core import BaseSchema


class PermissionSchema(BaseSchema):
    key = fields.Str(required=True, validate=validate.Length(max=150))
    name = fields.Str(required=True, validate=validate.Length(max=255))
    has_level = fields.Bool()

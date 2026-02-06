from marshmallow import fields, validate

from app.core import BaseSchema


class ModuleSchema(BaseSchema):
    key = fields.Str(required=True, validate=validate.Length(max=100))
    name = fields.Str(required=True, validate=validate.Length(max=255))
    icon = fields.Str(required=False, validate=validate.Length(max=100))
    show_in_menu = fields.Bool()
    module_fields = fields.Raw()
    module_options = fields.Raw()
    module_actions = fields.List(fields.String(), required=False)

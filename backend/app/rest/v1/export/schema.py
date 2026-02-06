from app.shared import ma
from marshmallow import fields, validate


class ExportSchema(ma.Schema):
    content = fields.Str(required=True)
    style = fields.Str(required=True)
    instance = fields.Str(required=False, allow_none=True)
    export_type = fields.Str(
        default='pdf', validate=validate.OneOf(['pdf', 'word']), allow_none=True)

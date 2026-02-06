from app.core import BaseSchema
from marshmallow import fields, validate


class FeatureSchema(BaseSchema):
    key = fields.Str(required=True, validate=validate.Length(max=150))
    name = fields.Str(required=True, validate=validate.Length(max=255))
    is_global = fields.Bool()

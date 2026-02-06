from app.constants import API_V1_PREFIX
from app.core import BaseSchema
from flask import request
from marshmallow import fields, validate


class MediaSchema(BaseSchema):
    title = fields.Str(required=True, validate=validate.Length(max=255))
    filename = fields.Str(validate=validate.Length(max=50), allow_none=True)
    entity_id = fields.Integer(allow_none=True)
    entity_type = fields.Str(validate=validate.Length(max=50), allow_none=True)
    meta = fields.Raw(allow_none=True)
    entity_ids = fields.Raw(allow_none=True, load_only=True)
    link = fields.Function(lambda obj: request.url_root + API_V1_PREFIX.strip("/") +
                           '/uploads/'+obj.filename, dump_only=True)

from marshmallow import fields, validate

from app.core import BaseSchema


class InstanceSchema(BaseSchema):
    key = fields.Str(required=True, validate=validate.Length(max=150))
    name = fields.Str(required=True, validate=validate.Length(max=255))
    domain = fields.Str(required=False, validate=validate.Length(max=255))
    country = fields.Str(required=False, validate=validate.Length(max=255))
    modules_config = fields.Raw()
    features_config = fields.Raw()
    organization_config = fields.Raw()
    costing_config = fields.Raw()
    fund_config = fields.Raw()
    location_config = fields.Raw()
    program_config = fields.Raw()
    workflow_config = fields.Raw()
    instance_config = fields.Raw()
    permission_config = fields.Raw()

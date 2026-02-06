from app.core import BaseSchema
from marshmallow import fields


class WorkflowInstanceSchema(BaseSchema):
    class Meta:
        fields = ('id', 'name', 'entity_type', 'organization_level', 'created_on', 'modified_on')

    name = fields.Str(required=True)
    entity_type = fields.Str(allow_none=True)
    organization_level = fields.Str(allow_none=True)

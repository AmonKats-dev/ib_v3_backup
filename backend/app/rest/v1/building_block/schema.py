from app.constants import BuildingBlockType
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField

schema = {}
schema['score'] = fields.Int(required=False, allow_none=True)
schema['description'] = fields.String(required=False, allow_none=True)
schema['advantage'] = fields.String(required=False, allow_none=True)
schema['disadvantage'] = fields.String(required=False, allow_none=True)
schema['module_type'] = EnumField(
    BuildingBlockType, required=True, by_value=True)

schema['project_option_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('building_block', schema)
BuildingBlockSchema = type('BuildingBlockSchema',
                           (AuditSchema, BaseSchema), schema)

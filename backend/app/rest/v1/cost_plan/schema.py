from app.constants import CostPlanStatus
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields
from marshmallow_enum import EnumField

schema = {}
schema['year'] = fields.Int(required=True)
schema['cost_plan_status'] = EnumField(CostPlanStatus, by_value=True)

schema["user"] = fields.Nested(
    "UserSchema", dump_only=True, only=('username', 'full_name',))
schema['cost_plan_activities'] = fields.Nested(
    'CostPlanActivitySchema', dump_only=True, many=True)
schema["cost_plan_items"] = fields.Nested(
    "CostPlanItemSchema", dump_only=True,  many=True)

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('cost_plan', schema)
CostPlanSchema = type('CostPlanSchema', (AuditSchema, BaseSchema,), schema)

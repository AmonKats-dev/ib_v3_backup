from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['amount'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)

schema['procurement_method'] = fields.Str(
    required=False, validate=validate.Length(max=50), allow_none=True)
schema['procurement_start_date'] = fields.Date(required=False, allow_none=True)
schema['contract_signed_date'] = fields.Date(required=False, allow_none=True)
schema['procurement_details'] = fields.Str(required=False, allow_none=True)

schema['fund_id'] = fields.Int(required=True)
schema['cost_plan_activity_id'] = fields.Int(required=False, allow_none=True)
schema['costing_id'] = fields.Int(required=True)
schema['cost_plan_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema["fund"] = fields.Nested("FundSchema", dump_only=True)
schema["costing"] = fields.Nested("CostingSchema", dump_only=True)


schema = generate_schema('cost_plan_item', schema)
CostPlanItemSchema = type(
    'CostPlanItemSchema', (AuditSchema, BaseSchema), schema)

from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['costs'] = fields.Raw()

schema['fund_id'] = fields.Int(required=True)
schema['costing_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema["fund"] = fields.Nested("FundSchema", dump_only=True)
schema["costing"] = fields.Nested("CostingSchema", dump_only=True)

schema = generate_schema('om_cost', schema)
OmCostSchema = type('OmCostSchema', (AuditSchema, BaseSchema), schema)

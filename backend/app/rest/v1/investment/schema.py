from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['costs'] = fields.Raw()

schema['activity_id'] = fields.Int(required=True)
schema['fund_id'] = fields.Int(required=True)
schema['costing_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)
schema['currency_rate_id'] = fields.Int(required=False, allow_none=True)
schema['fund_body_type'] = fields.Int(required=False, allow_none=True)
schema['financial_pattern_type'] = fields.Int(required=False, allow_none=True)
schema['financial_pattern_subtype'] = fields.Int(
    required=False, allow_none=True)

schema["fund"] = fields.Nested("FundSchema", dump_only=True)
schema["costing"] = fields.Nested("CostingSchema", dump_only=True)
schema["currency_rate"] = fields.Nested("CurrencyRateSchema", dump_only=True)

schema = generate_schema('investment', schema)
InvestmentSchema = type('InvestmentSchema', (AuditSchema, BaseSchema), schema)

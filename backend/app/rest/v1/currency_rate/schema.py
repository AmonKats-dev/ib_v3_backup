from marshmallow import fields, validate

from app.core import AuditSchema, BaseSchema, generate_schema

schema = {}
schema['rate'] = fields.String(required=True, validate=validate.Length(max=10))
schema['currency_id'] = fields.Int(required=True)

schema["currency"] = fields.Nested("CurrencySchema", dump_only=True)
schema = generate_schema('currency_rate', schema)
CurrencyRateSchema = type('CurrencyRateSchema',
                          (AuditSchema, BaseSchema,), schema)

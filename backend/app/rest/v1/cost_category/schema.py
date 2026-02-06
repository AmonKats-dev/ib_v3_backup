from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema["code"] = fields.Str(required=True, validate=validate.Length(max=20))
schema["name"] = fields.Str(required=True, validate=validate.Length(max=255))
schema["expenditure_type"] = fields.Str(required=False, validate=validate.Length(max=50), allow_none=True)
schema["additional_data"] = fields.Raw(required=False, allow_none=True)

schema = generate_schema("cost_category", schema)
CostCategorySchema = type("CostCategorySchema", (BaseSchema,), schema)


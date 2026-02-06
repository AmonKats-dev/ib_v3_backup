from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema["code"] = fields.Str(required=True, validate=validate.Length(max=20))
schema["name"] = fields.Str(required=True, validate=validate.Length(max=255))
schema["cost_category_id"] = fields.Integer(required=False, allow_none=True)
schema["cost_category"] = fields.Nested(
    "CostCategorySchema", dump_only=True, allow_none=True)
schema["additional_data"] = fields.Raw(required=False, allow_none=True)

schema = generate_schema("cost_classification", schema)
CostClassificationSchema = type("CostClassificationSchema", (BaseSchema,), schema)


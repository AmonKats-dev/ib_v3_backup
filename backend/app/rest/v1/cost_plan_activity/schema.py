from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['output_ids'] = fields.Raw(required=True)
schema['start_date'] = fields.Date(required=True)
schema['end_date'] = fields.Date(required=True)
schema['description'] = fields.Str(required=False, allow_none=True)


schema['activity_id'] = fields.Int(required=False, allow_none=True)
schema['cost_plan_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema["activity"] = fields.Nested("ActivitySchema", only=(
    'id', 'name', 'output_ids', 'start_date', 'end_date', 'investments'), dump_only=True)

schema = generate_schema('cost_plan_activity', schema)
CostPlanActivitySchema = type('CostPlanActivitySchema',
                              (AuditSchema, BaseSchema), schema)

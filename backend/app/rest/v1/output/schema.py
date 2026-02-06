from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['output_value'] = fields.Str(
    required=False, allow_none=True, validate=validate.Length(max=20))
schema['outcome_ids'] = fields.Raw(required=True)
schema['organization_ids'] = fields.Raw(required=True)
schema['investments'] = fields.Raw(required=False, allow_none=True)
schema['description'] = fields.Str(required=False, allow_none=True)
schema['tech_specs'] = fields.Str(required=False, allow_none=True)
schema['alternative_specs'] = fields.Str(required=False, allow_none=True)
schema['component_ids'] = fields.Raw(required=False, allow_none=True)

schema['ndp_strategy_id'] = fields.Int(required=False, allow_none=True)
schema['unit_id'] = fields.Int(required=False, allow_none=True)
schema['project_detail_id'] = fields.Int(required=True)

schema["ndp_strategy"] = fields.Nested("NdpStrategySchema", dump_only=True)
schema["unit"] = fields.Nested("UnitSchema", dump_only=True)
schema['indicators'] = fields.Nested(
    'IndicatorSchema', dump_only=True, many=True)

schema = generate_schema('output', schema)
OutputSchema = type('OutputSchema', (AuditSchema, BaseSchema), schema)

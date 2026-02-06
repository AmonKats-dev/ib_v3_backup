from app.constants import (EXPOSURE_RISK, OVERALL_CLIMATE_RISK,
                           VULNERABILITY_RISK)
from app.core import AdditionalSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}

schema['plan'] = fields.Str(required=False, allow_none=True)
schema['objective_reference'] = fields.Str(required=False, allow_none=True)
schema['explanation'] = fields.Str(required=False, allow_none=True)

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('strategic_alignment', schema)
StrategicAlignmentSchema = type(
    'StrategicAlignmentSchema', (AdditionalSchema,  BaseSchema), schema)

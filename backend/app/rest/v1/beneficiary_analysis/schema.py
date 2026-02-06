from app.constants import (EXPOSURE_RISK, OVERALL_CLIMATE_RISK,
                           VULNERABILITY_RISK)
from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}


schema['population'] = fields.Int(required=False, allow_none=True)
schema['year'] = fields.Int(required=False, allow_none=True)
schema['population_in_poverty'] = fields.Int(required=False, allow_none=True)
schema['poverty_year'] = fields.Int(required=False, allow_none=True)
schema['composition'] = fields.Int(required=False, allow_none=True)
schema['male'] = fields.Int(required=False, allow_none=True)
schema['female'] = fields.Int(required=False, allow_none=True)
schema['children'] = fields.Int(required=False, allow_none=True)
schema['youth'] = fields.Int(required=False, allow_none=True)
schema['adults'] = fields.Int(required=False, allow_none=True)
schema['elderly'] = fields.Int(required=False, allow_none=True)
schema['extreme_poverty'] = fields.Int(required=False, allow_none=True)
schema['poor'] = fields.Int(required=False, allow_none=True)
schema['not_poor'] = fields.Int(required=False, allow_none=True)
schema['location'] = fields.Str(required=False, allow_none=True)
schema['other_aspects'] = fields.Str(required=False, allow_none=True)

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('beneficiary_analysis', schema)
BeneficiaryAnalysisSchema = type(
    'BeneficiaryAnalysisSchema', (AdditionalSchema, AuditSchema, BaseSchema), schema)

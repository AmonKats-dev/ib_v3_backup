from app.core import BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['start_date'] = fields.Date(required=False)
schema['end_date'] = fields.Date(required=False)
schema['summary'] = fields.Str(required=False, allow_none=True)
schema['pillar'] = fields.Str(required=False, allow_none=True)
schema['strategic_objective'] = fields.Str(required=False, allow_none=True)
schema['area_sectoral'] = fields.Str(required=False, allow_none=True)
schema['project_status'] = fields.Str(required=False, allow_none=True)

schema['project_id'] = fields.Int(required=False)

schema['project'] = fields.Nested(
    'ProjectSchema', only=('name', 'function', 'function_id', 'program', 'program_id', 'project_type', 'classification'), dump_only=True)

schema = generate_schema('donor_project', schema)
DonorProjectSchema = type('DonorProjectSchema', (BaseSchema,), schema)

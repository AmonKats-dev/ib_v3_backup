from app.constants import INFLUENCE_LEVEL, INTEREST_LEVEL
from app.core import AdditionalSchema, AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['responsibilities'] = fields.Str(required=True)

schema['interest_level'] = fields.Str(
    required=False,  validate=validate.OneOf(INTEREST_LEVEL), allow_none=True)
schema['influence_level'] = fields.Str(
    required=False,  validate=validate.OneOf(INFLUENCE_LEVEL), allow_none=True)
schema['communication_channel'] = fields.Str(required=False, allow_none=True)
schema['engagement_frequency'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['responsible_entity'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('stakeholder', schema)
StakeholderSchema = type(
    'StakeholderSchema', (AdditionalSchema, AuditSchema, BaseSchema), schema)

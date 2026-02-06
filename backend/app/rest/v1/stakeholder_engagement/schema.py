from app.constants import ENGAGEMENT_LEVEL, INFLUENCE_LEVEL, INTEREST_LEVEL
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['reporting_date'] = fields.Date(required=True)
schema['reporting_quarter'] = fields.Str(
    required=False, validate=validate.Length(max=2), allow_none=True)
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
schema['responsibilities'] = fields.Str(required=False, allow_none=True)
schema['interest_level'] = fields.Str(
    required=False,  validate=validate.OneOf(INTEREST_LEVEL), allow_none=True)
schema['influence_level'] = fields.Str(
    required=False,  validate=validate.OneOf(INFLUENCE_LEVEL), allow_none=True)
schema['engagement_status'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['engagement_level'] = fields.Str(
    required=False,  validate=validate.OneOf(ENGAGEMENT_LEVEL), allow_none=True)
schema['engagement_frequency'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['communication_channel'] = fields.Str(required=False, allow_none=True)
schema['issues'] = fields.Str(required=False, allow_none=True)
schema['mitigation_plan'] = fields.Str(required=False, allow_none=True)
schema['responsible_entity'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)

schema["user"] = fields.Nested(
    "UserSchema", dump_only=True, only=('username', 'full_name',))

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('stakeholder_engagement', schema)
StakeholderEngagementSchema = type('StakeholderEngagementSchema',
                                   (AuditSchema, BaseSchema,), schema)

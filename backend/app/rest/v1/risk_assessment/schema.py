from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate

schema = {}
schema['reporting_date'] = fields.Date(required=True)
schema['reporting_quarter'] = fields.Str(
    required=False, validate=validate.Length(max=2), allow_none=True)
schema['description'] = fields.Str(required=False, allow_none=True)
schema['impact'] = fields.Str(
    required=False, validate=validate.Length(max=255))
schema['occurrence'] = fields.Str(
    required=False, validate=validate.Length(max=255))
schema['score'] = fields.Int(required=True)
schema['mitigation_plan'] = fields.Str(required=False, allow_none=True)
schema['responsible_entity'] = fields.Str(
    required=False, validate=validate.Length(max=255))

schema["user"] = fields.Nested(
    "UserSchema", dump_only=True, only=('username', 'full_name',))

schema['project_detail_id'] = fields.Int(required=True)

schema = generate_schema('risk_assessment', schema)
RiskAssessmentSchema = type('RiskAssessmentSchema',
                            (AuditSchema, BaseSchema,), schema)

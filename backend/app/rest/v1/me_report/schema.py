from app.constants import MEReportAction, MEReportStatus
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField


class ActionSchema(BaseSchema):
    action = EnumField(MEReportAction, required=True)
    reason = fields.Str(required=False, allow_none=True)


schema = {}
schema['quarter'] = fields.Str(
    required=False, validate=validate.Length(max=2), allow_none=True)
schema['year'] = fields.Int(required=True)
schema['start_date'] = fields.Date(required=False, allow_none=True)
schema['end_date'] = fields.Date(required=False, allow_none=True)
schema['effectiveness_date'] = fields.Date(required=False, allow_none=True)
schema['financing_agreement_date'] = fields.Date(
    required=False, allow_none=True)
schema['signed_date'] = fields.Date(required=False, allow_none=True)
schema['me_type'] = fields.Str(
    required=True, validate=validate.Length(max=255))
schema['data_collection_type'] = fields.Str(
    required=True, validate=validate.Length(max=255))
schema['report_status'] = EnumField(MEReportStatus, by_value=True)
schema['effectiveness_date'] = fields.Date(required=False, allow_none=True)
schema['disbursement'] = fields.Str(required=False, allow_none=True)
schema['issues'] = fields.Raw(required=False, allow_none=True)
schema['challenges'] = fields.Str(required=False, allow_none=True)
schema['summary'] = fields.Str(required=False, allow_none=True)
schema['rational_study'] = fields.Str(required=False, allow_none=True)
schema['methodology'] = fields.Str(required=False, allow_none=True)
schema['recommendations'] = fields.Str(required=False, allow_none=True)
schema['lessons_learned'] = fields.Str(required=False, allow_none=True)
schema['frequency'] = fields.Str(
    required=True,  validate=validate.OneOf(['ANNUAL', 'CUSTOM']))


schema['me_workflow_id'] = fields.Int(required=True)
schema['current_step'] = fields.Int(required=True)
schema['max_step'] = fields.Int(required=True)

schema["user"] = fields.Nested(
    "UserSchema", dump_only=True, only=('username', 'full_name',))
schema['me_outputs'] = fields.Nested(
    'MEOutputSchema', dump_only=True, many=True)
schema['me_activities'] = fields.Nested(
    'MEActivitySchema', dump_only=True, many=True)
schema["me_workflow"] = fields.Nested("MEWorkflowSchema", dump_only=True)
schema["me_liabilities"] = fields.Nested(
    "MELiabilitySchema", dump_only=True, many=True)

schema['project_detail_id'] = fields.Int(required=True)
schema['files'] = fields.Nested('MediaSchema', dump_only=True, many=True)

schema = generate_schema('me_report', schema)
MEReportSchema = type('MEReportSchema', (AuditSchema, BaseSchema,), schema)

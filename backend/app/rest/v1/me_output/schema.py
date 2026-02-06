from app.constants import MEOutputStatus
from app.core import AuditSchema, BaseSchema, generate_schema
from marshmallow import fields, validate
from marshmallow_enum import EnumField

schema = {}
schema['output_status'] = EnumField(MEOutputStatus, by_value=True)
schema['output_progress'] = fields.Int(required=True)
schema['indicators'] = fields.Raw(required=True)
schema['risk_description'] = fields.Str(required=False, allow_none=True)
schema['risk_response'] = fields.Str(required=False, allow_none=True)
schema['challenges'] = fields.Str(required=False, allow_none=True)
schema['output_id'] = fields.Int(required=True)
schema['me_report_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)

schema["output"] = fields.Nested("OutputSchema",
                                 only=('id', 'name', 'description', 'indicators.id',
                                       'indicators.name'),
                                 dump_only=True)

schema = generate_schema('me_output', schema)
MEOutputSchema = type('MEOutputSchema', (AuditSchema, BaseSchema), schema)

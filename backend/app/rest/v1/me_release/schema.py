from marshmallow import fields, validate
from marshmallow_enum import EnumField

from app.constants import MEReleaseType
from app.core import AuditSchema, BaseSchema, generate_schema

schema = {}
schema['release_type'] = EnumField(MEReleaseType, by_value=True)
schema['government_funded'] = fields.Raw(required=True)
schema['donor_funded'] = fields.Raw(required=True)

schema['me_report_id'] = fields.Int(required=True)
schema['project_detail_id'] = fields.Int(required=True)


schema = generate_schema('me_release', schema)
MEReleaseSchema = type('MEReleaseSchema', (AuditSchema, BaseSchema), schema)

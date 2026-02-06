from app.constants import ProjectStatus
from app.core import AuditSchema, BaseSchema
from app.shared import ma
from marshmallow import fields, validate
from marshmallow_enum import EnumField


class ShortProjectSchema(AuditSchema, BaseSchema):
    code = fields.Str(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(max=255))


class DetailedProjectSchema(AuditSchema, BaseSchema):
    code = fields.Str(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(max=255))
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    organization_id = fields.Int(required=True)
    project_organization = fields.Nested(
        "OrganizationSchema", dump_only=True)
    current_project_detail = fields.Nested("ProjectDetailSchema",
                                           only=('summary', 'pillar', 'strategic_alignments'))


class DetailedPbsProjectSchema(AuditSchema, BaseSchema):
    code = fields.Str(dump_only=True)
    name = fields.Str(dump_only=True)
    ndp_pip_code = fields.Str(dump_only=True)
    project_status = EnumField(ProjectStatus, by_value=True)
    start_date = fields.Date(dump_only=True)
    end_date = fields.Date(dump_only=True)
    organization_id = fields.Int(dump_only=True)
    phase = fields.Nested("PhaseSchema", dump_only=True)
    function = fields.Nested("FunctionSchema", only=(
        "code", "name"), dump_only=True)
    program = fields.Nested("ProgramSchema", only=(
        "code", "name"), dump_only=True)
    project_organization = fields.Nested("OrganizationSchema")
    current_project_detail = fields.Nested("ProjectDetailSchema",
                                           only=('summary', 'locations', 'ndp_type', 'goal', 'goal_description', 'project_goal', 'investment_stats', 'ndp_number', 'ndp_name', 'responsible_officers', 'outputs', 'activities'), exclude=["activities.investments", "outputs.investments"])


class IntegrationSyncSchema(AuditSchema, BaseSchema):
    system = fields.Str(
        required=True, validate=validate.Length(max=50))
    status = fields.Str(
        required=True, validate=validate.Length(max=10))
    records_synced = fields.Integer(required=True)


class IntegrationNdpProjectSchema(BaseSchema):
    ndp_pip_code = fields.Str(required=True, validate=validate.Length(max=20))
    program_code = fields.Str(validate=validate.Length(max=6), allow_none=True)
    project_name = fields.Str(required=True)
    implementation_status = fields.Str(
        validate=validate.Length(max=20), allow_none=True)
    planned_start_date = fields.Date(allow_none=True)
    planned_end_date = fields.Date(allow_none=True)
    description = fields.Str(required=False, allow_none=True)
    total_cost = fields.Str(validate=validate.Length(max=20), allow_none=True)

    project_id = fields.Integer(required=False, allow_none=True)
    integration_sync_id = fields.Integer(required=True)


class IntegrationPbsProjectSchema(BaseSchema):
    project_coa_code = fields.Str(
        required=True, validate=validate.Length(max=4))
    project_name = fields.Str(required=True, validate=validate.Length(max=255))
    project_status = fields.Str(
        validate=validate.Length(max=15), allow_none=True)
    vote_code = fields.Str(required=True, validate=validate.Length(max=10))
    vote_name = fields.Str(required=True, validate=validate.Length(max=255))
    program_code = fields.Str(required=True, validate=validate.Length(max=10))
    program_name = fields.Str(required=True, validate=validate.Length(max=255))
    subprogram_code = fields.Str(
        required=True, validate=validate.Length(max=10))
    subprogram_name = fields.Str(
        required=True, validate=validate.Length(max=255))

    project_id = fields.Integer(required=False)
    integration_sync_id = fields.Integer(required=True)


class IntegrationAmpSchema(BaseSchema):
    project_coa_code = fields.Str(
        required=True, validate=validate.Length(max=4))
    project_title = fields.Str(
        required=True, validate=validate.Length(max=255))
    project_status = fields.Str(
        validate=validate.Length(max=15), allow_none=True)
    agreement_title = fields.Str(
        validate=validate.Length(max=255), allow_none=True)
    agreement_sign_date = fields.Date(allow_none=True)
    agreement_effective_date = fields.Date(allow_none=True)
    agreement_close_date = fields.Date(allow_none=True)
    donor = fields.Str(required=True, validate=validate.Length(max=255))
    donor_commitment_date = fields.Date(allow_none=True)
    financing_instrument = fields.Str(
        validate=validate.Length(max=255), allow_none=True)
    executing_agency = fields.Str(
        validate=validate.Length(max=255), allow_none=True)
    implementing_agency = fields.Str(
        validate=validate.Length(max=255), allow_none=True)
    planned_commitment_amount = fields.Float(allow_none=True)
    actual_commitment_amount = fields.Float(allow_none=True)
    actual_disbursement_amount = fields.Float(allow_none=True)

    project_id = fields.Integer(required=True)
    integration_sync_id = fields.Integer(required=True)

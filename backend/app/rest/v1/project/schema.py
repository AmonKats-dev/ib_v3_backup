from app.constants import ALL, ProjectAction, ProjectStatus
from app.core import (ArchiveSchema, AuditSchema, BaseSchema, feature,
                      generate_schema)
from app.utils import get_all_parents
from marshmallow import fields, validate
from marshmallow_enum import EnumField

from ..user import UserService
from ..workflow import WorkflowService


class ActionSchema(BaseSchema):
    action = EnumField(ProjectAction, required=True)
    reason = fields.Str(required=False, allow_none=True)
    issues = fields.Str(required=False, allow_none=True)
    recommendations = fields.Str(required=False, allow_none=True)
    assigned_user_id = fields.Integer(required=False, allow_none=True)


class GanttSchema(BaseSchema):
    current_project_detail = fields.Nested("ProjectDetailSchema",
                                           only=('start_date', 'end_date',
                                                 'outputs.id', 'outputs.name', 'activities.id',
                                                 'activities.name', 'activities.output_ids',
                                                 'activities.start_date', 'activities.end_date',
                                                 'activities.investments'))


def get_assignable_users(self, obj):
    assignable_users = []
    users = []
    user_service = UserService()
    workflow_service = WorkflowService()
    user_schema = user_service.schema(
        many=True, only=('id', 'username', 'full_name'))
    if obj.workflow is not None:
        was_revised_by_ipr = False
        if obj.additional_data and 'was_revised_by_ipr' in obj.additional_data:
            was_revised_by_ipr = True
        next_workflow = workflow_service.get_next_step(
            obj.workflow.step, obj.phase_id, was_revised_by_ipr)

        if next_workflow is not None and ProjectAction.ASSIGN.value in obj.workflow.actions:
            supervisor_id = None
            if feature.is_active('is_assignment_by_supervisor'):
                supervisor_id = obj.assigned_user_id
            users = user_service.get_assignable_users(
                next_workflow['role_id'], supervisor_id)
            if feature.is_active('irp_responsible_sectors_only'):
                organizations = get_all_parents(obj.project_organization)
                organizations = [
                    organization.id for organization in organizations]
                for user in users:
                    for item in user['user_roles']:
                        if item['allowed_organization_ids'] and item['role_id'] == next_workflow['role_id']:
                            if (not set(item['allowed_organization_ids']).isdisjoint(organizations) or
                                    ALL in item['allowed_organization_ids']):
                                assignable_users.append(user)
                return user_schema.dump(assignable_users)
    return user_schema.dump(users)


schema = {}
schema['code'] = fields.Str(dump_only=True)
schema['name'] = fields.Str(required=True, validate=validate.Length(max=255))
# Map 'classification' field from frontend to 'project_type' database column
# 'classification' is used for input/output from frontend
schema['classification'] = fields.Str(
    attribute='project_type',
    required=False, validate=validate.Length(max=50), allow_none=True)
# Keep 'project_type' as dump_only for backwards compatibility with existing code
schema['project_type'] = fields.Str(
    dump_only=True, validate=validate.Length(max=50), allow_none=True)
schema['project_status'] = EnumField(
    ProjectStatus, by_value=True, allow_none=True)
schema['phase_id'] = fields.Int(required=True)
schema['current_project_detail'] = fields.Nested(
    "ProjectDetailSchema", only=('id',))
schema['organization_id'] = fields.Int(required=True)
schema['program_id'] = fields.Int(required=True)
schema['function_id'] = fields.Int(required=False, allow_none=True)
schema['workflow_id'] = fields.Int(required=True)
schema['current_step'] = fields.Int(required=True)
schema['max_step'] = fields.Int(required=True)
schema['is_donor_funded'] = fields.Bool(required=False, allow_none=True)
schema['fund_ids'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['revised_user_role_id'] = fields.Int(required=False, allow_none=True)
schema['assigned_user_id'] = fields.Int(required=False, allow_none=True)
schema['start_date'] = fields.Date(required=True)
schema['end_date'] = fields.Date(required=True)
schema['submission_date'] = fields.Date(required=False, allow_none=True)
schema['ndp_pip_code'] = fields.Str(
    validate=validate.Length(max=20), allow_none=True)
schema['budget_code'] = fields.Str(
    validate=validate.Length(max=100), allow_none=True)
schema['budget_allocation'] = fields.Raw(required=False, allow_none=True)
schema['signed_date'] = fields.Date(required=False, allow_none=True)
# Keep project_classification field for backwards compatibility
schema['project_classification'] = fields.Str(
    required=False, validate=validate.Length(max=50), allow_none=True)
schema['is_framework_updated'] = fields.Bool(required=False, allow_none=True)

schema["user"] = fields.Nested(
    "UserSchema", dump_only=True, only=('username', 'full_name', 'phone', 'email',))
schema["phase"] = fields.Nested("PhaseSchema", dump_only=True)
schema["project_organization"] = fields.Nested(
    "OrganizationSchema", dump_only=True)
schema["program"] = fields.Nested("ProgramSchema", dump_only=True)
schema["function"] = fields.Nested("FunctionSchema", dump_only=True)
schema["workflow"] = fields.Nested("WorkflowSchema", dump_only=True)
schema["revised_user_role"] = fields.Nested("UserRoleSchema", dump_only=True)
schema["current_timeline"] = fields.Nested(
    "TimelineSchema", dump_only=True, only=('created_on', 'project_action'))
schema["project_management"] = fields.Nested(
    "ProjectManagementSchema", only=('id',), dump_only=True)
schema["project_completion"] = fields.Nested(
    "ProjectCompletionSchema", dump_only=True)

schema['assignable_users'] = fields.Method('get_assignable_users')
schema['get_assignable_users'] = get_assignable_users

schema["myc_data"] = fields.Raw(required=False, allow_none=True)
schema["ranking_data"] = fields.Raw(required=False, allow_none=True)
schema['ranking_score'] = fields.Int(required=False, allow_none=True)
schema["additional_data"] = fields.Raw(required=False, allow_none=True)

schema = generate_schema('project', schema)
ProjectSchema = type('ProjectSchema', (ArchiveSchema,
                                       AuditSchema, BaseSchema), schema)

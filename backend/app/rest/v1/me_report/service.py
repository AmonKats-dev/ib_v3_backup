from app.constants import FULL_ACCESS, MEReportAction, MEReportStatus, messages
from app.core import BaseService
from app.core.cerberus import check_permission, has_permission
from app.signals import me_report_updated
from app.utils import validate_schema
from flask_jwt_extended import get_jwt_identity
from flask_restful import abort

from ..me_workflow import MEWorkflowService
from ..project_detail import ProjectDetailService
from .model import MEReport
from .resource import MEReportActionView, MEReportList, MEReportView
from .schema import ActionSchema, MEReportSchema


class MEReportService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = MEReport
        self.schema = MEReportSchema
        self.action_schema = ActionSchema
        self.resources = [
            {'resource': MEReportList, 'url': '/me-reports'},
            {'resource': MEReportActionView,
                'url': '/me-reports/<int:record_id>/actions'},
            {'resource': MEReportView,
                'url': '/me-reports/<int:record_id>'}
        ]

    def get_all(self, args, filters=dict()):
        if filters is None:
            filters = []
        if 'project_detail_id' in filters:
            project_detail = ProjectDetailService().get_one(
                filters['project_detail_id'])
            if project_detail is not None:
                return super().get_all(args, filters=filters)

        abort(404, message=messages.NOT_FOUND)

    def get_one(self, record_id):
        record = super().get_one(record_id)
        if record is not None:
            if self._check_project_access(record['project_detail_id']):
                return record
        abort(404, message=messages.NOT_FOUND)

    def create(self, data):
        schema = self.schema()
        workflow = MEWorkflowService().get_first_me_workflow()
        if workflow is not None:
            data['me_workflow_id'] = workflow['id']
            data['current_step'] = workflow['step']
            data['max_step'] = workflow['step']
        validated_data = validate_schema(data, schema)
        if validated_data:
            if self._check_project_access(validated_data['project_detail_id']):
                record = self.model.create(**validated_data)
                result = schema.dump(record)
                me_report_updated.send(me_report=result, **data)
                return result
            abort(404, message=messages.NOT_FOUND)

    def update(self, record_id, data, partial=False):
        schema = self.schema()
        validated_data = validate_schema(data, schema, partial=partial)
        if validated_data:
            record = self.model.get_one(record_id)
            if record is not None:
                if self._check_project_access(record.project_detail_id):
                    record = record.update(**validated_data)
                    result = schema.dump(record)
                    me_report_updated.send(me_report=result, **data)
                    return result
            abort(404, message=messages.NOT_FOUND)

    @check_permission('submit_me_report')
    def submit_me_report(self, me_report, reason=None):
        workflow_service = MEWorkflowService()
        next_workflow = workflow_service.get_next_step(
            me_report['me_workflow']['step'])
        if next_workflow is not None:
            data = {'action': MEReportAction.SUBMIT,
                    'me_workflow_id': next_workflow['id'],
                    'current_step': next_workflow['step'],
                    'report_status': MEReportStatus.SUBMITTED}
            if reason is not None:
                data['reason'] = reason
            me_report = self.update(me_report['id'], data, partial=True)
            return me_report

    @check_permission('approve_me_report')
    def approve_me_report(self, me_report, reason=None):
        workflow_service = MEWorkflowService()
        data = {'action': MEReportAction.APPROVE}
        if reason is not None:
            data['reason'] = reason
        next_workflow = workflow_service.get_next_step(
            me_report['me_workflow']['step'])

        if next_workflow is not None:
            data['me_workflow_id'] = next_workflow['id']
            data['current_step'] = next_workflow['step']
            data['report_status'] = next_workflow['report_status']
            me_report = self.update(me_report['id'], data, partial=True)
            return me_report
        else:
            data['report_status'] = MEReportStatus.COMPLETED.value
            me_report = self.update(me_report['id'], data, partial=True)
            return me_report

    @check_permission('revise_me_report')
    def revise_me_report(self, me_report, reason=None):
        current_workflow = me_report['me_workflow']
        revised_workflow = current_workflow['revised_me_workflow']
        user = get_jwt_identity()
        data = {'action': MEReportAction.REVISE,
                'report_status': MEReportStatus.REVISED,
                'me_workflow_id': current_workflow['revise_to_me_workflow_id'],
                'current_step': revised_workflow['step']}
        if reason is not None:
            data['reason'] = reason
        me_report = self.update(me_report['id'], data, partial=True)
        return me_report

    def manage_actions(self, me_report_id, data):
        action_schema = self.action_schema()
        validated_data = validate_schema(data, action_schema)
        reason = None
        if validated_data:
            if 'reason' in validated_data:
                reason = validated_data['reason']
            record = self.model.get_one(me_report_id)
            if record is None:
                abort(404, message=messages.NOT_FOUND)
            me_report = self.schema().dump(record)
            if me_report['report_status'] == MEReportStatus.COMPLETED.value:
                abort(422, message=messages.COMPLETED_ME_REPORT_ERROR)
            if self._validate_action(me_report, validated_data['action']):
                if validated_data['action'] == MEReportAction.SUBMIT:
                    return self.submit_me_report(me_report, reason)
                elif (validated_data['action'] == MEReportAction.APPROVE):
                    return self.approve_me_report(me_report, reason)
                elif validated_data['action'] == MEReportAction.REVISE:
                    return self.revise_me_report(me_report, reason)
            else:
                abort(403)

    def _validate_action(self, me_report, action):
        if (action.value in me_report['me_workflow']['actions']):
            user = get_jwt_identity()
            if has_permission(FULL_ACCESS):
                return True
            if user["current_role"]["role_id"] == me_report['me_workflow']['role_id']:
                return True
        return False

    def _check_project_access(self, project_id):
        project_detail = ProjectDetailService().model.get_one(project_id)
        return True if project_detail is not None else False

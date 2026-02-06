from app.core import BaseService, feature
from app.signals import user_created

from .model import Workflow
from .resource import WorkflowList, WorkflowView
from .schema import WorkflowSchema


class WorkflowService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Workflow
        self.schema = WorkflowSchema
        self.resources = [
            {'resource': WorkflowList, 'url': '/workflows'},
            {'resource': WorkflowView, 'url': '/workflows/<int:record_id>'}
        ]

    def get_last_workflow_by_phase(self):
        workflows = self.model.get_list(sort_field='step', sort_order='DESC')
        workflows = self.schema(many=True).dump(workflows)
        post_evaluation_feature = feature.is_active(
            'enable_post_evaluation_phase')
        for workflow in workflows:
            if post_evaluation_feature and post_evaluation_feature['step'] == workflow['step']:
                workflow['post_evaluation'] = True
            return workflow

    def get_first_workflow_by_phase(self, phase_id):
        workflows = self.model.get_list(sort_field='step')
        workflows = self.schema(many=True).dump(workflows)
        for workflow in workflows:
            if phase_id in workflow['phases']:
                return workflow

    def get_first_workflow_id_by_phase(self, phase_id):
        init_workflow = self.get_first_workflow_by_phase(phase_id)
        return init_workflow['id'] if init_workflow is not None else None

    def _get_skip_if_revised_flag(self, additional_data):
        if additional_data and 'skip_if_revised' in additional_data:
            return additional_data['skip_if_revised']
        return False

    def _get_conditional_workflow(self, additional_data):
        if additional_data and 'skip_if_approved' in additional_data:
            return additional_data['skip_if_approved']
        return False

    def _get_next_step_in_phase(self, current_step, phase_id, was_revised, was_approved):
        workflows = self.model.get_list(
            sort_field='step', filter={'is_hidden': False})
        workflows = self.schema(many=True).dump(workflows)
        for workflow in workflows:
            if workflow['step'] > current_step and phase_id in workflow['phases']:
                skip_if_revised = self._get_skip_if_revised_flag(
                    workflow['additional_data'])
                if was_revised and skip_if_revised:
                    continue
                conditional_workflow = self._get_conditional_workflow(
                    workflow['additional_data'])
                if not was_approved and conditional_workflow:
                    continue
                return workflow

        return None

    def get_prev_step_in_phase(self, current_step, phase_id):
        workflows = self.model.get_list(
            sort_field='step', sort_order='DESC', filter={'is_hidden': False})
        workflows = self.schema(many=True).dump(workflows)
        for workflow in workflows:
            if workflow['step'] < current_step and phase_id in workflow['phases']:
                return workflow
        return None

    def get_next_step(self, current_step, phase_id, was_revised=False, was_approved=False):
        return self._get_next_step_in_phase(current_step, phase_id, was_revised, was_approved)

    def get_role_workflows(self, role_id):
        workflows = self.model.get_list(
            per_page=-1, sort_field='step', filter={'role_id': role_id})
        return self.schema(many=True).dump(workflows)

    def get_role_first_workflow(self, role_id):
        workflows = self.model.get_list(
            per_page=1, sort_field='step', filter={'role_id': role_id})
        return workflows[0] if len(workflows) > 0 else None

from app.core import BaseService, feature
from app.signals import user_created

from .model import MEWorkflow
from .resource import MEWorkflowList, MEWorkflowView
from .schema import MEWorkflowSchema


class MEWorkflowService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = MEWorkflow
        self.schema = MEWorkflowSchema
        self.resources = [
            {'resource': MEWorkflowList, 'url': '/me-workflows'},
            {'resource': MEWorkflowView, 'url': '/me-workflows/<int:record_id>'}
        ]

    def get_last_me_workflow(self):
        me_workflows = self.model.get_list(
            sort_field='step', sort_order='DESC', page=1, per_page=1)
        me_workflows = self.schema(many=True).dump(me_workflows)
        for me_workflow in me_workflows:
            return me_workflow

    def get_first_me_workflow(self):
        me_workflows = self.model.get_list(
            sort_field='step', sort_order='ASC', page=1, per_page=1)
        me_workflows = self.schema(many=True).dump(me_workflows)
        for me_workflow in me_workflows:
            return me_workflow

    def get_first_me_workflow_id(self):
        init_me_workflow = self.get_first_me_workflow()
        return init_me_workflow['id'] if init_me_workflow is not None else None

    def _get_next_step(self, current_step):
        me_workflows = self.model.get_list(
            sort_field='step', filter={'is_hidden': False})
        me_workflows = self.schema(many=True).dump(me_workflows)
        for me_workflow in me_workflows:
            if me_workflow['step'] > current_step:
                return me_workflow
        return None

    def get_prev_step(self, current_step):
        me_workflows = self.model.get_list(
            sort_field='step', sort_order='DESC', filter={'is_hidden': False})
        me_workflows = self.schema(many=True).dump(me_workflows)
        for me_workflow in me_workflows:
            if me_workflow['step'] < current_step:
                return me_workflow
        return None

    def get_next_step(self, current_step):
        return self._get_next_step(current_step)

    def get_role_me_workflows(self, role_id):
        me_workflows = self.model.get_list(
            per_page=-1, sort_field='step', filter={'role_id': role_id})
        return self.schema(many=True).dump(me_workflows)

    def get_role_first_me_workflow(self, role_id):
        me_workflows = self.model.get_list(
            per_page=1, sort_field='step', filter={'role_id': role_id})
        return me_workflows[0] if len(me_workflows) > 0 else None

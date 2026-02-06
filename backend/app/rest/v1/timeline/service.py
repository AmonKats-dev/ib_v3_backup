from app.constants import messages
from app.core import BaseService
from app.signals import project_created, project_updated, user_created
from flask_restful import abort

from ..project import ProjectService
from .model import Timeline
from .resource import TimelineList
from .schema import TimelineSchema


class TimelineService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Timeline
        self.schema = TimelineSchema
        self.resources = [
            {'resource': TimelineList, 'url': '/timeline'}
        ]

    def get_all(self, args, filters=dict()):
        if filters is None:
            filters = []
        if 'project_id' in filters:
            if self.check_project_access(filters['project_id']):
                return super().get_all(args, filters=filters)
        abort(404, message=messages.NOT_FOUND)

    def check_project_access(self, project_id):
        project = ProjectService().model.get_one(project_id)
        return True if project is not None else False

    def get_max_project_step(self, project_id):
        workflows = self.model.get_list(per_page=1, sort_field='current_step', filter={
                                        'project_id': project_id})
        return workflows[0].current_step if len(workflows) > 0 else None


@project_created.connect
@project_updated.connect
def create_timeline(self, project, **kwargs):
    required_fields = ['prev_phase_id', 'prev_workflow_id', 'prev_step']
    for key in required_fields:
        if kwargs.get(key) is None:
            return
    timeline = {
        'project_id': project['id'],
        'phase_id': kwargs.get('prev_phase_id'),
        'workflow_id': kwargs.get('prev_workflow_id'),
        'current_step': kwargs.get('prev_step')
    }
    if kwargs.get('reason'):
        timeline['reason'] = kwargs.get('reason')
    if kwargs.get('assigned_user_id'):
        timeline['assigned_user_id'] = kwargs.get('assigned_user_id')
    if kwargs.get('action'):
        timeline['project_action'] = kwargs.get('action')
    service = TimelineService()
    service.create(timeline)

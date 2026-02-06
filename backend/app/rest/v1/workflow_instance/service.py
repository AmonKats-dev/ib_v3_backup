from app.core import BaseService

from .model import WorkflowInstance
from .resource import WorkflowInstanceList, WorkflowInstanceView
from .schema import WorkflowInstanceSchema


class WorkflowInstanceService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = WorkflowInstance
        self.schema = WorkflowInstanceSchema
        self.resources = [
            {'resource': WorkflowInstanceList, 'url': '/workflow-instances'},
            {'resource': WorkflowInstanceView, 'url': '/workflow-instances/<int:record_id>'}
        ]

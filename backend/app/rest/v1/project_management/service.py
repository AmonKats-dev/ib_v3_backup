from app.constants import messages
from app.core import BaseService
from app.signals import project_created
from app.utils import validate_schema
from flask_restful import abort

from ..project import ProjectService
from .model import ProjectManagement
from .resource import ProjectManagementList, ProjectManagementView
from .schema import ProjectManagementSchema


class ProjectManagementService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = ProjectManagement
        self.schema = ProjectManagementSchema
        self.resources = [
            {'resource': ProjectManagementList, 'url': '/project-management'},
            {'resource': ProjectManagementView,
                'url': '/project-management/<int:record_id>'}
        ]

    def get_all(self, args=None, filters=dict()):
        if filters is None:
            filters = []
        if 'project_id' in filters:
            if self._check_project_access(filters['project_id']):
                return super().get_all(args, filters=filters)

        abort(404, message=messages.NOT_FOUND)

    def get_one(self, record_id):
        record = super().get_one(record_id)
        if record is not None:
            if self._check_project_access(record['project_id']):
                return record
        abort(404, message=messages.NOT_FOUND)

    def create(self, data):
        schema = self.schema()
        validated_data = validate_schema(data, schema)
        if validated_data and self._check_project_access(validated_data['project_id']):
            record = self.model.create(**validated_data)
            result = schema.dump(record)
            return result
        abort(404, message=messages.NOT_FOUND)

    def update(self, record_id, data, partial=False):
        schema = self.schema()
        validated_data = validate_schema(data, schema, partial=partial)
        if validated_data:
            record = self.model.get_one(record_id)
            if record is not None:
                if self._check_project_access(record.project_id):
                    record = record.update(**validated_data)
                    result = schema.dump(record)
                    return result
            abort(404, message=messages.NOT_FOUND)

    def _check_project_access(self, project_id):
        project = ProjectService().model.get_one(project_id)
        return True if project is not None else False


@project_created.connect
def create_project_management(self, project, **kwargs):
    project_management = {
        'project_id': project['id'],
        'task': [],
        'link': [],
        'staff': []
    }
    ProjectManagementService().create(project_management)

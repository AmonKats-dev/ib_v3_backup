from app.constants import messages
from app.core import BaseService
from app.signals import project_created
from app.utils import validate_schema
from flask_restful import abort

from ..project import ProjectService
from .model import ProjectCompletion
from .resource import ProjectCompletionList, ProjectCompletionView
from .schema import ProjectCompletionSchema


class ProjectCompletionService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = ProjectCompletion
        self.schema = ProjectCompletionSchema
        self.resources = [
            {'resource': ProjectCompletionList, 'url': '/project-completion'},
            {'resource': ProjectCompletionView,
                'url': '/project-completion/<int:record_id>'}
        ]

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

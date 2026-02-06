from app.constants import messages
from app.core import BaseService, feature
from app.signals import (project_detail_created, project_detail_updated,
                         project_option_created, project_option_updated)
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import ProjectOption
from .resource import ProjectOptionList
from .schema import ProjectOptionSchema


class ProjectOptionService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = ProjectOption
        self.schema = ProjectOptionSchema
        self.resources = [
            {'resource': ProjectOptionList, 'url': '/project-options'}
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

    def manage_project_options(self, records, project_detail_id,  phase_id, delete=False):
        if delete:
            ids = []
            for record in records:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids, "project_detail_id": project_detail_id}
            self.delete_many(filter)
        preferred_option = feature.is_active('move_preferred_option')
        for record in records:
            record['project_detail_id'] = project_detail_id
            if 'id' in record:
                result = self.update(record["id"], record)
                project_option_updated.send(project_option=result, **record)
            else:
                if (preferred_option and preferred_option['phase_id'] == phase_id and
                        record['is_preferred'] != True):
                    continue
                errors = self.schema().validate(data=record, partial=False)
                if not errors:
                    result = self.create(record)
                    empty_best_option = feature.is_active(
                        'empty_best_project_option')
                    if (empty_best_option and
                            empty_best_option['phase_id'] == phase_id):
                        continue
                    project_option_created.send(
                        project_option=result, **record)


@project_detail_created.connect
@project_detail_updated.connect
def update_project_options(self, project_detail, **kwargs):
    records = kwargs.get("project_options", None)
    phase_id = project_detail['phase_id']
    if records is not None:
        ProjectOptionService().manage_project_options(
            records, project_detail['id'], phase_id, delete=True)

from app.constants import messages
from app.core import BaseService, feature
from app.signals import (project_analysis_submitted, project_created,
                         project_data_changed, project_dates_changed,
                         project_detail_created, project_detail_updated,
                         project_moved_to_next_phase)
from app.utils import clean_dict, replace_key_dict, validate_schema
from flask_restful import abort

from ..project import ProjectService
from .model import ProjectDetail
from .resource import ProjectDetailList, ProjectDetailView
from .schema import ProjectDetailSchema


class ProjectDetailService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()

        self.model = ProjectDetail
        self.schema = ProjectDetailSchema
        self.resources = [
            {'resource': ProjectDetailList, 'url': '/project-details'},
            {'resource': ProjectDetailView, 'url': '/project-details/<int:record_id>'}
        ]

    def get_all(self, args, filters=dict()):
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

    def update(self, record_id, data, partial=False):
        schema = self.schema()
        validated_data = validate_schema(data, schema, partial=partial)
        if validated_data:
            record = self.model.get_one(record_id)
            if record is not None:
                if self._check_project_access(record.project_id):
                    is_date_changed = self._check_if_duration_changes(
                        record, validated_data)
                    record = record.update(**validated_data)
                    result = schema.dump(record)
                    project_detail_updated.send(project_detail=result, **data)
                    if is_date_changed:
                        project_dates_changed.send(project_id=result['project_id'],
                                                   start_date=result['start_date'],
                                                   end_date=result['end_date'])
                    if ('project_data_changed' in data and data['project_data_changed'] == True):
                        project_data_changed.send(
                            project_id=result['project_id'], data=data)
                    return result

            abort(404, message=messages.NOT_FOUND)

    def _check_if_duration_changes(self, record, data):
        if ('start_date' in data and data['start_date'] != record.start_date):
            return True
        if ('end_date' in data and data['end_date'] != record.end_date):
            return True
        return False

    def _check_project_access(self, project_id):
        project = ProjectService().model.get_one(project_id)
        return True if project is not None else False

    def _clone_project_detail(self, project_id, phase_id):
        record = self.get_current_project_detail(project_id)
        project_detail = self.schema().dump(record)
        replace_key_dict(obj=project_detail, prev_key='id', new_key='prev_id')
        project_detail['phase_id'] = phase_id
        empty_data_feature = feature.is_active('empty_project_background')
        if empty_data_feature and empty_data_feature['phase_id'] == phase_id:
            project_detail.pop("rational_study", None)
            project_detail.pop("methodology", None)
            project_detail.pop("organization_study", None)
            project_detail.pop("exec_management_plan", None)

        cloned_project_detail = self.create(project_detail)
        project_detail_created.send(
            project_detail=cloned_project_detail, **project_detail)

    def get_current_project_detail(self, project_id):
        filter = {'project_id': project_id}
        project_details = self.model.get_list(
            per_page=1, filter=filter, sort_field='id', sort_order='DESC')
        return project_details[0] if len(project_details) > 0 else None


@project_created.connect
def create_project_detail(self, project, **kwargs):
    project_detail = {
        'start_date': kwargs.get("start_date", None),
        'end_date': kwargs.get("end_date", None),
        'end_date': kwargs.get("end_date", None),
        'summary': kwargs.get("summary", None),
        'is_resilient': kwargs.get("is_resilient", None),
        'resilience': kwargs.get("resilience", None),
        'project_id': project['id'],
        'phase_id': project['phase_id']
    }
    service = ProjectDetailService()
    service.create(project_detail)


@project_moved_to_next_phase.connect
def clone_project_detail(self, project, **kwargs):
    service = ProjectDetailService()
    service._clone_project_detail(project['id'], project['phase_id'])


@project_analysis_submitted.connect
def update_project_analysis(self, project_detail_id, issues, recommendations, **kwargs):
    service = ProjectDetailService()
    project_detail = {
        'issues': issues,
        'recommendations': recommendations
    }
    service.update(project_detail_id, project_detail, partial=True)

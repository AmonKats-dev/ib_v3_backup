from app.constants import messages
from app.core import BaseService
from app.signals import (outcome_created, outcome_updated, output_created,
                         output_updated, project_detail_created,
                         project_detail_updated)
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import Indicator
from .resource import IndicatorList
from .schema import IndicatorSchema


class IndicatorService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Indicator
        self.schema = IndicatorSchema
        self.resources = [
            {'resource': IndicatorList, 'url': '/indicators'}
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

    def manage_indicators(self, records, project_detail_id, entity_id, entity_type, delete=False):
        if delete:
            ids = []
            for record in records:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids, "project_detail_id": project_detail_id,
                      'entity_id': entity_id, 'entity_type': entity_type}
            self.delete_many(filter)

        for record in records:
            record['project_detail_id'] = project_detail_id
            record['entity_id'] = entity_id
            record['entity_type'] = entity_type
            if 'id' in record:
                self.update(record["id"], record)
            else:
                errors = self.schema().validate(data=record, partial=False)
                if not errors:
                    self.create(record)


@project_detail_created.connect
@project_detail_updated.connect
def update_indicators_for_project_detail(self, project_detail, **kwargs):
    records = kwargs.get("indicators", None)
    if records is not None:
        IndicatorService().manage_indicators(
            records=records, project_detail_id=project_detail['id'],
            entity_id=project_detail['id'], entity_type='project_detail',
            delete=True)


@outcome_created.connect
def create_indicators_for_outcome(self, outcome, **kwargs):
    records = kwargs.get("indicators", None)
    if records is not None:
        IndicatorService().manage_indicators(
            records=records, project_detail_id=outcome['project_detail_id'],
            entity_id=outcome['id'], entity_type='outcome')


@outcome_updated.connect
def update_indicators_for_outcome(self, outcome, **kwargs):
    records = kwargs.get("indicators", None)
    if records is not None:
        IndicatorService().manage_indicators(
            records=records, project_detail_id=outcome['project_detail_id'],
            entity_id=outcome['id'], entity_type='outcome', delete=True)


@output_created.connect
def create_indicators_for_output(self, output, **kwargs):
    records = kwargs.get("indicators", None)
    if records is not None:
        IndicatorService().manage_indicators(
            records=records, project_detail_id=output['project_detail_id'],
            entity_id=output['id'], entity_type='output')


@output_updated.connect
def update_indicators_for_output(self, output, **kwargs):
    records = kwargs.get("indicators", None)
    if records is not None:
        IndicatorService().manage_indicators(
            records=records, project_detail_id=output['project_detail_id'],
            entity_id=output['id'], entity_type='output', delete=True)

from app.constants import messages
from app.core import BaseService
from app.signals import (outcome_created, outcome_updated, outcomes_updated,
                         project_detail_created, project_detail_updated)
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import Outcome
from .resource import OutcomeList
from .schema import OutcomeSchema


class OutcomeService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Outcome
        self.schema = OutcomeSchema
        self.resources = [
            {'resource': OutcomeList, 'url': '/outcomes'}
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

    def manage_outcomes(self, records, project_id, project_detail_id, delete=False):
        if delete:
            ids = []
            for record in records['outcomes']:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids, "project_detail_id": project_detail_id}
            self.delete_many(filter)

        for record in records['outcomes']:
            record['project_detail_id'] = project_detail_id
            indicators = record['indicators'] if 'indicators' in record else None
            if 'id' in record:
                result = self.update(record["id"], record)
                outcome_updated.send(outcome=result, indicators=indicators)
            else:
                errors = self.schema().validate(data=record, partial=False)
                if not errors:
                    result = self.create(record)
                    prev_id = record['prev_id'] if 'prev_id' in record else None
                    outcome_created.send(outcome=result, indicators=indicators)
                    for output in records['outputs']:
                        if prev_id in output['outcome_ids']:
                            output['outcome_ids'] = [result['id']
                                                     if item == prev_id
                                                     else item
                                                     for item in output['outcome_ids']]

        outcomes_updated.send(project_id=project_id,
                              project_detail_id=project_detail_id,
                              outputs=records['outputs'],
                              activities=records['activities'])


@project_detail_created.connect
def insert_outcomes(self, project_detail, **kwargs):
    project_id = project_detail['project_id']
    records = dict()
    records['outcomes'] = kwargs.get("outcomes", None)
    records['outputs'] = kwargs.get("outputs", None)
    records['activities'] = kwargs.get("activities", None)
    if records['outcomes'] is not None:
        service = OutcomeService()
        service.manage_outcomes(
            records, project_id, project_detail['id'], delete=False)


@project_detail_updated.connect
def update_outcomes(self, project_detail, **kwargs):
    project_id = project_detail['project_id']
    records = dict()
    records['outcomes'] = kwargs.get("outcomes", None)
    records['outputs'] = kwargs.get("outputs", None)
    records['activities'] = kwargs.get("activities", None)
    if records['outcomes'] is not None:
        service = OutcomeService()
        service.manage_outcomes(records, project_id,
                                project_detail['id'], delete=True)

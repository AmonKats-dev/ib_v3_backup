from app.constants import messages
from app.core import BaseService
from app.signals import (outcomes_updated, output_created, output_updated,
                         outputs_updated)
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import Output
from .resource import OutputList
from .schema import OutputSchema


class OutputService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = Output
        self.schema = OutputSchema
        self.resources = [
            {'resource': OutputList, 'url': '/outputs'}
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

    def manage_outputs(self, records, project_id, project_detail_id, delete=False):
        if delete:
            ids = []
            for record in records['outputs']:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids, "project_detail_id": project_detail_id}
            self.delete_many(filter)

        for record in records['outputs']:
            record['project_detail_id'] = project_detail_id
            indicators = record['indicators'] if 'indicators' in record else None
            if 'id' in record:
                result = self.update(record["id"], record)
                output_updated.send(output=result, indicators=indicators)
            else:
                errors = self.schema().validate(data=record, partial=False)
                if not errors:
                    result = self.create(record)
                    prev_id = record['prev_id'] if 'prev_id' in record else None
                    output_created.send(output=result, indicators=indicators)
                    for activity in records['activities']:
                        if prev_id in activity['output_ids']:
                            activity['output_ids'] = [result['id']
                                                      if item == prev_id
                                                      else item
                                                      for item in activity['output_ids']]

        outputs_updated.send(project_id=project_id,
                             project_detail_id=project_detail_id,
                             activities=records['activities'])


@outcomes_updated.connect
def insert_outputs(self, project_id, project_detail_id, **kwargs):
    records = dict()
    records['outputs'] = kwargs.get("outputs", None)
    records['activities'] = kwargs.get("activities", None)
    if records['outputs'] is not None:
        service = OutputService()
        service.manage_outputs(records, project_id,
                               project_detail_id, delete=True)

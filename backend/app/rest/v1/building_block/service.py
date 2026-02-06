from app.constants import messages
from app.core import BaseService
from app.signals import project_option_created, project_option_updated
from flask_restful import abort

from ..project_detail import ProjectDetailService
from .model import BuildingBlock
from .resource import BuildingBlockList
from .schema import BuildingBlockSchema


class BuildingBlockService(BaseService):
    def __init__(self, **kwargs):
        super().__init__()
        self.model = BuildingBlock
        self.schema = BuildingBlockSchema
        self.resources = [
            {'resource': BuildingBlockList, 'url': '/building-blocks'}
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

    def manage_building_blocks(self, records, project_option, delete=False):
        if delete:
            ids = []
            for record in records:
                if 'id' in record:
                    ids.append(record['id'])
            filter = {"not_ids": ids,
                      "project_option_id": project_option['id']}
            self.delete_many(filter)

        for record in records:
            record['project_detail_id'] = project_option['project_detail_id']
            record['project_option_id'] = project_option['id']
            if 'id' in record:
                self.update(record["id"], record)
            else:
                self.create(record)


@project_option_created.connect
def create_building_blocks(self, project_option, **kwargs):
    records = kwargs.get("building_blocks", None)
    if records is not None:
        service = BuildingBlockService()
        service.manage_building_blocks(records, project_option, delete=False)


@project_option_updated.connect
def update_building_blocks(self, project_option, **kwargs):
    records = kwargs.get("building_blocks", None)
    if records is not None:
        service = BuildingBlockService()
        service.manage_building_blocks(records, project_option, delete=True)

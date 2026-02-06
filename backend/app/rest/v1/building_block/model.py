from app.constants import BuildingBlockType
from app.core import BaseModel
from app.shared import db


class BuildingBlock(BaseModel):
    __tablename__ = 'building_block'

    score = db.Column(db.SmallInteger(), nullable=True)
    description = db.Column(db.Text(), nullable=True)
    advantage = db.Column(db.Text(), nullable=True)
    disadvantage = db.Column(db.Text(), nullable=True)
    module_type = db.Column(db.Enum(BuildingBlockType), nullable=False)

    project_option_id = db.Column(db.Integer, db.ForeignKey(
        'project_option.id'), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('score'):
            filter_list.append(self.score == filter.get('score'))
        if filter.get('project_option_id'):
            filter_list.append(self.project_option_id ==
                               filter.get('project_option_id'))
        if filter.get('module_type'):
            filter_list.append(self.module_type == filter.get('module_type'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

from app.core import BaseModel
from app.shared import db
from sqlalchemy.sql import expression


class Component(BaseModel):
    __tablename__ = 'component'

    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text(), nullable=True)
    cost = db.Column(db.String(10), nullable=False)
    subcomponents = db.Column(db.JSON(), nullable=True)
    is_milestone = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

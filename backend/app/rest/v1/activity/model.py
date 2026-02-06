from app.core import BaseModel
from app.shared import db


class Activity(BaseModel):
    __tablename__ = 'activity'

    name = db.Column(db.String(255), nullable=False)
    start_date = db.Column(db.Date(), nullable=False)
    end_date = db.Column(db.Date(), nullable=False)
    description = db.Column(db.Text(), nullable=True)

    output_ids = db.Column(db.JSON(), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    investments = db.relationship(
        'Investment', lazy=True, uselist=True, cascade='all,delete')

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

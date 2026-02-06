from app.core import BaseModel
from app.shared import db


class Outcome(BaseModel):
    __tablename__ = 'outcome'

    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text(), nullable=True)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    indicators = db.relationship(
        'Indicator', primaryjoin="and_(Outcome.id == foreign(Indicator.entity_id), foreign(Indicator.entity_type) == 'outcome')", lazy=True, uselist=True, cascade='all,delete', overlaps="indicators")

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

from app.core import BaseModel
from app.shared import db


class Indicator(BaseModel):
    __tablename__ = 'indicator'

    name = db.Column(db.String(255), nullable=False)
    baseline = db.Column(db.String(100), nullable=False)
    verification_means = db.Column(db.Text(), nullable=False)
    risk_factors = db.Column(db.Text(), nullable=True)
    assumptions = db.Column(db.Text(), nullable=True)
    targets = db.Column(db.JSON(), nullable=True)

    entity_id = db.Column(db.Integer, nullable=False)
    entity_type = db.Column(db.String(50), nullable=False)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('entity_id') and filter.get('entity_type'):
            filter_list.append(self.entity_id == filter.get('entity_id'))
            filter_list.append(self.entity_type == filter.get('entity_type'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

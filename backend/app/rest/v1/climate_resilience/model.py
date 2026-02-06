from app.core import BaseModel
from app.shared import db


class ClimateResilience(BaseModel):
    __tablename__ = 'climate_resilience'
    _has_meta_data = False

    potential_description = db.Column(db.Text(), nullable=True)
    potential_amount = db.Column(db.String(20), nullable=True)
    response_description = db.Column(db.Text(), nullable=True)
    response_amount = db.Column(db.String(20), nullable=True)
    response_results = db.Column(db.Text(), nullable=True)
    response_preferred_option = db.Column(db.String(10), nullable=True)
    risk_degree = db.Column(db.Text(), nullable=True)
    risk_location = db.Column(db.Text(), nullable=True)
    change_effects = db.Column(db.Text(), nullable=True)
    response_high = db.Column(db.JSON(), nullable=True)
    response_medium = db.Column(db.JSON(), nullable=True)
    response_low = db.Column(db.JSON(), nullable=True)

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

from app.core import BaseModel
from app.shared import db


class ClimateRisk(BaseModel):
    __tablename__ = 'climate_risk'

    climate_hazard = db.Column(db.String(255), nullable=False)
    climate_hazard_other = db.Column(db.String(255), nullable=True)
    exposure_risk = db.Column(db.String(10), nullable=False)
    vulnerability_risk = db.Column(db.String(10), nullable=False)
    overall_risk = db.Column(db.String(10), nullable=False)
    vulnerability_impact = db.Column(db.Text(), nullable=True)

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

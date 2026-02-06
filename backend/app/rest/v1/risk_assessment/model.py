from app.core import BaseModel
from app.shared import db


class RiskAssessment(BaseModel):
    __tablename__ = 'risk_assessment'

    reporting_date = db.Column(db.Date(), nullable=False)
    reporting_quarter = db.Column(db.String(2), nullable=True)
    description = db.Column(db.Text(), nullable=True)
    occurrence = db.Column(db.String(255), nullable=True)
    impact = db.Column(db.String(255), nullable=True)
    score = db.Column(db.Integer, nullable=False)
    mitigation_plan = db.Column(db.Text(), nullable=True)
    responsible_entity = db.Column(db.String(255), nullable=True)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    created_by = db.Column(
        db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', lazy=True, foreign_keys=created_by)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('reporting_date'):
            filter_list.append(self.reporting_date ==
                               filter.get('reporting_date'))
        if filter.get('reporting_quarter'):
            filter_list.append(self.reporting_quarter ==
                               filter.get('reporting_quarter'))
        if filter.get('score'):
            filter_list.append(self.score == filter.get('score'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        return filter_list

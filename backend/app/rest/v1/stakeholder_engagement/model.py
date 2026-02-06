from app.core import BaseModel
from app.shared import db


class StakeholderEngagement(BaseModel):
    __tablename__ = 'stakeholder_engagement'

    reporting_date = db.Column(db.Date(), nullable=False)
    reporting_quarter = db.Column(db.String(2), nullable=True)
    name = db.Column(db.String(255), nullable=False)
    responsibilities = db.Column(db.Text, nullable=True)
    interest_level = db.Column(db.String(10), nullable=True)
    influence_level = db.Column(db.String(10), nullable=True)
    engagement_status = db.Column(db.String(255), nullable=True)
    engagement_level = db.Column(db.String(10), nullable=True)
    engagement_frequency = db.Column(db.String(20), nullable=True)
    communication_channel = db.Column(db.Text(), nullable=True)
    issues = db.Column(db.Text(), nullable=True)
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
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        return filter_list

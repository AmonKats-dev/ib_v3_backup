from app.constants import MEActivityStatus
from app.core import BaseModel
from app.shared import db


class MEActivity(BaseModel):
    __tablename__ = 'me_activity'

    activity_status = db.Column(
        db.Enum(MEActivityStatus), nullable=False, default=MEActivityStatus.ON_TRACK)
    fund_source = db.Column(db.String(30), nullable=True)
    expected_completion_date = db.Column(db.Date(), nullable=True)
    challenges = db.Column(db.Text(), nullable=True)
    measures = db.Column(db.Text(), nullable=True)
    budget_appropriation = db.Column(db.String(20), nullable=True)
    budget_supplemented = db.Column(db.String(20), nullable=True)
    budget_allocation = db.Column(db.String(20), nullable=True)
    financial_execution = db.Column(db.String(20), nullable=True)
    allocation_challenges = db.Column(db.Text(), nullable=True)
    allocation_measures = db.Column(db.Text(), nullable=True)
    execution_challenges = db.Column(db.Text(), nullable=True)
    execution_measures = db.Column(db.Text(), nullable=True)

    activity_id = db.Column(db.Integer, db.ForeignKey(
        'activity.id'), nullable=False)
    me_report_id = db.Column(db.Integer, db.ForeignKey(
        'me_report.id'), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    activity = db.relationship('Activity', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('activity_id'):
            filter_list.append(self.activity_id == filter.get('activity_id'))
        if filter.get('activity_status'):
            filter_list.append(self.activity_status ==
                               filter.get('activity_status'))
        if filter.get('me_report_id'):
            filter_list.append(self.me_report_id == filter.get('me_report_id'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

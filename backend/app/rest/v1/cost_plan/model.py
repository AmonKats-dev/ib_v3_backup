from app.constants import CostPlanStatus
from app.core import BaseModel
from app.shared import db


class CostPlan(BaseModel):
    __tablename__ = 'cost_plan'

    year = db.Column(db.SmallInteger(), nullable=False)
    cost_plan_status = db.Column(
        db.Enum(CostPlanStatus), nullable=False, default=CostPlanStatus.DRAFT)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)
    cost_plan_activities = db.relationship(
        'CostPlanActivity', lazy=True, uselist=True)
    cost_plan_items = db.relationship('CostPlanItem', lazy=True, uselist=True)

    created_by = db.Column(
        db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', lazy=True, foreign_keys=created_by)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('year'):
            filter_list.append(self.year == filter.get('year'))
        if filter.get('report_status'):
            filter_list.append(self.report_status ==
                               filter.get('report_status'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        return filter_list

from app.core import BaseModel
from app.shared import db


class CostPlanActivity(BaseModel):
    __tablename__ = 'cost_plan_activity'

    name = db.Column(db.String(255), nullable=False)
    start_date = db.Column(db.Date(), nullable=False)
    end_date = db.Column(db.Date(), nullable=False)
    description = db.Column(db.Text(), nullable=True)
    output_ids = db.Column(db.JSON(), nullable=False)

    activity_id = db.Column(db.Integer, db.ForeignKey(
        'activity.id'), nullable=True)
    cost_plan_id = db.Column(db.Integer, db.ForeignKey(
        'cost_plan.id'), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    activity = db.relationship('Activity', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('activity_id'):
            filter_list.append(self.activity_id == filter.get('activity_id'))
        if filter.get('cost_plan_id'):
            filter_list.append(self.cost_plan_id == filter.get('cost_plan_id'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

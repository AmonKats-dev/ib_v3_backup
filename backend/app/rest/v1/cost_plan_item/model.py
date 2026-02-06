from app.core import BaseModel
from app.shared import db


class CostPlanItem(BaseModel):
    __tablename__ = 'cost_plan_item'

    amount = db.Column(db.String(20), nullable=True)
    procurement_method = db.Column(db.String(50), nullable=True)
    procurement_start_date = db.Column(db.Date(), nullable=True)
    contract_signed_date = db.Column(db.Date(), nullable=True)
    procurement_details = db.Column(db.Text(), nullable=True)

    fund_id = db.Column(db.Integer, db.ForeignKey('fund.id'), nullable=False)
    cost_plan_activity_id = db.Column(db.Integer, db.ForeignKey(
        'cost_plan_activity.id'), nullable=True)
    costing_id = db.Column(db.Integer, db.ForeignKey(
        'costing.id'), nullable=False)
    cost_plan_id = db.Column(db.Integer, db.ForeignKey(
        'cost_plan.id'), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    fund = db.relationship('Fund', lazy=True)
    costing = db.relationship('Costing', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('cost_plan_id'):
            filter_list.append(self.cost_plan_id == filter.get('cost_plan_id'))
        if filter.get('cost_plan_activity_id'):
            filter_list.append(self.cost_plan_activity_id ==
                               filter.get('cost_plan_activity_id'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

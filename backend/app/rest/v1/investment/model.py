from app.core import BaseModel
from app.shared import db


class Investment(BaseModel):
    __tablename__ = 'investment'

    costs = db.Column(db.JSON(), nullable=False)

    activity_id = db.Column(db.Integer, db.ForeignKey(
        'activity.id'), nullable=False)
    fund_id = db.Column(db.Integer, db.ForeignKey('fund.id'), nullable=False)
    costing_id = db.Column(db.Integer, db.ForeignKey(
        'costing.id'), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    fund_body_type = db.Column(db.SmallInteger, nullable=True)
    financial_pattern_type = db.Column(db.SmallInteger, nullable=True)
    financial_pattern_subtype = db.Column(db.SmallInteger, nullable=True)

    fund = db.relationship('Fund', lazy=True)
    costing = db.relationship('Costing', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('activity_id'):
            filter_list.append(self.activity_id == filter.get('activity_id'))
        if filter.get('fund_id'):
            filter_list.append(self.fund_id == filter.get('fund_id'))
        if filter.get('costing_id'):
            filter_list.append(self.costing_id == filter.get('costing_id'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

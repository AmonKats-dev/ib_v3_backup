from app.core import BaseModel
from app.shared import db


class StakeholderEvaluation(BaseModel):
    __tablename__ = 'stakeholder_evaluation'

    name = db.Column(db.String(255), nullable=False)
    beneficiary = db.Column(db.String(10), nullable=True)
    impact_sign = db.Column(db.String(10), nullable=True)
    description = db.Column(db.Text(), nullable=True)

    project_option_id = db.Column(db.Integer, db.ForeignKey(
        'project_option.id'), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('beneficiary'):
            filter_list.append(self.beneficiary == filter.get('beneficiary'))
        if filter.get('impact_sign'):
            filter_list.append(self.impact_sign == filter.get('impact_sign'))
        if filter.get('project_option_id'):
            filter_list.append(self.project_option_id ==
                               filter.get('project_option_id'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

from app.core import BaseModel
from app.shared import db


class EconomicEvaluation(BaseModel):
    __tablename__ = 'economic_evaluation'

    enpv = db.Column(db.String(20), nullable=True)
    err = db.Column(db.String(6), nullable=True)
    summary = db.Column(db.Text(), nullable=True)
    appraisal_methodology = db.Column(db.String(3), nullable=False)
    criteria = db.Column(db.JSON(), nullable=True)

    project_option_id = db.Column(db.Integer, db.ForeignKey(
        'project_option.id'), nullable=False)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_option_id'):
            filter_list.append(self.project_option_id ==
                               filter.get('project_option_id'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('appraisal_methodology'):
            filter_list.append(self.appraisal_methodology ==
                               filter.get('appraisal_methodology'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

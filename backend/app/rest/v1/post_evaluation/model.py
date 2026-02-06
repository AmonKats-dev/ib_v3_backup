from app.core import BaseModel
from app.shared import db


class PostEvaluation(BaseModel):
    __tablename__ = 'post_evaluation'

    evaluation_methodology = db.Column(db.Text(), nullable=False)
    achieved_outcomes = db.Column(db.Text, nullable=False)
    deviation_reasons = db.Column(db.Text, nullable=False)
    measures = db.Column(db.Text, nullable=False)
    lessons_learned = db.Column(db.Text, nullable=False)

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

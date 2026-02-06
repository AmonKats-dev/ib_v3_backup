from app.core import BaseModel
from app.shared import db


class StrategicAlignment(BaseModel):
    __tablename__ = 'strategic_alignment'
    _has_meta_data = False

    plan = db.Column(db.Text(), nullable=True)
    objective_reference = db.Column(db.Text(), nullable=True)
    explanation = db.Column(db.Text(), nullable=True)

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

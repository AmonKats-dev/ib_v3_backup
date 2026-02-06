from app.core import BaseModel
from app.shared import db


class Stakeholder(BaseModel):
    __tablename__ = 'stakeholder'
    _has_additional_data = True

    name = db.Column(db.String(255), nullable=False)
    responsibilities = db.Column(db.Text, nullable=False)

    interest_level = db.Column(db.String(10), nullable=True)
    influence_level = db.Column(db.String(10), nullable=True)
    communication_channel = db.Column(db.Text(), nullable=True)
    engagement_frequency = db.Column(db.String(20), nullable=True)
    responsible_entity = db.Column(db.String(255), nullable=True)

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

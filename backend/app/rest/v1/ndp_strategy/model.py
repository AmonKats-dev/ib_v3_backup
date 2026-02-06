from app.core import BaseModel
from app.shared import db


class NdpStrategy(BaseModel):
    __tablename__ = 'ndp_strategy'
    _has_archive = True

    name = db.Column(db.String(255), nullable=False)
    ndp_outcome_id = db.Column(
        db.Integer, db.ForeignKey('ndp_outcome.id'), nullable=False)

    ndp_outcome = db.relationship('NdpOutcome', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('ndp_outcome_id'):
            filter_list.append(self.ndp_outcome_id ==
                               filter.get('ndp_outcome_id'))
        if filter.get('ndp_goal_id'):
            filter_list.append(self.ndp_outcome.has(
                ndp_goal_id=filter.get('ndp_goal_id')))
        if filter.get('ids'):
            filter_list.append(self.id.in_(filter.get('ids')))
        return filter_list

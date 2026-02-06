from app.core import BaseModel
from app.shared import db


class NdpOutcome(BaseModel):
    __tablename__ = 'ndp_outcome'
    _has_archive = True

    name = db.Column(db.String(255), nullable=False)
    ndp_goal_id = db.Column(
        db.Integer, db.ForeignKey('ndp_goal.id'), nullable=False)

    ndp_goal = db.relationship('NdpGoal', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('ndp_goal_id'):
            filter_list.append(self.ndp_goal_id == filter.get('ndp_goal_id'))
        return filter_list

from app.core import BaseModel
from app.shared import db


class NdpGoal(BaseModel):
    __tablename__ = 'ndp_goal'
    _has_archive = True

    name = db.Column(db.String(255), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        return filter_list

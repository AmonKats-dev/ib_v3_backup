from app.core import BaseModel
from app.shared import db


class Unit(BaseModel):
    __tablename__ = 'unit'
    _has_archive = True

    code = db.Column(db.String(3), nullable=False)
    name = db.Column(db.String(255), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        return filter_list

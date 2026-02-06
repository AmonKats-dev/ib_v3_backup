from app.constants import messages
from app.core import BaseModel
from app.shared import db
from app.utils import get_level
from sqlalchemy import event


class Management(BaseModel):
    __tablename__ = 'management'
    _has_archive = True
    _has_additional_data = False
    _default_sort_field = 'name'

    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        return filter_list

from sqlalchemy.sql import expression

from app.core import BaseModel
from app.shared import db


class Feature(BaseModel):
    __tablename__ = 'feature'
    _has_meta_data = False

    key = db.Column(db.String(150), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    is_global = db.Column(
        db.Boolean, server_default=expression.true(), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('key'):
            filter_list.append(self.key == filter.get('key'))
        return filter_list

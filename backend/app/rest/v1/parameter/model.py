from app.core import BaseModel
from app.shared import db


class Parameter(BaseModel):
    __tablename__ = 'parameter'
    _has_meta_data = False

    param_key = db.Column(db.String(100), nullable=False)
    param_value = db.Column(db.JSON(), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('param_key'):
            filter_list.append(self.param_key == filter.get('param_key'))
        return filter_list

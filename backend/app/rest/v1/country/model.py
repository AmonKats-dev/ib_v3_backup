from app.shared import db
from app.core import BaseModel


class Country(BaseModel):
    __tablename__ = 'country'

    code = db.Column(db.String(3), nullable=False)
    name = db.Column(db.String(255), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        return filter_list

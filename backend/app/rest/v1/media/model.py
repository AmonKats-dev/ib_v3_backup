from app.core import BaseModel
from app.shared import db


class Media(BaseModel):
    __tablename__ = 'media'

    title = db.Column(db.String(255), nullable=False)
    filename = db.Column(db.String(50), nullable=False)
    entity_id = db.Column(db.Integer, nullable=True)
    entity_type = db.Column(db.String(50), nullable=True)
    meta = db.Column(db.JSON(), nullable=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('filename'):
            filter_list.append(self.filename == filter.get('filename'))
        return filter_list

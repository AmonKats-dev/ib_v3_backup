from sqlalchemy.sql import expression

from app.core import BaseModel
from app.shared import db


class FileType(BaseModel):
    __tablename__ = 'file_type'
    _has_archive = True

    name = db.Column(db.String(255), nullable=False)
    is_required = db.Column(
        db.Boolean(), server_default=expression.false(), nullable=False)
    phase_ids = db.Column(db.JSON(), nullable=True)
    extensions = db.Column(db.JSON(), nullable=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('is_required'):
            filter_list.append(self.is_required == filter.get('is_required'))
        return filter_list

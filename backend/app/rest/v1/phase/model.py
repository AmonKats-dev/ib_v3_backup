from app.core import BaseModel
from app.shared import db


class Phase(BaseModel):
    __tablename__ = 'phase'
    _has_archive = True
    _default_sort_field = 'sequence'

    name = db.Column(db.String(255), nullable=False)
    sequence = db.Column(db.Integer, nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

from app.core import BaseModel
from app.shared import db


class Cycle(BaseModel):
    __tablename__ = 'cycle'
    _has_archive = True

    name = db.Column(db.String(255), nullable=False)
    sequence = db.Column(db.Integer, nullable=False)
    config = db.Column(db.JSON(), nullable=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

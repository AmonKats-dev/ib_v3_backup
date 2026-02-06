from app.core import BaseModel
from app.shared import db


class NdpMtf(BaseModel):
    __tablename__ = 'ndp_mtf'
    _has_archive = True

    name = db.Column(db.String(255), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

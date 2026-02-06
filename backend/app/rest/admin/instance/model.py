from sqlalchemy.sql import expression

from app.core import BaseModel
from app.shared import db


class Instance(BaseModel):
    __tablename__ = 'instance'
    _has_meta_data = False

    key = db.Column(db.String(150), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    domain = db.Column(db.String(255), nullable=True)
    country = db.Column(db.String(255), nullable=True)
    modules_config = db.Column(db.JSON(), nullable=True)
    features_config = db.Column(db.JSON(), nullable=True)
    organization_config = db.Column(db.JSON(), nullable=True)
    costing_config = db.Column(db.JSON(), nullable=True)
    fund_config = db.Column(db.JSON(), nullable=True)
    location_config = db.Column(db.JSON(), nullable=True)
    program_config = db.Column(db.JSON(), nullable=True)
    workflow_config = db.Column(db.JSON(), nullable=True)
    instance_config = db.Column(db.JSON(), nullable=True)
    permission_config = db.Column(db.JSON(), nullable=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('key'):
            filter_list.append(self.key == filter.get('key'))
        return filter_list

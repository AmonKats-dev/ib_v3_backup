from sqlalchemy.sql import expression

from app.core import BaseModel
from app.shared import db


class Module(BaseModel):
    __tablename__ = 'module'
    _has_meta_data = False

    key = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    icon = db.Column(db.String(100), nullable=True)
    show_in_menu = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    module_fields = db.Column(db.JSON(), nullable=True)
    module_options = db.Column(db.JSON(), nullable=True)
    module_actions = db.Column(db.JSON(), nullable=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('key'):
            filter_list.append(self.key == filter.get('key'))
        return filter_list

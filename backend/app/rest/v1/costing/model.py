from app.constants import messages
from app.core import BaseModel
from app.shared import db
from app.utils import get_level
from sqlalchemy import event
from sqlalchemy.sql import expression


class Costing(BaseModel):
    __tablename__ = 'costing'
    _has_archive = True
    _has_additional_data = True

    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    is_capital = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    is_om_applicable = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey(
        'costing.id'), nullable=True)
    level = db.Column(db.Integer, nullable=False)
    parent = db.relationship(
        'Costing', remote_side="Costing.id", lazy=True)
    children = db.relationship("Costing", lazy=True, overlaps="parent")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        if filter.get('level'):
            filter_list.append(self.level == filter.get('level'))
        if filter.get('is_om_applicable'):
            filter_list.append(self.is_om_applicable ==
                               filter.get('is_om_applicable'))
        if filter.get('parent_id'):
            filter_list.append(self.parent_id == filter.get('parent_id'))
        return filter_list

    def delete(self):
        for child in self.children:
            child.is_deleted = True
            child.save()
        return super().delete()


@event.listens_for(Costing, 'before_insert')
@event.listens_for(Costing, 'before_update')
def set_level(mapper, connection, target):
    target.level = get_level(Costing, target.parent_id)

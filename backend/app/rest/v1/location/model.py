from sqlalchemy import event

from app.constants import messages
from app.core import BaseModel
from app.shared import db
from app.utils import get_level


class Location(BaseModel):
    __tablename__ = 'location'
    _has_archive = True
    _has_additional_data = True

    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey(
        'location.id'), nullable=True)
    level = db.Column(db.Integer, nullable=False)
    parent = db.relationship(
        'Location', remote_side="Location.id", lazy=True)
    children = db.relationship("Location", lazy=True, overlaps="parent")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('code'):
            filter_list.append(self.code == filter.get('code'))
        if filter.get('level'):
            filter_list.append(self.level == filter.get('level'))
        if filter.get('parent_id'):
            filter_list.append(self.parent_id == filter.get('parent_id'))
        return filter_list

    def delete(self):
        for child in self.children:
            child.is_deleted = True
            child.save()
        return super().delete()


@event.listens_for(Location, 'before_insert')
@event.listens_for(Location, 'before_update')
def set_level(mapper, connection, target):
    target.level = get_level(Location, target.parent_id)

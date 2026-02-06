from app.constants import messages
from app.core import BaseModel
from app.shared import db
from app.utils import get_level
from sqlalchemy import event


class Organization(BaseModel):
    __tablename__ = 'organization'
    _has_archive = True
    _has_additional_data = True
    _default_sort_field = 'name'

    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    management_id = db.Column(db.Integer, db.ForeignKey(
        'management.id'), nullable=True)
    parent_id = db.Column(db.Integer, db.ForeignKey(
        'organization.id'), nullable=True)
    level = db.Column(db.Integer, nullable=False)
    parent = db.relationship(
        'Organization', remote_side="Organization.id", lazy=True)
    children = db.relationship("Organization", lazy=True, overlaps="parent")
    management = db.relationship("Management", lazy=True)

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
        if filter.get('management_id'):
            filter_list.append(self.management_id ==
                               filter.get('management_id'))
        return filter_list

    def delete(self):
        for child in self.children:
            child.is_deleted = True
            child.save()
        return super().delete()


@event.listens_for(Organization, 'before_insert')
@event.listens_for(Organization, 'before_update')
def set_level(mapper, connection, target):
    target.level = get_level(Organization, target.parent_id)

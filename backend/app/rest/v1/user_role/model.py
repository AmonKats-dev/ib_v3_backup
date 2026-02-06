from app.constants import FULL_ACCESS
from app.core import BaseModel
from app.core.cerberus import has_permission
from app.shared import db
from sqlalchemy.sql import expression


class UserRole(BaseModel):
    __tablename__ = 'user_role'
    _has_additional_data = True

    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    allowed_organization_ids = db.Column(db.JSON(), nullable=True)
    allowed_project_ids = db.Column(db.JSON(), nullable=True)
    is_delegated = db.Column(
        db.Boolean, server_default=expression.true(), nullable=False)
    is_delegator = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    delegated_by = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=True)
    is_approved = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    approved_by = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=True)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)

    user = db.relationship('User', foreign_keys=[user_id], lazy=True)
    role = db.relationship('Role', back_populates='role_users', lazy=True)
    approved = db.relationship('User', foreign_keys=[approved_by], lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('user_id'):
            filter_list.append(self.user_id == filter.get('user_id'))
        if filter.get('is_approved') is not None:
            filter_list.append(self.is_approved == filter.get('is_approved'))
        if filter.get('is_delegated') is not None:
            filter_list.append(self.is_delegated == filter.get('is_delegated'))
        if filter.get('role_id'):
            filter_list.append(self.role_id == filter.get('role_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        if filter.get('start_date'):
            filter_list.append(self.start_date >= filter.get('start_date'))
        if filter.get('end_date'):
            filter_list.append(self.end_date <= filter.get('end_date'))
        if filter.get('gt_end_date'):
            filter_list.append(self.end_date > filter.get('gt_end_date'))
        return filter_list

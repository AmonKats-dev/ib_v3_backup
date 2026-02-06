from app.constants import ProjectStatus
from app.core import BaseModel
from app.shared import db
from flask_jwt_extended import get_jwt_identity
from sqlalchemy.sql import expression


class Notification(BaseModel):
    __tablename__ = 'notification'

    created_by = db.Column(
        db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipient_id = db.Column(
        db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=False)
    project_status = db.Column(db.Enum(ProjectStatus), nullable=False)
    is_unread = db.Column(
        db.Boolean(), server_default=expression.true(), nullable=True)

    sender = db.relationship('User', lazy=True, foreign_keys=created_by)
    recipient = db.relationship('User', lazy=True, foreign_keys=recipient_id)
    project = db.relationship('Project', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('is_unread'):
            filter_list.append(self.is_unread == filter.get('is_unread'))
        return filter_list

    def get_access_filters(self, **kwargs):
        filter_list = super().get_access_filters(self, **kwargs)
        user = get_jwt_identity()
        # Handle both dict and int user identity formats
        if isinstance(user, dict):
            user_id = user.get('id')
        else:
            user_id = user
        filter_list.append(self.recipient_id == user_id)
        return filter_list

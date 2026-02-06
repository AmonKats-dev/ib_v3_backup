from app.core import BaseModel
from app.shared import db
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import or_
from sqlalchemy.sql import expression


class Comment(BaseModel):
    __tablename__ = 'comment'
    _has_archive = False

    content = db.Column(db.Text, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=False)
    is_public = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_id'):
            filter_list.append(self.project_id == filter.get('project_id'))
        return filter_list

    def get_access_filters(self, **kwargs):
        filter_list = super().get_access_filters(self, **kwargs)
        user = get_jwt_identity()
        clauses = self.created_by == user['id']
        clauses = or_(clauses, self.is_public == True)
        filter_list.append(clauses)
        return filter_list

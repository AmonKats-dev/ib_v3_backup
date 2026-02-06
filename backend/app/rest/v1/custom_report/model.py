from app.core import BaseModel
from app.shared import db
from flask_jwt_extended import get_jwt_identity
from sqlalchemy import or_
from sqlalchemy.sql import expression


class CustomReport(BaseModel):
    __tablename__ = 'custom_report'
    _default_sort_field = 'name'

    name = db.Column(db.String(255), nullable=False)
    is_public = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    config = db.Column(db.JSON(), nullable=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('is_public'):
            filter_list.append(self.is_public == filter.get('is_public'))
        return filter_list

    def get_access_filters(self, **kwargs):
        filter_list = super().get_access_filters(self, **kwargs)
        user = get_jwt_identity()
        clauses = self.created_by == user['id']
        clauses = or_(clauses, self.is_public == True)
        filter_list.append(clauses)
        return filter_list

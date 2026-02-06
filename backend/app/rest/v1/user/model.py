from app.constants import SINGLE_RECORD
from app.core import BaseModel
from app.shared import db
from app.utils import get_children_ids
from passlib.hash import pbkdf2_sha256 as sha256
from sqlalchemy.sql import expression, func

from ..organization import OrganizationService


class User(BaseModel):
    __tablename__ = 'user'
    _has_archive = True

    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    last_login_time = db.Column(db.DateTime, nullable=True)
    password_changed_on = db.Column(db.DateTime, nullable=True)
    is_blocked = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)

    organization_id = db.Column(db.Integer, db.ForeignKey(
        'organization.id'), nullable=True)
    fund_id = db.Column(db.Integer, db.ForeignKey(
        'fund.id'), nullable=True)
    supervisor_id = db.Column(
        db.Integer, db.ForeignKey('user.id'), nullable=True)
    management_id = db.Column(db.Integer, db.ForeignKey(
        'management.id'), nullable=True)

    user_roles = db.relationship('UserRole', cascade_backrefs=False, lazy=True, uselist=True,
                                 primaryjoin="and_(User.id == foreign(UserRole.user_id), foreign(UserRole.is_approved) == True)", overlaps="user")

    organization = db.relationship('Organization', lazy=True)
    fund = db.relationship('Fund', lazy=True)
    supervisor = db.relationship('User', remote_side='User.id', lazy=True)
    management = db.relationship("Management", lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    @classmethod
    def get_by_username(self, username):
        query = self.query
        filter_list = []
        filter_list.append(self.username == username)
        query = query.filter(*filter_list)
        return query.first()

    def update(self, **kwargs):
        if kwargs.get('password'):
            kwargs['password_changed_on'] = func.now()
            kwargs['last_login_time'] = func.now()
        return super().update(**kwargs)

    def update_login_time(self):
        setattr(self, 'last_login_time', func.now())
        # Use direct database update instead of save() to avoid JWT requirement
        from app.shared import db
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        if not sha256.identify(sha256.hash(password)):
            raise Exception('Password is not hashed properly')
        return sha256.verify(password, hash)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('username'):
            filter_list.append(self.username.like(
                '%{}%'.format(filter.get('username'))))
        if filter.get('is_blocked'):
            filter_list.append(self.is_blocked == filter.get('is_blocked'))
        if filter.get('supervisor_id'):
            filter_list.append(self.supervisor_id ==
                               filter.get('supervisor_id'))
        if filter.get('role_id'):
            filter_list.append(self.user_roles.any(
                role_id=filter.get('role_id')))
        if filter.get('full_name'):
            filter_list.append(self.full_name.like(
                '%{}%'.format(filter.get('full_name'))))
        if filter.get('organization_id'):
            organization_ids = get_children_ids(
                OrganizationService().model.get_one(filter.get('organization_id')))
            filter_list.append(self.organization_id.in_(organization_ids))
        if filter.get('management_id'):
            filter_list.append(self.management_id ==
                               filter.get('management_id'))

        return filter_list

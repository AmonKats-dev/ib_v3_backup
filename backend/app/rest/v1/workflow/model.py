from app.constants import ProjectStatus
from app.core import BaseModel
from app.shared import db
from sqlalchemy.sql import expression


class Workflow(BaseModel):
    __tablename__ = 'workflow'
    _has_additional_data = True

    role_id = db.Column(db.Integer, db.ForeignKey(
        'role.id'), nullable=False)
    actions = db.Column(db.JSON(), nullable=True)
    step = db.Column(db.Integer, nullable=False, unique=True)
    status_msg = db.Column(db.String(255), nullable=False)
    revise_to_workflow_id = db.Column(db.Integer, db.ForeignKey(
        'workflow.id'), nullable=True)
    phases = db.Column(db.JSON(), nullable=False)
    is_hidden = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    is_ipr = db.Column(
        db.Boolean, server_default=expression.false(), nullable=False)
    project_status = db.Column(db.Enum(ProjectStatus), nullable=True)
    file_type_ids = db.Column(db.JSON(), nullable=True)

    revised_workflow = db.relationship(
        'Workflow', remote_side="Workflow.id",  lazy=True)
    role = db.relationship('Role',  lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('step'):
            filter_list.append(self.step == filter.get('step'))
        if filter.get('is_ipr'):
            filter_list.append(self.is_ipr == filter.get('is_ipr'))
        if filter.get('is_hidden') is not None:
            filter_list.append(self.is_hidden == filter.get('is_hidden'))
        if filter.get('role_id'):
            filter_list.append(self.role_id == filter.get('role_id'))
        return filter_list

    def get_access_filters(self, **kwargs):
        filter_list = super().get_access_filters(self)
        return filter_list

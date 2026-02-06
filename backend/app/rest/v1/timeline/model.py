from app.constants import FULL_ACCESS, ProjectAction
from app.core import BaseModel
from app.core.cerberus import has_permission
from app.shared import db
from sqlalchemy.sql import expression


class Timeline(BaseModel):
    __tablename__ = 'timeline'

    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=False)
    phase_id = db.Column(db.Integer, db.ForeignKey('phase.id'), nullable=False)
    workflow_id = db.Column(db.Integer, db.ForeignKey(
        'workflow.id'), nullable=False)
    current_step = db.Column(db.SmallInteger, nullable=False)
    project_action = db.Column(
        db.Enum(ProjectAction), nullable=False, default=ProjectAction.CREATE)
    reason = db.Column(db.Text(), nullable=True)
    assigned_user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=True)

    phase = db.relationship('Phase',  lazy=True, overlaps="current_timeline")
    workflow = db.relationship('Workflow',  lazy=True)
    created_by = db.Column(
        db.Integer, db.ForeignKey('user.id'), nullable=False)
    assigned_user = db.relationship(
        'User',  foreign_keys=assigned_user_id, lazy=True)
    user = db.relationship('User', lazy=True, foreign_keys=created_by)

    files = db.relationship('Media', backref=db.backref('timeline_media', overlaps="files,me_report_media,options_media,project_detail_media"), uselist=True,
                            primaryjoin="and_(Timeline.project_id == foreign(Media.entity_id), foreign(Media.entity_type) == 'timeline')",
                            overlaps="files,me_report_media,options_media,project_detail_media")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_id'):
            filter_list.append(self.project_id == filter.get('project_id'))
        if filter.get('workflow_id'):
            filter_list.append(self.workflow_id == filter.get('workflow_id'))
        if filter.get('current_step'):
            filter_list.append(self.current_step == filter.get('current_step'))
        if filter.get('phase_id'):
            filter_list.append(self.phase_id == filter.get('phase_id'))
        return filter_list

    def get_access_filters(self, **kwargs):
        filter_list = super().get_access_filters(self, **kwargs)
        if (not has_permission('view_ipr_actions')
                and not has_permission(FULL_ACCESS)):
            filter_list.append(self.workflow.has(is_ipr=False))
        return filter_list

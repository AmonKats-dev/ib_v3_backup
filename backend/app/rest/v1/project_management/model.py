from app.core import BaseModel
from app.shared import db


class ProjectManagement(BaseModel):
    __tablename__ = 'project_management'

    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=False)
    task = db.Column(db.JSON(), nullable=False)
    link = db.Column(db.JSON(), nullable=True)
    staff = db.Column(db.JSON(), nullable=True)

    project = db.relationship('Project', uselist=False, lazy=True, overlaps="project_management")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_id'):
            filter_list.append(self.project_id == filter.get('project_id'))
        return filter_list

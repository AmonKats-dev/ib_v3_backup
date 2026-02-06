from app.core import BaseModel
from app.shared import db


class DonorProject(BaseModel):
    __tablename__ = 'donor_project'
    _has_archive = False

    name = db.Column(db.String(255), nullable=False)
    start_date = db.Column(db.DateTime, nullable=True)
    end_date = db.Column(db.DateTime, nullable=True)
    summary = db.Column(db.Text(), nullable=True)
    pillar = db.Column(db.Text(), nullable=True)
    strategic_objective = db.Column(db.Text(), nullable=True)
    area_sectoral = db.Column(db.Text(), nullable=True)
    project_status = db.Column(db.Text(), nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=True)

    project = db.relationship('Project', lazy=True)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        return filter_list

from app.core import BaseModel
from app.shared import db


class ProjectCompletion(BaseModel):
    __tablename__ = 'project_completion'

    sustainability_plan = db.Column(db.Text(), nullable=True)
    future_considerations = db.Column(db.Text(), nullable=True)
    lessons_learnt = db.Column(db.Text(), nullable=True)
    challenges_recommendations = db.Column(db.Text(), nullable=True)
    outcome_performance = db.Column(db.JSON(), nullable=True)
    outputs = db.Column(db.JSON(), nullable=True)
    actual_start_date = db.Column(db.Date, nullable=True)
    actual_end_date = db.Column(db.Date, nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=False)

    project = db.relationship('Project', uselist=False, lazy=True, overlaps="project_completion")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

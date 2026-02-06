from app.core import BaseModel
from app.shared import db


class BeneficiaryAnalysis(BaseModel):
    __tablename__ = 'beneficiary_analysis'

    population = db.Column(db.Integer, nullable=True)
    year = db.Column(db.Integer, nullable=True)
    population_in_poverty = db.Column(db.Integer, nullable=True)
    poverty_year = db.Column(db.Integer, nullable=True)
    composition = db.Column(db.Integer, nullable=True)
    male = db.Column(db.Integer, nullable=True)
    female = db.Column(db.Integer, nullable=True)
    children = db.Column(db.Integer, nullable=True)
    youth = db.Column(db.Integer, nullable=True)
    adults = db.Column(db.Integer, nullable=True)
    elderly = db.Column(db.Integer, nullable=True)
    extreme_poverty = db.Column(db.Integer, nullable=True)
    poor = db.Column(db.Integer, nullable=True)
    not_poor = db.Column(db.Integer, nullable=True)

    location = db.Column(db.Text(), nullable=True)
    other_aspects = db.Column(db.Text(), nullable=True)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

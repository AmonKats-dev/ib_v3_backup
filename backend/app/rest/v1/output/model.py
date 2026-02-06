from app.core import BaseModel
from app.shared import db


class Output(BaseModel):
    __tablename__ = 'output'

    name = db.Column(db.String(255), nullable=False)
    output_value = db.Column(db.String(20), nullable=True)
    outcome_ids = db.Column(db.JSON(), nullable=False)
    organization_ids = db.Column(db.JSON(), nullable=False)
    investments = db.Column(db.JSON(), nullable=True)
    description = db.Column(db.Text(), nullable=True)
    tech_specs = db.Column(db.Text(), nullable=True)
    alternative_specs = db.Column(db.Text(), nullable=True)
    component_ids = db.Column(db.JSON(), nullable=True)

    ndp_strategy_id = db.Column(
        db.Integer, db.ForeignKey('ndp_strategy.id'), nullable=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=True)
    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    unit = db.relationship('Unit', lazy=True)
    indicators = db.relationship(
        'Indicator', primaryjoin="and_(Output.id == foreign(Indicator.entity_id), foreign(Indicator.entity_type) == 'output')", lazy=True, uselist=True, cascade='all,delete', overlaps="indicators,indicators")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('unit_id'):
            filter_list.append(self.unit_id == filter.get('unit_id'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

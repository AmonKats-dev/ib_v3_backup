from app.core import BaseModel
from app.shared import db
from sqlalchemy.sql import expression, func


class ProjectOption(BaseModel):
    __tablename__ = 'project_option'

    name = db.Column(db.String(255), nullable=False)
    cost = db.Column(db.String(20), nullable=True)
    description = db.Column(db.Text(), nullable=True)
    justification = db.Column(db.Text(), nullable=True)
    modality_justification = db.Column(db.Text(), nullable=True)
    score = db.Column(db.SmallInteger(), nullable=True)
    is_shortlisted = db.Column(
        db.Boolean(), server_default=expression.false(), nullable=True)
    is_preferred = db.Column(
        db.Boolean(), server_default=expression.false(), nullable=True)
    funding_modality = db.Column(db.String(255), nullable=True)
    swot_analysis = db.Column(db.Text(), nullable=True)
    start_date = db.Column(db.Date, nullable=True, default=func.now())
    end_date = db.Column(db.Date, nullable=True, default=func.now())
    om_start_date = db.Column(db.Date, nullable=True)
    om_end_date = db.Column(db.Date, nullable=True)
    capital_expenditure = db.Column(db.JSON(), nullable=True)
    om_cost = db.Column(db.JSON(), nullable=True)

    value_for_money = db.Column(db.Text(), nullable=True)
    risk_allocation = db.Column(db.Text(), nullable=True)
    contract_management = db.Column(db.Text(), nullable=True)
    me_strategy = db.Column(db.Text(), nullable=True)

    project_detail_id = db.Column(db.Integer, db.ForeignKey(
        'project_detail.id'), nullable=False)

    building_blocks = db.relationship(
        'BuildingBlock', lazy=True, uselist=True, cascade='all,delete')
    economic_evaluation = db.relationship(
        'EconomicEvaluation', lazy=True, uselist=False, cascade='all,delete')
    financial_evaluation = db.relationship(
        'FinancialEvaluation', lazy=True, uselist=False, cascade='all,delete')
    risk_evaluations = db.relationship(
        'RiskEvaluation', lazy=True, uselist=True, cascade='all,delete')
    stakeholder_evaluations = db.relationship(
        'StakeholderEvaluation', lazy=True, uselist=True, cascade='all,delete')

    files = db.relationship('Media', backref=db.backref('options_media', overlaps="files,me_report_media,project_detail_media,timeline_media"), uselist=True,
                            primaryjoin="and_(ProjectOption.id == foreign(Media.entity_id), foreign(Media.entity_type) == 'project_option')",
                            overlaps="files,me_report_media,project_detail_media,timeline_media")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('is_preferred'):
            filter_list.append(self.is_preferred == filter.get('is_preferred'))
        if filter.get('project_detail_id'):
            filter_list.append(self.project_detail_id ==
                               filter.get('project_detail_id'))
        if filter.get('not_ids'):
            filter_list.append(self.id.notin_(filter.get('not_ids')))
        return filter_list

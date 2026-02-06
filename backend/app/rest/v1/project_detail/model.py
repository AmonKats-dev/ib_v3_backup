from app.core import BaseModel
from app.shared import db


class ProjectDetail(BaseModel):
    __tablename__ = 'project_detail'
    _has_additional_data = True

    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    liability_period = db.Column(db.SmallInteger, nullable=True)
    maintenance_period = db.Column(db.SmallInteger(), nullable=True)
    evaluation_period = db.Column(db.SmallInteger(), nullable=True)
    summary = db.Column(db.Text(), nullable=True)
    situation_analysis = db.Column(db.Text(), nullable=True)
    problem_statement = db.Column(db.Text(), nullable=True)
    problem_cause = db.Column(db.Text(), nullable=True)
    problem_effects = db.Column(db.Text(), nullable=True)
    justification = db.Column(db.Text(), nullable=True)
    rational_study = db.Column(db.Text(), nullable=True)
    methodology = db.Column(db.Text(), nullable=True)
    organization_study = db.Column(db.Text(), nullable=True)
    exec_management_plan = db.Column(db.Text(), nullable=True)
    plan_details = db.Column(db.Text(), nullable=True)
    goal = db.Column(db.Text(), nullable=True)
    goal_description = db.Column(db.Text(), nullable=True)
    project_goal = db.Column(db.Text(), nullable=True)
    baseline = db.Column(db.String(20), nullable=True)
    om_cost = db.Column(db.JSON(), nullable=True)
    om_fund_id = db.Column(
        db.Integer, db.ForeignKey('fund.id'), nullable=True)
    om_costing_id = db.Column(db.Integer, db.ForeignKey(
        'costing.id'), nullable=True)
    sustainability_plan = db.Column(db.Text(), nullable=True)
    me_strategies = db.Column(db.Text(), nullable=True)
    # classification column - commented out as it doesn't exist in database
    # If you need this field, create a migration to add it to the project_detail table
    # classification = db.Column(db.String(255), nullable=True)
    is_resilient = db.Column(db.Boolean, nullable=True)
    resilience = db.Column(db.Text(), nullable=True)
    other_info = db.Column(db.Text(), nullable=True)
    risk_assessment = db.Column(db.Text, nullable=True)
    revenue_source_other = db.Column(db.String(255), nullable=True)
    default_option_name = db.Column(db.String(255), nullable=True)
    default_option_description = db.Column(db.Text, nullable=True)
    default_option_description_impact = db.Column(db.Text, nullable=True)
    revenue_source = db.Column(db.JSON(), nullable=True)
    proposed_funding_source = db.Column(db.JSON(), nullable=True)
    procurement_modality = db.Column(db.JSON(), nullable=True)
    governance = db.Column(db.Text, nullable=True)
    ppp_similar_reference = db.Column(db.Text, nullable=True)
    ppp_interest = db.Column(db.Text, nullable=True)
    ppp_impediments = db.Column(db.Text, nullable=True)
    ppp_risk_allocation = db.Column(db.Text, nullable=True)
    stakeholder_consultation = db.Column(db.Text, nullable=True)
    issues = db.Column(db.Text, nullable=True)
    recommendations = db.Column(db.Text, nullable=True)

    in_ndp = db.Column(db.Boolean, nullable=True)
    ndp_type = db.Column(db.String(10), nullable=True)
    ndp_number = db.Column(db.String(20), nullable=True)
    ndp_name = db.Column(db.String(255), nullable=True)
    ndp_page_no = db.Column(db.SmallInteger, nullable=True)
    ndp_focus_area = db.Column(db.String(50), nullable=True)
    ndp_intervention = db.Column(db.String(255), nullable=True)
    ndp_strategic_directives = db.Column(db.String(100), nullable=True)
    ndp_plan_details = db.Column(db.Text, nullable=True)
    ndp_strategies = db.Column(db.JSON(), nullable=True)
    ndp_sustainable_goals = db.Column(db.Text, nullable=True)
    ndp_policy_alignment = db.Column(db.Text, nullable=True)
    ndp_compliance = db.Column(db.Text, nullable=True)
    national_scope = db.Column(db.Text, nullable=True)
    procurement_plan_description = db.Column(db.Text, nullable=True)
    work_plan_description = db.Column(db.Text, nullable=True)
    behavior_knowledge_products = db.Column(db.Text, nullable=True)
    behavior_project_results = db.Column(db.Text, nullable=True)
    behavior_measures = db.Column(db.Text, nullable=True)
    geo_location = db.Column(db.JSON(), nullable=True)
    sector_ids = db.Column(db.JSON(), nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey(
        'project.id'), nullable=False)
    phase_id = db.Column(db.Integer, db.ForeignKey('phase.id'), nullable=False)
    pillar_id = db.Column(
        db.Integer, db.ForeignKey('pillar.id'), nullable=True)
    currency_rate_id = db.Column(db.Integer, db.ForeignKey(
        'currency_rate.id'), nullable=True)
    om_fund = db.relationship('Fund', lazy=True)
    om_costing = db.relationship('Costing', lazy=True)

    project = db.relationship('Project', lazy=True, overlaps="current_project_detail,project_details")
    phase = db.relationship('Phase', lazy=True, overlaps="current_project_detail")
    pillar = db.relationship('Pillar', lazy=True)
    currency_rate = db.relationship('CurrencyRate', lazy=True)

    responsible_officers = db.relationship(
        'ResponsibleOfficer', lazy=True, uselist=True)
    beneficiary_analysis = db.relationship(
        'BeneficiaryAnalysis', lazy=True, uselist=False)
    locations = db.relationship('ProjectLocation', lazy=True, uselist=True)
    implementing_agencies = db.relationship(
        'ImplementingAgency', lazy=True, uselist=True)
    executing_agencies = db.relationship(
        'ExecutingAgency', lazy=True, uselist=True)
    government_coordinations = db.relationship(
        'GovernmentCoordination', lazy=True, uselist=True)
    om_costs = db.relationship('OmCost', lazy=True, uselist=True)
    components = db.relationship('Component', lazy=True, uselist=True)
    outcomes = db.relationship('Outcome', lazy=True, uselist=True)
    outputs = db.relationship('Output', lazy=True, uselist=True)
    activities = db.relationship('Activity', lazy=True, uselist=True)
    stakeholders = db.relationship('Stakeholder', lazy=True, uselist=True)
    risk_evaluations = db.relationship(
        'RiskEvaluation', lazy=True, uselist=True)
    indicators = db.relationship(
        'Indicator', primaryjoin="and_(ProjectDetail.id == foreign(Indicator.entity_id), foreign(Indicator.entity_type) == 'project_detail')", lazy=True, uselist=True)
    project_options = db.relationship('ProjectOption', lazy=True, uselist=True)
    project_risks = db.relationship('ProjectRisk', lazy=True, uselist=True)
    climate_risks = db.relationship('ClimateRisk', lazy=True, uselist=True)
    strategic_alignments = db.relationship(
        'StrategicAlignment', lazy=True, uselist=True)
    me_reports = db.relationship('MEReport', lazy=True, uselist=True)
    post_evaluation = db.relationship(
        'PostEvaluation', lazy=True, uselist=False)
    climate_resilience = db.relationship(
        'ClimateResilience', lazy=True, uselist=False)

    files = db.relationship('Media', backref=db.backref('project_detail_media', overlaps="files,me_report_media,options_media,timeline_media"), uselist=True,
                            primaryjoin="and_(ProjectDetail.id == foreign(Media.entity_id), foreign(Media.entity_type) == 'project_detail')",
                            overlaps="files,me_report_media,options_media,timeline_media")

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def get_filters(self, filter):
        filter_list = super().get_filters(self, filter)
        if filter.get('project_id'):
            filter_list.append(self.project_id == filter.get('project_id'))
        if filter.get('phase_id'):
            filter_list.append(self.phase_id == filter.get('phase_id'))
        return filter_list

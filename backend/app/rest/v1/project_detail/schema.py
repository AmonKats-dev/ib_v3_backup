from app.constants import HIGH_RISK_IMPACTS
from app.core import (AdditionalSchema, AuditSchema, BaseSchema, feature,
                      generate_schema)
from app.core.cerberus import has_permission
from flask import current_app as app
from marshmallow import fields, validate


def get_high_risk_flag(self, obj):
    if has_permission('view_high_risk_badge'):
        try:
            if hasattr(obj, 'risk_evaluations'):
                for item in obj.risk_evaluations:
                    if item.impact in HIGH_RISK_IMPACTS:
                        return True
        except:
            app.logger.error(
                "An error occurred: Risk Evaluation join table wasn't loaded")
    return False


def get_investments(activities):
    investments = []
    for activity in activities:
        investments += activity.investments
    return investments


def get_investment_stats(self, obj):
    investments = get_investments(obj.activities)
    total_cost = 0
    total_current_cost = 0
    current_ratio = 0
    capital_ratio = 0
    if not investments:
        if len(obj.outputs) > 0:
            for output in obj.outputs:
                if output.investments is not None:
                    for investment in output.investments:
                        if investment is not None and 'costs' in investment:
                            costs = investment['costs']
                            for cost in costs.values():
                                total_cost += float(cost)
        else:
            for component in obj.components:
                total_cost += float(component.cost)
    else:
        for investment in investments:
            if investment is not None:
                costs = investment.costs
                is_capital = True
                if investment.costing is not None:
                    is_capital = investment.costing.is_capital
                for cost in costs.values():
                    total_cost += float(cost)
                    if not is_capital:
                        total_current_cost += float(cost)
        if total_cost != 0:
            current_ratio = round(total_current_cost / total_cost, 2) * 100
        capital_ratio = 100 - current_ratio
    return {
        'total_cost': total_cost,
        'costing_ratio': f'{int(capital_ratio)}/{int(current_ratio)}'
    }


schema = {}
schema['start_date'] = fields.Date(required=True)
schema['end_date'] = fields.Date(required=True)
schema['liability_period'] = fields.Int(required=False, allow_none=True)
schema['maintenance_period'] = fields.Int(required=False, allow_none=True)
schema['evaluation_period'] = fields.Int(required=False, allow_none=True)
schema['summary'] = fields.Str(required=False, allow_none=True)
schema['situation_analysis'] = fields.Str(required=False, allow_none=True)
schema['problem_statement'] = fields.Str(required=False, allow_none=True)
schema['problem_cause'] = fields.Str(required=False, allow_none=True)
schema['problem_effects'] = fields.Str(required=False, allow_none=True)
schema['justification'] = fields.Str(required=False, allow_none=True)
schema['rational_study'] = fields.Str(required=False, allow_none=True)
schema['methodology'] = fields.Str(required=False, allow_none=True)
schema['organization_study'] = fields.Str(required=False, allow_none=True)
schema['exec_management_plan'] = fields.Str(required=False, allow_none=True)
schema['plan_details'] = fields.Str(required=False, allow_none=True)
schema['goal'] = fields.Str(required=False, allow_none=True)
schema['goal_description'] = fields.Str(required=False, allow_none=True)
schema['project_goal'] = fields.Str(required=False, allow_none=True)
schema['baseline'] = fields.Str(
    required=False,  validate=validate.Length(max=20), allow_none=True)
schema['om_cost'] = fields.Raw(required=False, allow_none=True)
schema['om_fund_id'] = fields.Int(required=False, allow_none=True)
schema['om_costing_id'] = fields.Int(required=False, allow_none=True)
schema['sustainability_plan'] = fields.Str(required=False, allow_none=True)
schema['me_strategies'] = fields.Str(required=False, allow_none=True)
# classification field - commented out as column doesn't exist in database
# schema['classification'] = fields.Str(required=False, allow_none=True)
schema['is_resilient'] = fields.Bool(required=False, allow_none=True)
schema['resilience'] = fields.Str(required=False, allow_none=True)
schema['national_scope'] = fields.Str(required=False, allow_none=True)
schema['procurement_plan_description'] = fields.Str(
    required=False, allow_none=True)
schema['work_plan_description'] = fields.Str(required=False, allow_none=True)
schema['behavior_knowledge_products'] = fields.Str(
    required=False, allow_none=True)
schema['behavior_project_results'] = fields.Str(
    required=False, allow_none=True)
schema['behavior_measures'] = fields.Str(required=False, allow_none=True)
schema['other_info'] = fields.Str(required=False, allow_none=True)
schema['is_high_risk'] = fields.Method('get_high_risk_flag')
schema['investment_stats'] = fields.Method('get_investment_stats')

schema['in_ndp'] = fields.Bool(required=False, allow_none=True)
schema['ndp_type'] = fields.Str(
    required=False, validate=validate.Length(max=10), allow_none=True)
schema['ndp_number'] = fields.Str(
    required=False, validate=validate.Length(max=20), allow_none=True)
schema['ndp_name'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['ndp_page_no'] = fields.Int(required=False, allow_none=True)
schema['ndp_focus_area'] = fields.Str(
    required=False, validate=validate.Length(max=50), allow_none=True)
schema['ndp_intervention'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['ndp_strategic_directives'] = fields.Str(
    required=False, validate=validate.Length(max=100), allow_none=True)
schema['ndp_plan_details'] = fields.Str(required=False, allow_none=True)

schema['ndp_strategies'] = fields.Raw(required=False, allow_none=True)
schema['ndp_sustainable_goals'] = fields.Str(required=False, allow_none=True)
schema['ndp_policy_alignment'] = fields.Str(required=False, allow_none=True)
schema['ndp_compliance'] = fields.Str(required=False, allow_none=True)
schema['risk_assessment'] = fields.Str(required=False, allow_none=True)
schema['revenue_source_other'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['default_option_name'] = fields.Str(
    required=False, validate=validate.Length(max=255), allow_none=True)
schema['default_option_description'] = fields.Str(
    required=False, allow_none=True)
schema['default_option_description_impact'] = fields.Str(
    required=False, allow_none=True)
schema['revenue_source'] = fields.Raw(required=False, allow_none=True)
schema['proposed_funding_source'] = fields.Raw(required=False, allow_none=True)
schema['procurement_modality'] = fields.Raw(required=False, allow_none=True)
schema['governance'] = fields.Str(required=False, allow_none=True)
schema['ppp_similar_reference'] = fields.Str(required=False, allow_none=True)
schema['ppp_interest'] = fields.Str(required=False, allow_none=True)
schema['ppp_impediments'] = fields.Str(required=False, allow_none=True)
schema['ppp_risk_allocation'] = fields.Str(required=False, allow_none=True)
schema['stakeholder_consultation'] = fields.Str(
    required=False, allow_none=True)
schema['issues'] = fields.Str(required=False, allow_none=True)
schema['recommendations'] = fields.Str(required=False, allow_none=True)
schema['geo_location'] = fields.Raw(required=False, allow_none=True)
schema['sector_ids'] = fields.Raw(required=False, allow_none=True)


schema['project_id'] = fields.Int(required=True)
schema['phase_id'] = fields.Int(required=True)
schema['pillar_id'] = fields.Int(required=False, allow_none=True)
schema['currency_rate_id'] = fields.Int(required=False, allow_none=True)
schema["om_fund"] = fields.Nested("FundSchema", dump_only=True)
schema["om_costing"] = fields.Nested("CostingSchema", dump_only=True)
schema["om_costs"] = fields.Nested("OmCostSchema", dump_only=True, many=True)

schema['phase'] = fields.Nested('PhaseSchema', dump_only=True)
schema['pillar'] = fields.Nested('PillarSchema', dump_only=True)
schema["currency_rate"] = fields.Nested("CurrencyRateSchema", dump_only=True)

schema['responsible_officers'] = fields.Nested(
    'ResponsibleOfficerSchema', dump_only=True, many=True)
schema['beneficiary_analysis'] = fields.Nested(
    'BeneficiaryAnalysisSchema', dump_only=True, many=False)
schema['project'] = fields.Nested('ProjectSchema', only=('code', 'name', 'function',
                                                         'function_id', 'program', 'program_id', 'project_status', 'project_type', 'classification'), dump_only=True)
schema['locations'] = fields.Nested(
    'ProjectLocationSchema', dump_only=True, many=True)
schema['implementing_agencies'] = fields.Nested(
    'ImplementingAgencySchema', dump_only=True, many=True)
schema['executing_agencies'] = fields.Nested(
    'ExecutingAgencySchema', dump_only=True, many=True)
schema['government_coordinations'] = fields.Nested(
    'GovernmentCoordinationSchema', dump_only=True, many=True)
schema['components'] = fields.Nested(
    'ComponentSchema', dump_only=True, many=True)
schema['outcomes'] = fields.Nested('OutcomeSchema', dump_only=True, many=True)
schema['outputs'] = fields.Nested('OutputSchema', dump_only=True, many=True)
schema['activities'] = fields.Nested(
    'ActivitySchema', dump_only=True, many=True)
schema['stakeholders'] = fields.Nested(
    'StakeholderSchema', dump_only=True, many=True)
schema['indicators'] = fields.Nested(
    'IndicatorSchema', dump_only=True, many=True)
schema['project_options'] = fields.Nested(
    'ProjectOptionSchema', dump_only=True, many=True)
schema['project_risks'] = fields.Nested(
    'ProjectRiskSchema', dump_only=True, many=True)
schema['climate_resilience'] = fields.Nested(
    'ClimateResilienceSchema', dump_only=True)
schema['climate_risks'] = fields.Nested(
    'ClimateRiskSchema', dump_only=True, many=True)
schema['strategic_alignments'] = fields.Nested(
    'StrategicAlignmentSchema', dump_only=True, many=True)
schema['project_options'] = fields.Nested(
    'ProjectOptionSchema', dump_only=True, many=True)
schema['me_reports'] = fields.Nested(
    'MEReportSchema', dump_only=True, many=True)
schema['post_evaluation'] = fields.Nested(
    'PostEvaluationSchema', dump_only=True)
schema['files'] = fields.Nested('MediaSchema', dump_only=True, many=True)

schema['get_high_risk_flag'] = get_high_risk_flag
schema['get_investment_stats'] = get_investment_stats

schema = generate_schema('project_detail', schema)
ProjectDetailSchema = type('ProjectDetailSchema',
                           (AuditSchema, AdditionalSchema, BaseSchema), schema)

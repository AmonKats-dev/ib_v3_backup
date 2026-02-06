from app.constants import MEActivityStatus, MEFinancialStatus, ProjectStatus
from app.core import AdditionalSchema, AuditSchema, BaseSchema
from marshmallow import fields
from marshmallow_enum import EnumField


def get_total_cost(obj, sum=False):
    project_detail = obj.current_project_detail
    activities = project_detail.activities if project_detail is not None else []
    outputs = project_detail.outputs if project_detail is not None else []
    components = project_detail.components if project_detail is not None else []
    costs = {}
    total_cost = 0
    if len(activities) == 0:
        sum = True
        if len(outputs) > 0:
            for output in outputs:
                if output.investments is not None:
                    for investment in output.investments:
                        if investment is not None and 'costs' in investment:
                            costs = investment['costs']
                            for cost in costs.values():
                                total_cost += float(cost)
        else:
            for component in components:
                total_cost += float(component.cost)
    else:
        for activity in activities:
            for investment in activity.investments:
                for year in investment.costs:
                    if year in costs:
                        costs[year] += float(investment.costs[year])
                    else:
                        costs[year] = float(investment.costs[year])
                    total_cost += float(investment.costs[year])
    if sum:
        return total_cost
    return costs


class PivotSchema(BaseSchema):
    code = fields.Str()
    name = fields.Str()
    project_organization = fields.Nested("OrganizationSchema", dump_only=True)
    current_project_detail = fields.Nested(
        "ProjectDetailSchema", only=('created_on', 'modified_on',
                                     'start_date', 'end_date'),
        dump_only=True)
    program = fields.Nested("ProgramSchema", dump_only=True)
    function = fields.Nested("FunctionSchema", dump_only=True)
    project_status = EnumField(ProjectStatus, by_value=True)
    phase = fields.Nested("PhaseSchema", dump_only=True)
    costs = fields.Method("get_costs")
    ranking_data = fields.Method("get_ranking_data")
    progress = fields.Method("get_implementation_progress")
    budget_allocation = fields.Raw(dump_only=True)
    workflow = fields.Nested("WorkflowSchema", dump_only=True)

    def get_implementation_progress(self, obj):
        project_detail = obj.current_project_detail
        physical_progress = MEActivityStatus.ON_TRACK.value
        financial_progress = MEFinancialStatus.ON_TRACK.value
        if project_detail.me_reports and len(project_detail.me_reports) > 0:
            me_report = project_detail.me_reports[0]
            physical_progress = MEActivityStatus.COMPLETED.value
            for activity in me_report.me_activities:
                if activity.activity_status == MEActivityStatus.DELAYED.value:
                    physical_progress = MEActivityStatus.DELAYED.value
                elif (activity.activity_status == MEActivityStatus.ON_TRACK.value and
                      physical_progress != MEActivityStatus.DELAYED.value):
                    physical_progress = MEActivityStatus.ON_TRACK.value

                if activity.financial_execution < activity.budget_allocation:
                    financial_progress = MEFinancialStatus.UNDERFUNDED.value

        return {
            'financial_progress': financial_progress,
            'physical_progress': physical_progress
        }

    def get_ranking_data(self, obj):
        ranking_data = dict()
        options = []
        preferred_option = None
        for item in obj.project_details:
            if item.phase_id == obj.phase_id:
                options = item.project_options
        for option in options:
            preferred_option = option if option.is_preferred else None
        if preferred_option is not None:
            if preferred_option.economic_evaluation:
                ranking_data['enpv'] = preferred_option.economic_evaluation.enpv
                ranking_data['err'] = preferred_option.economic_evaluation.err
            if preferred_option.financial_evaluation:
                ranking_data['fnpv'] = preferred_option.financial_evaluation.fnpv
                ranking_data['irr'] = preferred_option.financial_evaluation.irr
        return ranking_data

    def get_costs(self, obj):
        return get_total_cost(obj)


class OutputInvestmentSchema(BaseSchema):
    current_project_detail = fields.Nested(
        "ProjectDetailSchema", only=('investment_stats', 'outputs',))


class ProjectCountSchema(BaseSchema):
    phase_name = fields.Str()
    total_count = fields.Int()


class LocationReportSchema(BaseSchema):
    code = fields.Str()
    name = fields.Str()
    project_organization = fields.Nested("OrganizationSchema")
    program = fields.Nested("ProgramSchema")
    phase_id = fields.Int()
    current_project_detail = fields.Nested(
        "ProjectDetailSchema", only=('geo_location',))


class ProjectReportSchema(AuditSchema, BaseSchema):
    code = fields.Str()
    name = fields.Str()
    project_status = EnumField(ProjectStatus, by_value=True)
    phase_id = fields.Int()
    organization_id = fields.Int()
    program_id = fields.Int()
    workflow_id = fields.Int()
    current_step = fields.Int()
    phase = fields.Nested("PhaseSchema")
    project_organization = fields.Nested("OrganizationSchema")
    current_project_detail = fields.Nested("ProjectDetailSchema", exclude=(
        'outcomes', 'outputs.indicators', 'indicators', 'stakeholders', 'project_options', 'me_reports', 'files'))


class ProjectMinReportSchema(AuditSchema, BaseSchema):
    code = fields.Str()
    name = fields.Str()
    project_status = EnumField(ProjectStatus, by_value=True)
    phase_id = fields.Int()
    organization_id = fields.Int()
    program_id = fields.Int()
    workflow_id = fields.Int()
    current_step = fields.Int()
    phase = fields.Nested("PhaseSchema")
    project_organization = fields.Nested("OrganizationSchema")
    total_costs = fields.Method("get_total_costs")
    costs = fields.Method("get_costs")
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    workflow = fields.Nested("WorkflowSchema", dump_only=True)
    program = fields.Nested("ProgramSchema", dump_only=True)
    current_timeline = fields.Nested(
        "TimelineSchema", dump_only=True, only=('created_on', 'project_action'))

    def get_costs(self, obj):
        return get_total_cost(obj)

    def get_total_costs(self, obj):
        return get_total_cost(obj, True)


class PipMinReportSchema(BaseSchema):
    code = fields.Str()
    name = fields.Str()
    program = fields.Nested("ProgramSchema")
    project_organization = fields.Nested("OrganizationSchema")
    last_submission_date = fields.Function(
        lambda obj: obj.current_project_detail.created_on.strftime('%d/%m/%Y'))
    current_project_detail = fields.Nested(
        "ProjectDetailSchema", only=('created_on',))
    costs = fields.Method("get_costs")

    def get_costs(self, obj):
        costs = get_total_cost(obj, True)
        return round(costs/(100000*10000))

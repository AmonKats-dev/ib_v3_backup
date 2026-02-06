
from app.constants import ProjectStatus
from app.core import feature

from ..ndp_strategy import NdpStrategyService
from ..project import ProjectService
from .resource import (LocationReportView, NdpReportView, PivotView,
                       ProjectCountView, ProjectMinReportView,
                       ProjectReportView, PSIPReportView, PublicPipReportView)
from .schema import (LocationReportSchema, OutputInvestmentSchema,
                     PipMinReportSchema, PivotSchema, ProjectCountSchema,
                     ProjectMinReportSchema, ProjectReportSchema)


class ReportService():
    def __init__(self, **kwargs):
        self.resources = [
            {'resource': LocationReportView, 'url': '/reports/projects-location'},
            {'resource': PivotView, 'url': '/reports/pivot'},
            {'resource': ProjectCountView, 'url': '/reports/projects-count'},
            {'resource': ProjectReportView, 'url': '/reports/projects-report'},
            {'resource': ProjectMinReportView,
                'url': '/reports/projects-min-report'},
            {'resource': PublicPipReportView, 'url': '/reports/public-pip-report'},
            {'resource': NdpReportView, 'url': '/reports/ndp-report'},
            {'resource': PSIPReportView, 'url': '/reports/psip-report'}]

    def get_project_pivot_report(self, filters):
        schema = PivotSchema(many=True, exclude=('progress',))
        project_service = ProjectService()
        records = project_service.model.get_list(per_page=-1, filter=filters)
        return schema.dump(records)

    def get_psip_report(self):
        filter = {
            'project_status': ProjectStatus.ONGOING.value
        }
        schema = PivotSchema(many=True, exclude=('ranking_data', 'phase'))
        project_service = ProjectService()
        records = project_service.model.get_list(filter=filter)
        return schema.dump(records)

    def get_pip_min_report(self, page=1):
        pipeline_phase_id = self._get_pipeline_report_phase()
        if pipeline_phase_id is not None:
            filter = {'phase_id': pipeline_phase_id}
            schema = PipMinReportSchema(many=True)
            project_service = ProjectService()
            records = project_service.model.get_list(
                filter=filter, page=page, per_page=10, sort_order="DESC")
            total = project_service.model.get_total(filter=filter)
            projects = schema.dump(records)
            return {'projects': projects, 'total': total}
        return {'projects': 0, 'total': 0}

    def get_project_count_report(self):
        schema = ProjectCountSchema(many=True)
        project_service = ProjectService()
        records = project_service.model.get_total_by_phases()
        return schema.dump(records)

    def get_project_report(self, filters=dict()):
        schema = ProjectReportSchema(many=True)
        project_service = ProjectService()
        records = project_service.model.get_list(filter=filters, per_page=-1)
        return schema.dump(records)

    def get_project_min_report(self, filters=dict()):
        schema = ProjectMinReportSchema(many=True)
        project_service = ProjectService()
        records = project_service.model.get_list(filter=filters, per_page=-1)
        return schema.dump(records)

    def get_location_report(self):
        schema = LocationReportSchema(many=True)
        project_service = ProjectService()
        records = project_service.model.get_list(page=1, per_page=-1,
                                                 filter={'status': ProjectStatus.DRAFT.value})
        return schema.dump(records)

    def get_ndp_report(self):
        ndp_data = dict()
        schema = OutputInvestmentSchema(many=True)
        project_service = ProjectService()

        ndp_strategies = NdpStrategyService().model.get_list(page=1, per_page=-1)
        for record in ndp_strategies:
            ndp_data[record.id] = {
                'ndp_strategy_id': record.id,
                'ndp_strategy_name': record.name,
                'ndp_outcome_id': record.ndp_outcome_id,
                'ndp_outcome_name': record.ndp_outcome.name,
                'ndp_goal_id': record.ndp_outcome.ndp_goal.id,
                'ndp_goal_name': record.ndp_outcome.ndp_goal.name,
                'costs': 0,
                'total_count': 0
            }

        records = project_service.model.get_list(page=1, per_page=-1)
        projects = schema.dump(records)
        for project in projects:
            outputs = project['current_project_detail']['outputs']
            investment_stats = project['current_project_detail']['investment_stats']
            for output in outputs:
                if output['ndp_strategy_id'] in ndp_data:
                    ndp_data[output['ndp_strategy_id']]['total_count'] += 1
                    ndp_data[output['ndp_strategy_id']
                             ]['costs'] += investment_stats['total_cost']
        return ndp_data

    def _get_pipeline_report_phase(self):
        pipeline_report_feature = feature.is_active('has_pipeline_reports')
        if pipeline_report_feature:
            return pipeline_report_feature['phase_id']
        return None

    def add_resources(self, blueprint):
        for item in self.resources:
            blueprint.add_resource(item['resource'], item['url'],
                                   resource_class_kwargs={'service': self})

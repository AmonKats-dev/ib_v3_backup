from flask import Blueprint
from flask_restful import Api
import json
from json import JSONEncoder

from .activity import ActivityService
from .beneficiary_analysis import BeneficiaryAnalysisService
from .building_block import BuildingBlockService
from .climate_resilience import ClimateResilienceService
from .climate_risk import ClimateRiskService
from .comment import CommentService
from .component import ComponentService
from .cost_plan import CostPlanService
from .cost_plan_activity import CostPlanActivityService
from .cost_plan_item import CostPlanItemService
from .costing import CostingService
from .country import CountryService
from .currency import CurrencyService
from .currency_rate import CurrencyRateService
from .custom_report import CustomReportService
from .cycle import CycleService
from .donor_project import DonorProjectService
from .economic_evaluation import EconomicEvaluationService
from .executing_agency import ExecutingAgencyService
from .export import ExportService
from .file_type import FileTypeService
from .financial_evaluation import FinancialEvaluationService
from .function import FunctionService
from .fund import FundService
from .fund_source import FundSourceService
from .cost_category import CostCategoryService
from .cost_classification import CostClassificationService
from .government_coordination import GovernmentCoordinationService
from .human_resource import HumanResourceService
from .implementing_agency import ImplementingAgencyService
from .indicator import IndicatorService
from .integration import IntegrationService
from .investment import InvestmentService
from .location import LocationService
from .management import ManagementService
from .me_activity import MEActivityService
from .me_liability import MELiabilityService
from .me_output import MEOutputService
from .me_release import MEReleaseService
from .me_report import MEReportService
from .me_workflow import MEWorkflowService
from .media import MediaService
from .ndp_goal import NdpGoalService
from .ndp_mtf import NdpMtfService
from .ndp_outcome import NdpOutcomeService
from .ndp_sdg import NdpSdgService
from .ndp_strategy import NdpStrategyService
from .notification import NotificationService
from .om_cost import OmCostService
from .organization import OrganizationService
from .outcome import OutcomeService
from .output import OutputService
from .parameter import ParameterService
from .phase import PhaseService
from .pillar import PillarService
from .post_evaluation import PostEvaluationService
from .program import ProgramService
from .project import ProjectService
from .project_completion import ProjectCompletionService
from .project_detail import ProjectDetailService
from .project_location import ProjectLocationService
from .project_management import ProjectManagementService
from .project_option import ProjectOptionService
from .project_risk import ProjectRiskService
from .report import ReportService
from .responsible_officer import ResponsibleOfficerService
from .risk_assessment import RiskAssessmentService
from .risk_evaluation import RiskEvaluationService
from .role import RoleService
from .sector import SectorService
from .stakeholder import StakeholderService
from .stakeholder_engagement import StakeholderEngagementService
from .stakeholder_evaluation import StakeholderEvaluationService
from .strategic_alignment import StrategicAlignmentService
from .timeline import TimelineService
from .unit import UnitService
from .user import UserService
from .user_role import UserRoleService
from .workflow import WorkflowService
from .workflow_instance import WorkflowInstanceService

api_v1 = Blueprint('api', __name__)

# Custom JSON encoder that removes functions recursively
class SafeJSONEncoder(JSONEncoder):
    def encode(self, obj):
        # Don't clean None or empty objects - they're already safe
        if obj is None:
            return super().encode(obj)
        
        # Recursively clean the object before encoding
        cleaned = self._clean_object(obj)
        
        # If cleaning resulted in None for a non-None object, return empty dict instead
        if cleaned is None and obj is not None:
            if isinstance(obj, dict):
                return super().encode({})
            return super().encode(obj)
        
        return super().encode(cleaned)
    
    def _clean_object(self, obj):
        """Recursively remove functions from objects"""
        if callable(obj):
            return None  # Remove functions
        if isinstance(obj, dict):
            cleaned = {}
            for k, v in obj.items():
                if callable(k):
                    continue  # Skip function keys
                if callable(v):
                    continue  # Skip function values
                cleaned_key = str(k) if not isinstance(k, str) else k
                cleaned_value = self._clean_object(v)
                # Always add the value, even if it's None (it might have been None originally)
                # But don't add if the value was a function (which becomes None)
                if not callable(v):
                    cleaned[cleaned_key] = cleaned_value
            # Always return the cleaned dict, even if empty
            return cleaned
        if isinstance(obj, (list, tuple)):
            cleaned = []
            for item in obj:
                if callable(item):
                    continue  # Skip functions
                cleaned_item = self._clean_object(item)
                # Always add the item, even if it's None (it might have been None originally)
                # But don't add if the item was a function (which becomes None)
                if not callable(item):
                    cleaned.append(cleaned_item)
            # Always return the cleaned list, even if empty
            return cleaned
        return obj
    
    def default(self, obj):
        if callable(obj):
            return None  # Remove functions
        try:
            return super().default(obj)
        except TypeError:
            return str(obj)

# Configure Flask-RESTful to use our safe encoder
api = Api(api_v1)

# Override the JSON representation to use our safe encoder
# Flask-RESTful's representation function should return a Response object (like the default)
def safe_json_representation(data, status, headers=None):
    """Custom JSON representation that removes functions"""
    from flask import make_response, current_app, Response
    
    # If data is already a Response object, return it as-is
    if isinstance(data, Response):
        return data
    
    # If data is a function (like a decorator), this is an error - return error response
    if callable(data) and not isinstance(data, (str, int, float, bool, type(None))):
        error_data = {'message': 'An error occurred while processing the request', 'error': 'Invalid response data'}
        json_str = json.dumps(error_data) + "\n"
        resp = make_response(json_str, 500)
        if headers:
            resp.headers.extend(headers)
        return resp
    
    # Get settings from app config (like the default implementation)
    settings = current_app.config.get('RESTFUL_JSON', {})
    
    # First try to serialize with our safe encoder
    try:
        json_str = json.dumps(data, cls=SafeJSONEncoder, ensure_ascii=False, **settings) + "\n"
        
        # Check if result is "null" - this means data was removed
        if json_str.strip() == "null":
            # Try fallback to default encoder
            json_str = json.dumps(data, ensure_ascii=False, **settings) + "\n"
    except Exception as e:
        # Fallback to default encoder
        try:
            json_str = json.dumps(data, ensure_ascii=False, **settings) + "\n"
        except Exception as e2:
            # Last resort: return error
            json_str = json.dumps({'message': 'An error occurred while processing the request'}, **settings) + "\n"
            status = 500
    
    # Create response using make_response (like the default implementation)
    resp = make_response(json_str, status)
    if headers:
        resp.headers.extend(headers)
    return resp

api.representations = {
    'application/json': safe_json_representation
}

ActivityService().add_resources(api)
BeneficiaryAnalysisService().add_resources(api)
BuildingBlockService().add_resources(api)
ClimateResilienceService().add_resources(api)
ClimateRiskService().add_resources(api)
CommentService().add_resources(api)
CostPlanActivityService().add_resources(api)
CostPlanItemService().add_resources(api)
CostPlanService().add_resources(api)
ComponentService().add_resources(api)
CostingService().add_resources(api)
CostCategoryService().add_resources(api)
CostClassificationService().add_resources(api)
CountryService().add_resources(api)
CurrencyService().add_resources(api)
CurrencyRateService().add_resources(api)
CustomReportService().add_resources(api)
CycleService().add_resources(api)
DonorProjectService().add_resources(api)
EconomicEvaluationService().add_resources(api)
ExecutingAgencyService().add_resources(api)
ExportService().add_resources(api)
FileTypeService().add_resources(api)
FinancialEvaluationService().add_resources(api)
FunctionService().add_resources(api)
FundService().add_resources(api)
FundSourceService().add_resources(api)
GovernmentCoordinationService().add_resources(api)
HumanResourceService().add_resources(api)
ImplementingAgencyService().add_resources(api)
IndicatorService().add_resources(api)
IntegrationService().add_resources(api)
InvestmentService().add_resources(api)
LocationService().add_resources(api)
ManagementService().add_resources(api)
MEActivityService().add_resources(api)
MELiabilityService().add_resources(api)
MEOutputService().add_resources(api)
MEReleaseService().add_resources(api)
MEReportService().add_resources(api)
MEWorkflowService().add_resources(api)
MediaService().add_resources(api)
NdpGoalService().add_resources(api)
NdpMtfService().add_resources(api)
NdpOutcomeService().add_resources(api)
NdpSdgService().add_resources(api)
NdpStrategyService().add_resources(api)
NotificationService().add_resources(api)
OmCostService().add_resources(api)
OrganizationService().add_resources(api)
OutcomeService().add_resources(api)
OutputService().add_resources(api)
ParameterService().add_resources(api)
PhaseService().add_resources(api)
PillarService().add_resources(api)
PostEvaluationService().add_resources(api)
ProgramService().add_resources(api)
ProjectService().add_resources(api)
ProjectCompletionService().add_resources(api)
ProjectDetailService().add_resources(api)
ProjectLocationService().add_resources(api)
ProjectManagementService().add_resources(api)
ProjectOptionService().add_resources(api)
ProjectRiskService().add_resources(api)
ReportService().add_resources(api)
ResponsibleOfficerService().add_resources(api)
RiskAssessmentService().add_resources(api)
RiskEvaluationService().add_resources(api)
RoleService().add_resources(api)
SectorService().add_resources(api)
StakeholderService().add_resources(api)
StakeholderEngagementService().add_resources(api)
StakeholderEvaluationService().add_resources(api)
StrategicAlignmentService().add_resources(api)
TimelineService().add_resources(api)
UnitService().add_resources(api)
UserService().add_resources(api)
UserRoleService().add_resources(api)
WorkflowService().add_resources(api)
WorkflowInstanceService().add_resources(api)

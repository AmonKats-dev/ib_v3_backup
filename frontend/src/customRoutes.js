import React, { forwardRef, useEffect, useState } from "react";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import ApartmentIcon from "@material-ui/icons/Apartment";
import Archive from "./views/pages/Archive";
import ArchiveManagement from "./views/pages/ArchiveManagement";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import BuildIcon from "@material-ui/icons/Build";
import Completed from "./views/pages/reports/Completed";
import CompletionReport from "./views/resources/Projects/CompletionReport";
import CompletionReportList from "./views/pages/reports/CompletionReportList";
import ContingencyLiability from "./views/pages/reports/ContingencyLiability";
import ContingencyLiabilityReport from "./views/resources/Projects/ContingencyLiabilityReport";
import CostEvaluation from "./views/pages/reports/CostEvaluation";
import CustomPage from "./views/pages/navigation/CustomPage";
import Dashboard from "./views/pages/Dashboard";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { DeleteOutlineOutlined } from "@material-ui/icons";
import DomainIcon from "@material-ui/icons/Domain";
import DonorsProjects from "./views/pages/reports/DonorsProjects";
import FiscalLoad from "./views/pages/reports/FiscalLoad";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FunctionsSumCount from "./views/pages/reports/FunctionsSumCount";
import GanttChart from "./views/pages/gantt/GantChart";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import IbpUsage from "./views/pages/reports/IbpUsage";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import MEReportsCreate from "./views/resources/Projects/ProjectMonitorings/MEReportsCreate";
import MEReportsList from "./views/resources/Projects/ProjectMonitorings/MEReportsList";
import MYCDataEntry from "./views/resources/Projects/MYCDataEntry";
import MapIcon from "@material-ui/icons/Map";
import MeReport from "./views/pages/reports/MeReport";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import MycReport from "./views/pages/reports/MycReport";
import NDPreport from "./views/pages/reports/NDPreport";
import NavigationProjectsList from "./views/pages/navigation/projects/NavigationProjectsList";
import NetworkCheckIcon from "@material-ui/icons/NetworkCheck";
import NoteIcon from "@material-ui/icons/Note";
import OrganizationsList from "./views/resources/Organizations/OrganizationsList";
import PSIP from "./views/pages/reports/PSIP";
import PageInDevelopment from "./views/pages/PageInDevelopment";
import PapProjects from "./views/pages/reports/PapProjects";
import PermDataSettingIcon from "@material-ui/icons/PermDataSetting";
import PipReport from "./views/resources/Projects/PipReport";
import PiplineProjects from "./views/pages/reports/PiplineProjects";
import PiplineProjectsPortfolio from "./views/pages/reports/PiplineProjectsPortfolio";
import ProjectsPipeline from "./views/pages/reports/ProjectsPipeline";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import ProgramsSumCount from "./views/pages/reports/ProgramsSumCount";
import ProjectCategories from "./views/pages/reports/ProjectCategories";
import ProjectManagment from "./views/pages/gantt/ProjectManagment";
import ProjectResourcesManagment from "./views/pages/gantt/ProjectResourcesManagment";
import ProjectsDc from "./views/pages/reports/ProjectsDc";
import ReportDC from "./views/pages/reports/ProjectsDcBck";
import ProjectsList from "./views/resources/Projects/ProjectsList";
import ProjectsLocations from "./views/pages/reports/ProjectsLocations";
import ProjectsPortfolio from "./views/pages/gantt/ProjectsPortfolio";
import ProjectsRepeated from "./views/pages/reports/ProjectsRepeated";
import ProjectsReverted from "./views/pages/ProjectsReverted";
import ProjectsTrash from "./views/pages/ProjectsTrash";
import PublicInvestmentPlan from "./views/pages/reports/PublicInvestmentPlan";
import QuarterlyAnnualReport from "./views/pages/reports/QuarterlyAnnualReport";
import RankingProjectsList from "./views/resources/Projects/RankingProjectsList";
import ProjectsPrioritization from "./views/pages/reports/ProjectsPrioritization";
import RankingProjectsReport from "./views/pages/reports/RankingProjectsReport";
import RankingReport from "./views/pages/reports/RankingReport";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ReportBuilder from "./views/pages/ReportBuilder";
import ReportViewer from "./views/pages/ReportViewer";
import ResetPasswordPageWithTheme from "./views/pages/ResetPasswordPage";
import RoomIcon from "@material-ui/icons/Room";
import { Route } from "react-router-dom";
import SectorsCount from "./views/pages/reports/SectorsCount";
import StagnantProjects from "./views/pages/reports/StagnantProjects";
import StorageIcon from "@material-ui/icons/Storage";
import SubmittedProjects from "./views/pages/reports/SubmittedProjects";
import TableChartIcon from "@material-ui/icons/TableChart";
import TodayIcon from "@material-ui/icons/Today";
import { Typography } from "@material-ui/core";
import UpdateIcon from "@material-ui/icons/Update";
import UsefulLinksPage from "./views/pages/UsefulLinksPage";
import UserRoleList from "./views/resources/Users/UserRoleList";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import WaitingProjects from "./views/pages/reports/WaitingProjects";
import WorkflowChart from "./views/modules/Workflow";
import { checkFeature } from "./helpers/checkPermission";
import { getApplicationConfig } from "./constants/config";
import CostedAnnualizedPlanList from "./views/pages/implementation/CostedAnnualizedPlanList";
import ImplementationModule from "./views/pages/implementation/ImplementationModule";
import CostedAnnualizedPlanReport from "./views/pages/implementation/CostedAnnualizedPlanReport";
import CostedAnnualizedPlanEdit from "./views/pages/implementation/CostedAnnualizedPlanEdit";
import CostedAnnualizedPlanShow from "./views/pages/implementation/CostedAnnualizedPlanShow";
import MYCForm from "./views/pages/implementation/myc/MYCForm";
import CostPlansCreate from "./views/resources/CostPlans/CostPlansCreate";
import CostPlansShow from "./views/resources/CostPlans/CostPlansShow";
import CostPlansList from "./views/resources/CostPlans/CostPlansList";
import CostPlansShowReport from "./views/resources/CostPlans/CostPlansShowReport";
import RiskAssessmentsCreate from "./views/resources/RiskAssessments/RiskAssessmentsCreate";
import StakeholderEngagementsCreate from "./views/resources/StakeholderEngagements/StakeholderEngagementsCreate";
import HumanResourcesCreate from "./views/resources/HumanResources/HumanResourcesCreate";
import RiskAssessmentsList from "./views/resources/RiskAssessments/RiskAssessmentsList";
import HumanResourcesList from "./views/resources/HumanResources/HumanResourcesList";
import RiskAssessmentsReport from "./views/resources/RiskAssessments/RiskAssessmentsReport";
import StakeholderEngagementsReport from "./views/resources/StakeholderEngagements/StakeholderEngagementsReport";
import HumanResourcesReport from "./views/resources/HumanResources/HumanResourcesReport";
import IntegrationsAmp from "./views/integrations/amp";
import IntegrationsPbs from "./views/integrations/pbs";
import IntegrationsIfmis from "./views/integrations/ifmis";
import ProjectCompletionCreate from "./views/resources/ProjectCompletion/ProjectCompletionCreate";
import ProjectCompletionShow from "./views/resources/ProjectCompletion/ProjectCompletionShow";
import AppealsCreate from "./views/resources/Appeals/AppealsCreate";
import IntegrationsNdp from "./views/integrations/ndp";
import MycCreate from "./views/resources/Myc/MycCreate";
import Incoming from "./views/pages/Incoming";
import ResetPasswordPageWithThemePimis from "./views/pages/ResetPasswordPagePimis";
import WorkPlansCreate from "./views/resources/WorkPlans/WorkPlansCreate";
import ConsolidatedAnnualReport from "./views/pages/reports/ConsolidatedAnnualReport";
import ValidationForm from "./views/modules/Validation/ValidationForm";
import RiskAssessmentsReportManage from "./views/resources/RiskAssessments/RiskAssessmentsReportManage";
import StakeholderEngagementsReportManage from "./views/resources/StakeholderEngagements/StakeholderEngagementsReportManage";
import IndicatorsPage from "./views/modules/IndicatorsPage";
import AchieveTargets from "./views/modules/IndicatorsPage/AchieveTargets";
import AppealsList from "./views/resources/Appeals/AppealsList";
import AchieveSubTargets from "./views/modules/IndicatorsPage/Subindicators/AchieveSubTargets";
import AppealsReport from "./views/resources/Appeals/AppealsReport";
import WorkPlansShow from "./views/resources/WorkPlans/WorkPlansShow";
import WorkPlansShowAdjusted from "./views/resources/WorkPlans/WorkPlansShowAdjusted";
import WorkPlansList from "./views/resources/WorkPlans/WorkPlansList";
import IntegrationsBpms from "./views/integrations/bpms";
import WorkPlansShowMonthly from "./views/resources/WorkPlans/WorkPlansShowMonthly";
import IntegrationsGfms from "./views/integrations/gfms";
import GfmsDataView from "./views/integrations/gfms/GfmsDataView";
import WorkPlansExpenditures from "./views/resources/WorkPlans/WorkPlansExpenditures";
import ProjectsCostsChart from "./views/pages/reports/ProjectsCostsChart";
import Matrix from "./views/pages/DCMatrix";
import ListPBSProjects from "./views/integrations/pbs/list_pbs_projects";
import BudgetAllocations from "./views/integrations/pbs/budget_allocations";

const config = getApplicationConfig();

const RESOURCES = {
  organizational_config: "organizations",
  programs_config: "programs",
  functions_config: "functions",
  fund_config: "funds",
  cost_config: "costings",
  location_config: "locations",
};

function orgStructureMenu(configElement) {
  if (config && config[configElement]) {
    return config[configElement]
      ? Object.keys(config[configElement]).map((key) => (
          <Route
            exact
            path={`/${config[configElement][key].id}`}
            render={(routeProps) => (
              <OrganizationsList
                hasCreate
                filter={{ level: key, is_hidden: false }}
                field={config[configElement][key].id}
                resource={RESOURCES[configElement]}
                basePath={routeProps.match.url}
                level={key}
                config={configElement}
                {...routeProps}
              />
            )}
          />
        ))
      : [];
  }
}

export default (props) => {
  return [
    <Route
      exact
      noLayout
      path="/reset-password"
      render={(props) =>
        checkFeature("has_reset_password_page") ? (
          checkFeature("has_pimis_fields") ? (
            <ResetPasswordPageWithThemePimis {...props} />
          ) : (
            <ResetPasswordPageWithTheme {...props} />
          )
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/report-builder"
      render={(props) =>
        checkFeature("has_report_management") ? (
          <ReportBuilder {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    // <Route
    //   exact
    //   path="/dashboard"
    //   render={() =>
    //     checkFeature("has_pimis_fields") ? <ProjectsList /> : <Dashboard />
    //   }
    // />,
    <Route exact path="/incoming" render={(props) => <Incoming {...props} />} />,
    <Route exact path="/trash" render={() => <ProjectsTrash />} />,
    <Route exact path="/reverted" render={() => <ProjectsReverted />} />,
    <Route exact path="/delegation" render={() => <UserRoleList />} />,
    <Route exact path="/archive" render={() => <Archive />} />,
    <Route exact path="/dc-matrix" render={() => <Matrix />} />,
    <Route exact path="/pbs-projects" render={() => <ListPBSProjects />} />,
    <Route
      exact
      path="/budget-allocations"
      render={() => <BudgetAllocations />}
    />,
    <Route
      exact
      path="/archive-management"
      render={() => <ArchiveManagement />}
    />,
    <Route
      exact
      path="/reports-annual-monitoring-projects"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <QuarterlyAnnualReport {...props} reportType="quarter" />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-consolidated-monitoring-projects"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <ConsolidatedAnnualReport {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-periodic-monitoring-projects"
      render={(props) => {
        return checkFeature("has_pimis_fields") ? (
          <PageInDevelopment />
        ) : checkFeature("has_implementation_reports") ? (
          <QuarterlyAnnualReport {...props} reportType="periodical" />
        ) : (
          <Typography>No Access</Typography>
        );
      }}
    />,
    <Route
      exact
      path="/reports-completion-projects"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <CompletionReportList {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,

    <Route
      exact
      path="/reports-public-investment-plan"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <PublicInvestmentPlan {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-contingency-liability-report"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <ContingencyLiability {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    //implementations
    <Route
      exact
      path="/implementation-module"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <ImplementationModule {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,

    <Route
      exact
      path="/implementation-module/:id/costed-annualized-plan"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <CostedAnnualizedPlanReport {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/cost-plans/:id/list"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <CostPlansList
            {...props}
            basePath="/cost-plans"
            resource="cost-plans"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/cost-plans/:id/report"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <CostPlansShowReport
            {...props}
            basePath="/cost-plans"
            resource="cost-plans"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,

    <Route
      exact
      path="/cost-plans-history/:id/:year"
      render={(props) => (
        <WorkPlansList
          {...props}
          basePath="/cost-plans"
          resource="cost-plans"
          filter={{ cost_plan_type: "ADJUSTED" }}
          isHistory
        />
      )}
    />,

    <Route
      exact
      path="/cost-plans-projected/:id/show"
      render={(props) => (
        <WorkPlansShow
          {...props}
          basePath="/cost-plans"
          resource="cost-plans"
          filter={{ cost_plan_type: "PROJECTED" }}
          showWorkPlan
        />
      )}
    />,

    <Route
      exact
      path="/cost-plans-approved/:id/show"
      render={(props) => (
        <WorkPlansShow
          {...props}
          basePath="/cost-plans"
          resource="cost-plans"
          filter={{ cost_plan_type: "APPROVED" }}
          showWorkPlanApproved
        />
      )}
    />,
    <Route
      exact
      path="/cost-plans-adjusted/:id/show"
      render={(props) => (
        <WorkPlansShowAdjusted
          {...props}
          basePath="/cost-plans"
          resource="cost-plans"
          filter={{ cost_plan_type: "APPROVED" }}
          showWorkPlanAdjusted
        />
      )}
    />,
    <Route
      exact
      path="/cost-plans-monthly/:id/show"
      render={(props) => (
        <WorkPlansShowMonthly
          {...props}
          basePath="/cost-plans"
          resource="cost-plans"
          // filter={{ cost_plan_type: "APPROVED" }}
          showWorkPlanMonthly
        />
      )}
    />,

    <Route
      exact
      path="/implementation-module/:id/myc-form"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <MYCForm {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/implementation-module/:id/costed-annualized-plan/edit"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <CostedAnnualizedPlanEdit {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/myc/:projectId/create"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <MycCreate {...props} basePath={"/projects"} resource="projects" />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/cost-plans/:projectId/create"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <CostPlansCreate
            {...props}
            basePath={"/cost-plans"}
            resource="cost-plans"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/work-plans/:projectId/create"
      render={(props) =>
        checkFeature("has_workplans") ? (
          <WorkPlansCreate
            {...props}
            basePath={"/cost-plans"}
            resource="cost-plans"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    // <Route
    //   exact
    //   path="/appeals/:projectId/create"
    //   render={(props) =>
    //     checkFeature("has_implementation_reports") ? (
    //       <AppealsCreate
    //         {...props}
    //         basePath={"/appeals"}
    //         resource="appeals"
    //       />
    //     ) : (
    //       <Typography>No Access</Typography>
    //     )
    //   }
    // />,
    <Route
      exact
      path="/risk-assessments/:projectId/create"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <RiskAssessmentsCreate
            {...props}
            basePath={"/risk-assessments"}
            resource="risk-assessments"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/risk-assessments/:id/report"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <RiskAssessmentsReport
            {...props}
            basePath="/risk-assessments"
            resource="risk-assessments"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/risk-assessments/:id/list"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          // <RiskAssessmentsList
          //   {...props}
          //   basePath="/risk-assessments"
          //   resource="risk-assessments"
          // />
          <RiskAssessmentsReportManage
            {...props}
            basePath="/risk-assessments"
            resource="risk-assessments"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/human-resources/:id/report"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <HumanResourcesReport
            {...props}
            basePath="/human-resources"
            resource="human-resources"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/human-resources/:projectId/create"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <HumanResourcesCreate
            {...props}
            basePath={"/human-resources"}
            resource="human-resources"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/human-resources/:id/list"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <HumanResourcesList
            {...props}
            basePath="/human-resources"
            resource="human-resources"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/stakeholder-engagements/:id/report"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <StakeholderEngagementsReport
            {...props}
            basePath="/stakeholder-engagements"
            resource="stakeholder-engagements"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/stakeholder-engagements/:projectId/create"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <StakeholderEngagementsCreate
            {...props}
            basePath={"/stakeholder-engagements"}
            resource="stakeholder-engagements"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/stakeholder-engagements/:id/list"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <StakeholderEngagementsReportManage
            {...props}
            basePath="/stakeholder-engagements"
            resource="stakeholder-engagements"
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/appeals/:projectId/create"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <AppealsCreate {...props} basePath={"/appeals"} resource="appeals" />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/appeals/:projectId/list"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <AppealsList {...props} basePath={"/appeals"} resource="appeals" />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/appeals/:projectId/report"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <AppealsReport {...props} basePath={"/appeals"} resource="appeals" />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/appealed-projects"
      render={(props) =>
        checkFeature("project_has_appealed_projects_report") ? (
          <ProjectsList
            filter={{ has_appeals: true }}
            basePath="/projects"
            resource="projects"
            disablePhaseFilter
            disableCreate
            showAppeals
          />
        ) : (
          // <AppealsReport {...props} basePath={"/appeals"} resource="appeals" />
          <Typography>No Access</Typography>
        )
      }
    />,

    // <Route
    //   path="/cost-plans/:projectId/show"
    //   render={(props) =>
    //     checkFeature("has_implementation_reports") ? (
    //       <CostPlansShow
    //         {...props}
    //         basePath={"/cost-plans"}
    //         resource="cost-plans"
    //       />
    //     ) : (
    //       <Typography>No Access</Typography>
    //     )
    //   }
    // />,

    <Route
      exact
      path="/implementation-module/:id/costed-annualized-plan/show"
      render={(props) =>
        checkFeature("has_implementation_reports") ? (
          <CostedAnnualizedPlanShow {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    ///////////------------------------------

    <Route
      exact
      path="/reports-projects-categories"
      render={(props) =>
        checkFeature("has_projects_categories_report") ? (
          <ProjectCategories {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-projects-submitted"
      render={(props) =>
        checkFeature("has_submitted_projects_report") ? (
          <SubmittedProjects {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-projects-donors"
      render={(props) =>
        checkFeature("has_donors_projects_report") ? (
          <DonorsProjects {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-projects-stagnant"
      render={(props) =>
        checkFeature("has_stagnant_projects_report") ? (
          <StagnantProjects {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-projects-for-action"
      render={(props) =>
        checkFeature("has_projects_waiting_actions_report") ? (
          <WaitingProjects {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-pipeline-projects"
      render={(props) =>
        checkFeature("has_pipeline_report") ? (
          <ProjectsPipeline {...props} />
        ) : (
          // <PiplineProjects {...props} />
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-pipeline-projects-portfolio"
      render={(props) =>
        checkFeature("has_pipeline_portfolio_report") ? (
          <PiplineProjectsPortfolio {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-fiscal-load"
      render={(props) =>
        checkFeature("has_fiscal_load_report") ? (
          <FiscalLoad {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-projects-costs-chart"
      render={(props) =>
        checkFeature("has_projects_costs_chart") ? (
          <ProjectsCostsChart {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-project-cost-evaluation"
      render={(props) =>
        checkFeature("has_project_cost_evolution_report") ? (
          <CostEvaluation {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-project-count"
      render={(props) =>
        checkFeature("has_costs_and_counts_report") ? (
          <SectorsCount {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-project-programs-count"
      render={(props) =>
        checkFeature("has_projects_programs_report") ? (
          <ProgramsSumCount {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-ndp-goals"
      render={(props) =>
        checkFeature("has_projects_ndp_goals_report") ? (
          <NDPreport {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-project-functions-count"
      render={(props) =>
        checkFeature("has_projects_functions_report") ? (
          <FunctionsSumCount {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-projects-ranking"
      render={(props) =>
        checkFeature("has_projects_ranking_report") ? (
          <RankingReport {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-project-geo-by-phases"
      render={(props) =>
        checkFeature("has_projects_location_report") ? (
          <ProjectsLocations {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-project-ibp-usage"
      render={(props) =>
        checkFeature("has_ibp_usage_report") ? (
          <IbpUsage {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-project-dc-report"
      render={(props) =>
        checkFeature("has_projects_scheduled_dc_report") ? (
          <ProjectsDc {...props} />
        ) : (
          // <ProjectsDc {...props} />
          // <ReportDC {...props} />
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-projects-repeated"
      render={(props) =>
        checkFeature("has_repeated_projects_report") ? (
          <ProjectsRepeated {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,

    <Route
      exact
      path="/psip-report-view"
      render={(props) =>
        checkFeature("has_psip_report") ? (
          <PSIP {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/completed-report"
      render={(props) =>
        checkFeature("has_completed_projects_report") ? (
          <Completed {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/me-report-view"
      render={(props) =>
        checkFeature("has_me_report") ? (
          <MeReport />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    // <Route exact path="/reports" render={() => <ReportViewer />} />,
    <Route
      exact
      path="/project-portfolio"
      render={(props) =>
        checkFeature("has_project_portfolio") ? (
          <ProjectsPortfolio />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/project-managment"
      render={(props) =>
        checkFeature("has_project_management") ? (
          <ProjectManagment />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/project-resources-managment"
      render={(props) =>
        checkFeature("has_project_resource_management") ? (
          <ProjectResourcesManagment />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/useful-links"
      render={(props) =>
        checkFeature("has_usefull_links_page") ? (
          <UsefulLinksPage />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/gantt-chart"
      render={() => <GanttChart projectBased />}
    />,

    <Route exact path="/workflow-chart" render={() => <WorkflowChart />} />,
    <Route
      exact
      path="/project/:id/myc"
      render={(props) => <MYCDataEntry {...props} />}
    />,
    <Route
      exact
      path="/reports-myc"
      render={(props) =>
        checkFeature("project_has_myc_report") ? (
          <MycReport {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/rank-projects"
      render={(props) =>
        checkFeature("project_has_project_ranking_report") ? (
          <RankingProjectsList {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/prioritize-projects"
      render={(props) =>
        checkFeature("project_has_project_ranking_report") ? (
          <ProjectsPrioritization {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/reports-ranking-projects"
      render={(props) =>
        checkFeature("project_has_project_ranking_report") ? (
          <RankingProjectsReport {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,

    <Route
      exact
      path="/project/:id/me-report/create/:year"
      render={(props) => <MEReportsCreate {...props} />}
    />,

    <Route
      exact
      path="/project/:id/me-reports/:report_type"
      render={(props) => <MEReportsList {...props} />}
    />,
    <Route
      exact
      path="/project/:id/me-reports"
      render={(props) => <MEReportsList {...props} />}
    />,
    <Route
      exact
      path="/project/:id/completion-report"
      render={(props) => <CompletionReport {...props} />}
    />,

    <Route
      exact
      path="/project-completion/:id/create"
      render={(props) => <ProjectCompletionCreate {...props} />}
    />,
    // <Route
    //   exact
    //   path="/project-completion/:id/view"
    //   render={(props) => <ProjectCompletionShow {...props} />}
    // />,

    <Route
      exact
      path="/project/:id/public-investment-plan-report"
      render={(props) => <PipReport {...props} />}
    />,
    <Route
      exact
      path="/project/:id/contingency-liability-report"
      render={(props) => <ContingencyLiabilityReport {...props} />}
    />,
    ...orgStructureMenu("organizational_config"),
    ...orgStructureMenu("cost_config"),
    ...orgStructureMenu("fund_config"),
    ...orgStructureMenu("programs_config"),
    ...orgStructureMenu("functions_config"),
    ...orgStructureMenu("location_config"),
    // ----------- new menu structure -----------
    <Route
      exact
      path="/concepts"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 1 }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
        />
      )}
    />,
    <Route
      exact
      path="/proposals"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 2 }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
        />
      )}
    />,
    <Route
      exact
      path="/budjet-proposals"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 3 }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
        />
      )}
    />,
    <Route
      exact
      path="/gantt_chart"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 4, is_pm_enabled: true }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
          showPM
        />
      )}
    />,

    <Route
      exact
      path="/work_plan"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 4, is_pm_enabled: true }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
          showWorkPlan
        />
      )}
    />,
    <Route
      exact
      path="/work_plan_approved"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 4, is_pm_enabled: true }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
          showWorkPlanApproved
        />
      )}
    />,
    <Route
      exact
      path="/work_plan_adjusted"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 4, is_pm_enabled: true }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
          showWorkPlanAdjusted
        />
      )}
    />,
    <Route
      exact
      path="/work_plan_monthly"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 4, is_pm_enabled: true }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
          showWorkPlanMonthly
        />
      )}
    />,
    <Route
      exact
      path="/expenditures"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 4, is_pm_enabled: true }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
          showExpenditures
        />
      )}
    />,
    <Route
      exact
      path="/expenditures/:id/show"
      render={(props) => (
        <WorkPlansExpenditures
          {...props}
          basePath="/cost-plans"
          resource="cost-plans"
          filter={{ cost_plan_type: "APPROVED" }}
          showExpenditures
        />
      )}
    />,

    <Route
      exact
      path="/cost_estimates"
      render={(props) => (
        <CustomPage
          links={[
            {
              title: "Cost Estimates",
              items: [
                {
                  link: "/annualized",
                  name: "Annualized",
                  icon: <DateRangeIcon />,
                },
                { link: "/monthly", name: "Monthly", icon: <TodayIcon /> },
              ],
            },
          ]}
        />
      )}
    />,
    <Route
      exact
      path="/classifiers"
      render={(props) => (
        <CustomPage
          links={[
            {
              title: "Сlassifiers",
              items: [
                {
                  link: "/ministry",
                  name: "Ministry",
                  icon: <DomainIcon />,
                  filter: { is_hidden: 0 },
                },
                {
                  link: "/departments",
                  name: "Departments",
                  icon: <DomainIcon />,
                  filter: { is_hidden: 0 },
                },
                {
                  link: "/public_body",
                  name: "Public body",
                  icon: <ApartmentIcon />,
                  filter: { is_hidden: 0 },
                },
                {
                  link: "/function",
                  name: "Function",
                  icon: <AssignmentTurnedInIcon />,
                },
                {
                  link: "/sub_function",
                  name: "Sub Function",
                  icon: <PlaylistAddCheckIcon />,
                },
                {
                  link: "/programme",
                  name: "Programme",
                  icon: <ImportContactsIcon />,
                },
                {
                  link: "/sub_programme",
                  name: "Sub Programme",
                  icon: <MenuBookIcon />,
                },
                {
                  link: "/fund_sources",
                  name: "Agencies",
                  icon: <LocationCityIcon />,
                },
                { link: "/cost_class", name: "Class", icon: <ReceiptIcon /> },
                { link: "/cost_object", name: "Object", icon: <NoteIcon /> },
                { link: "/parish", name: "Parish", icon: <MapIcon /> },
                {
                  link: "/constituency",
                  name: "Constituency",
                  icon: <RoomIcon />,
                },
              ],
            },
          ]}
        />
      )}
    />,
    <Route
      exact
      path="/user_mgmt"
      render={(props) => (
        <CustomPage
          links={[
            {
              title: "User Management",
              items: [
                {
                  link: "/users",
                  name: "Users",
                  icon: <AssignmentIndIcon />,
                },
                {
                  link: "/roles",
                  name: "Roles",
                  icon: <VerifiedUserIcon />,
                },
                {
                  link: "/delegation",
                  name: "Delegation",
                  icon: <GroupAddIcon />,
                },
              ],
            },
          ]}
        />
      )}
    />,
    <Route
      exact
      path="/resources"
      render={(props) => (
        <CustomPage
          links={[
            {
              title: "Resources",
              items: [
                {
                  link: "/phases",
                  name: "Phase",
                  icon: <NetworkCheckIcon />,
                },
                {
                  link: "/workflows",
                  name: "Workflow",
                  icon: <UpdateIcon />,
                },
                {
                  name: "M&E Workflow",
                  link: "/me-workflows",
                  icon: <AccountTreeIcon />,
                  feature: "has_me_project_reporting",
                  permission: "edit_workflows",
                },
                {
                  name: "Reverted Projects",
                  link: "/reverted",
                  icon: <DeleteOutlineOutlined />,
                  permission: "revert_project",
                },
                {
                  name: "Recycle bin",
                  link: "/trash",
                  icon: <DeleteOutlineOutlined />,
                  permission: "access_deleted_project",
                },
                {
                  name: "File Types",
                  link: "/file-types",
                  icon: <AttachFileIcon />,
                  permission: "edit_file_types",
                },
                {
                  name: "Units",
                  link: "/units",
                  icon: <FormatListBulletedIcon />,
                  permission: "edit_units",
                },
                {
                  name: "Currency",
                  link: "/currencies",
                  icon: <MonetizationOnIcon />,
                  permission: "edit_currencies",
                },
                {
                  name: "Currency Rates",
                  link: "/currency-rates",
                  icon: <AttachMoneyIcon />,
                  permission: "edit_currency_rate_rates",
                },
                {
                  name: "System Parameters",
                  link: "/parameters",
                  icon: <PermDataSettingIcon />,
                  permission: "edit_parameters",
                },
                {
                  name: "Sectors",
                  link: "/sectors",
                  icon: <StorageIcon />,
                  permission: "edit_sectors",
                },
              ],
            },
          ]}
        />
      )}
    />,
    <Route
      exact
      path="/reports_list"
      render={(props) => (
        <CustomPage
          isReport
          links={[
            {
              title: "Reports",
              items: [
                {
                  name: "Projects in Pipeline",
                  link: "/reports-pipeline-projects",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_pipeline_report",
                  translation: "navigation.reports.pipeline_report",
                },
                {
                  name: "Public Investment Portfolio",
                  link: "/reports-pipeline-projects-portfolio",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_pipeline_portfolio_report",
                  translation: "navigation.reports.pipeline_report_portfolio",
                },
                {
                  name: "Projects Completed",
                  link: "/completed-report",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_completed_projects_report",
                  translation: "navigation.reports.completed_projects_report",
                },
                {
                  name: "Pipline of Projects",
                  link: "/reports-pipeline-projects",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_pipeline_of_projects_report",
                  translation: "navigation.reports.pipeline_of_projects_report",
                },
                {
                  name: "Fiscal Load",
                  link: "/reports-fiscal-load",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_fiscal_load_report",
                  translation: "navigation.reports.fiscal_load_report",
                },
                {
                  name: "Project Cost Evolution",
                  link: "/reports-project-cost-evaluation",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_project_cost_evolution_report",
                  translation:
                    "navigation.reports.project_cost_evolution_report",
                },
                {
                  name: "Project Costs and Counts at different stages of the Development Cycle",
                  link: "/reports-project-count",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_costs_and_counts_report",
                  translation: "navigation.reports.costs_and_counts_report",
                },
                {
                  name: "Projects Ranking",
                  link: "/reports-projects-ranking",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_projects_ranking_report",
                  translation: "navigation.reports.projects_ranking_report",
                },
                {
                  name: "Project Locations",
                  link: "/reports-project-geo-by-phases",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_projects_location_report",
                  translation: "navigation.reports.projects_location_report",
                },
                {
                  name: "IBP User Action Tracking Report",
                  link: "/reports-project-ibp-usage",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_ibp_usage_report",
                  translation: "navigation.reports.ibp_usage_report",
                },
                {
                  name: "Projects Scheduled for DC",
                  link: "/reports-project-dc-report",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_projects_scheduled_dc_report",
                  translation:
                    "navigation.reports.projects_scheduled_dc_report",
                },
                {
                  name: "Projects waiting for action",
                  link: "/reports-projects-for-action",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_projects_waiting_actions_report",
                  translation:
                    "navigation.reports.projects_waiting_actions_report",
                },
                {
                  name: "Stagnant Projects",
                  link: "/reports-projects-stagnant",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_stagnant_projects_report",
                  translation: "navigation.reports.stagnant_projects_report",
                },
                {
                  name: "Donor Projects",
                  link: "/reports-projects-donors",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_donors_projects_report",
                  translation: "navigation.reports.donors_projects_report",
                },
                {
                  name: "Submitted Projects",
                  link: "/reports-projects-submitted",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_submitted_projects_report",
                  translation: "navigation.reports.submitted_projects_report",
                },
                {
                  name: "Repeated Projects",
                  link: "/reports-projects-repeated",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_repeated_projects_report",
                  translation: "navigation.reports.repeated_projects_report",
                },
                {
                  name: "Projects by Categories",
                  link: "/reports-projects-categories",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_projects_categories_report",
                  translation: "navigation.reports.projects_categories_report",
                },
                {
                  name: "Project Programs Counts and Costs",
                  link: "/reports-project-programs-count",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_projects_programs_report",
                  translation: "navigation.reports.projects_programs_report",
                },
                {
                  name: "Project Functions Counts and Costs",
                  link: "/reports-project-functions-count",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_projects_functions_report",
                  translation: "navigation.reports.projects_functions_report",
                },
                {
                  name: "NDP goals and strategies report",
                  link: "/reports-ndp-goals",
                  icon: <TableChartIcon />,
                  permission: "list_reports",
                  feature: "has_projects_ndp_goals_report",
                  translation: "navigation.reports.projects_ndp_report",
                },
              ],
            },
          ]}
        />
      )}
    />,

    <Route
      exact
      path="/warrant_req"
      render={(props) => <PageInDevelopment />}
    />,
    <Route exact path="/monthly" render={(props) => <PageInDevelopment />} />,
    <Route
      exact
      path="/annualized"
      render={(props) => <PageInDevelopment />}
    />,
    <Route
      exact
      path="/log_frame"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 4, is_logical_framework_editable: true }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
        />
      )}
    />,
    <Route
      exact
      path="/achieve-targets/:projectDetailsId/:achieveType"
      render={(props) => <AchieveTargets {...props} />}
    />,
    <Route
      exact
      path="/achieve-sub-targets/:indicatorId"
      render={(props) => <AchieveSubTargets {...props} />}
    />,
    <Route
      exact
      path="/reports-indicators-projects"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 4, is_indicator_editable: true }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
          showIndicators
        />
      )}
    />,
    <Route
      exact
      path="/project-indicators/:projectId"
      render={(props) => <IndicatorsPage {...props} />}
    />,

    <Route
      exact
      path="/independent_monitoring"
      render={(props) => (
        <ProjectsList
          filter={{ phase_id: 4, is_pm_enabled: true }}
          basePath="/projects"
          resource="projects"
          disablePhaseFilter
          disableCreate
        />
      )}
    />,
    <Route
      exact
      path="/query_builder"
      render={(props) => <PageInDevelopment />}
    />,
    <Route
      exact
      path="/amp"
      render={(props) =>
        checkFeature("has_integrations_amp") ? (
          <IntegrationsAmp {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/bpms"
      render={(props) =>
        checkFeature("has_integrations_bmps") ? (
          <IntegrationsBpms {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/gfms"
      render={(props) =>
        checkFeature("has_integrations_gfms") ? (
          <IntegrationsGfms {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/gfms_data/:id/show"
      render={(props) =>
        checkFeature("has_integrations_gfms") ? (
          <GfmsDataView {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/gfms_data"
      render={(props) =>
        checkFeature("has_integrations_gfms") ? (
          <ProjectsList
            filter={{ phase_id: 4 }}
            basePath="/projects"
            resource="projects"
            disablePhaseFilter
            disableCreate
            showGfmsData
          />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/pbs"
      render={(props) =>
        checkFeature("has_integrations_pbs") ? (
          <IntegrationsPbs {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/ndp"
      render={(props) =>
        checkFeature("has_integrations_ndp") ? (
          <IntegrationsNdp {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
    <Route
      exact
      path="/ifmis"
      render={(props) =>
        checkFeature("has_integrations_ifmis") ? (
          <IntegrationsIfmis {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,

    <Route
      exact
      path="/validation"
      render={(props) =>
        checkFeature("has_validation_panel") ? (
          <ValidationForm {...props} />
        ) : (
          <Typography>No Access</Typography>
        )
      }
    />,
  ];
};

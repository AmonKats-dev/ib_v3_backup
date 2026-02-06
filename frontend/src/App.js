import React from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import { authProvider, dataProvider, uploaderWrapper } from "./data/providers";
import { API_URL } from "./constants/config";
import { ResponsiveLayout } from "./ui/layouts";
import customRoutes from "./customRoutes";
import i18nProvider from "./data/providers/i18nProvider";
import { userReducer, uiReducer, appReducer } from "./data/reducers";
import theme from "./ui/theme";
import Roles from "./views/resources/Roles";
import Users from "./views/resources/Users";
import Projects from "./views/resources/Projects";
import LoginPage from "./views/pages/LoginPage";
import LoginPagePimis from "./views/pages/LoginPagePimis";
import Phases from "./views/resources/Phases";
import Organizations from "./views/resources/Organizations";
import Workflow from "./views/resources/Workflow";
import MeWorkflow from "./views/resources/MeWorkflow";
import FileTypes from "./views/resources/FileTypes";
import Units from "./views/resources/Units";
import Currencies from "./views/resources/Currencies";
import CurrencyRates from "./views/resources/CurrencyRates";
import Dashboard from "./views/pages/Dashboard";
import NotificationsList from "./views/resources/Notifications";
import MEReportsEdit from "./views/resources/Projects/ProjectMonitorings/MEReportsEdit";
import MEReportsCreate from "./views/resources/Projects/ProjectMonitorings/MEReportsCreate";
import ProjectManagementEdit from "./views/resources/ProjectManagement/ProjectManagementEdit";
import UserRoles from "./views/resources/UserRoles";
import Parameters from "./views/resources/Parameters";
import NdpGoals from "./views/resources/Ndp/Goals";
import NdpOutcomes from "./views/resources/Ndp/Outcomes";
import NdpStrategies from "./views/resources/Ndp/Strategies";
import NdpSdgs from "./views/resources/Ndp/Sdgs";
import NdpMtfs from "./views/resources/Ndp/Mtfs";
import { Redirect } from "react-router-dom";
import MEReportsShow from "./views/resources/Projects/ProjectMonitorings/MEReportsShow";
import { RESET_PASSWORD_PAGE } from "./constants/auth";
import Sectors from "./views/resources/Sectors";
import ReportBuilder from "./views/resources/ReportBuilder";
import CostPlans from "./views/resources/CostPlans";
import StakeholderEngagements from "./views/resources/StakeholderEngagements";
import HumanResources from "./views/resources/HumanResources";
import RiskAssessments from "./views/resources/RiskAssessments";
import { checkFeature } from "./helpers/checkPermission";
import ProjectCompletion from "./views/resources/ProjectCompletion";
import WorkPlans from "./views/resources/WorkPlans";
import WorkflowInstances from "./views/resources/WorkflowInstances";
import SimpleHelpers from "./views/resources/SimpleHelpers";
import IndicatorsShow from "./views/modules/IndicatorsPage/IndicatorsShow";
import Appeals from "./views/resources/Appeals";
import ErrorBoundary from "./views/resources/Projects/ProjectForms/ErrorBoundary";

export const DataProvider = dataProvider(API_URL);

function App() {
  return (
    <ErrorBoundary>
      <Admin
        title="AppTitle"
        theme={theme}
        dataProvider={DataProvider}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
        layout={ResponsiveLayout}
        customRoutes={customRoutes()}
        customReducers={{ ui: uiReducer, user: userReducer, app: appReducer }}
        loginPage={
          checkFeature("has_pimis_fields") ? LoginPagePimis : LoginPage
        }
      >
        {(permissions) => {
          const resetPassword = localStorage.getItem(RESET_PASSWORD_PAGE);
          if (!permissions || (permissions && permissions.length === 0)) {
            if (!resetPassword) {
              return [<Redirect key="to-login" to="login" />];
            }
          }
          return [
            !checkFeature("has_pimis_fields") && (
              <Resource name="dashboard" list={Dashboard} />
            ),
            <Resource name="projects" {...Projects} />,
            <Resource name="users" {...Users} />,
            <Resource name="roles" {...Roles} />,
            <Resource name="countries" list={ListGuesser} />,
            <Resource name="currencies" {...Currencies} />,
            <Resource name="currency-rates" {...CurrencyRates} />,
            <Resource name="cycles" list={ListGuesser} />,
            <Resource name="media" list={ListGuesser} />,
            <Resource name="phases" {...Phases} />,
            <Resource name="uploads" list={ListGuesser} />,
            <Resource name="interventions" list={ListGuesser} />,

            <Resource name="workflow-instances" {...WorkflowInstances} />,
            <Resource name="workflows" {...Workflow} />,
            <Resource name="user-roles" list={ListGuesser} />,
            <Resource name="permissions" list={ListGuesser} />,
            <Resource name="parameters" {...Parameters} />,
            <Resource name="project-details" {...Projects} />,
            <Resource name="file-types" {...FileTypes} />,

            <Resource name="units" {...Units} />,
            <Resource name="disaggregation-types" {...SimpleHelpers} />,
            <Resource name="formats" {...SimpleHelpers} />,
            <Resource name="frequencies" {...SimpleHelpers} />,
            <Resource
              name="indicators"
              {...SimpleHelpers}
              show={IndicatorsShow}
            />,

            <Resource name="organizations" {...Organizations} />,
            <Resource name="programs" {...Organizations} />,
            <Resource name="functions" {...Organizations} />,
            <Resource name="costings" {...Organizations} />,
            <Resource name="funds" {...Organizations} />,
            <Resource name="locations" {...Organizations} />,
            <Resource name="reports" list={ListGuesser} />,
            <Resource name="notifications" list={NotificationsList} />,
            <Resource name="ndp-goals" {...NdpGoals} />,
            <Resource name="ndp-outcomes" {...NdpOutcomes} />,
            <Resource name="ndp-strategies" {...NdpStrategies} />,
            <Resource name="ndp-sdgs" {...NdpSdgs} />,
            <Resource name="ndp-mtfs" {...NdpMtfs} />,
            <Resource name="sectors" {...Sectors} />,
            <Resource
              name="me-reports"
              list={ListGuesser}
              edit={MEReportsEdit}
              show={MEReportsShow}
              create={MEReportsCreate}
            />,

            <Resource
              name="project-management"
              list={ListGuesser}
              edit={ProjectManagementEdit}
            />,
            <Resource name="me-workflows" {...MeWorkflow} />,

            checkFeature("has_custom_reports") && (
              <Resource name="custom-reports" {...ReportBuilder} />
            ),

            checkFeature("has_implementation_reports") && (
              <Resource name="cost-plans" {...CostPlans} />
            ),
            checkFeature("has_workplans") && (
              <Resource name="cost-plans" {...WorkPlans} />
            ),

            checkFeature("has_implementation_reports") && (
              <Resource name="risk-assessments" {...RiskAssessments} />
            ),
            checkFeature("has_implementation_reports") && (
              <Resource
                name="stakeholder-engagements"
                {...StakeholderEngagements}
              />
            ),
            checkFeature("has_implementation_reports") && (
              <Resource name="human-resources" {...HumanResources} />
            ),
            checkFeature("has_project_completion") && (
              <Resource name="project-completion" {...ProjectCompletion} />
            ),
            checkFeature("has_appeals") && (
              <Resource name="appeals" {...Appeals} />
            ),
          ];
        }}
      </Admin>
    </ErrorBoundary>
  );
}

export default App;

import React, { forwardRef, useEffect, useState } from "react";

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AssessmentIcon from "@material-ui/icons/Assessment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { DeleteOutlineOutlined } from "@material-ui/icons";
import InboxIcon from "@material-ui/icons/Inbox";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import LinkIcon from "@material-ui/icons/Link";
import ListIcon from "@material-ui/icons/List";
import NextWeekIcon from "@material-ui/icons/NextWeek";
import PeopleIcon from "@material-ui/icons/People";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import SecurityIcon from "@material-ui/icons/Security";
import TableChartIcon from "@material-ui/icons/TableChart";
import TuneIcon from "@material-ui/icons/Tune";
import { getApplicationConfig } from "./constants/config";

const config = getApplicationConfig();

const PERMISSIONS = {
  organizational_config: "edit_organizations",
  programs_config: "edit_programs",
  functions_config: "edit_functions",
  fund_config: "edit_funds",
  cost_config: "edit_costings",
  location_config: "edit_locations",
};

function orgStructureMenu(configElement) {
  if (config && config[configElement]) {
    return config[configElement]
      ? Object.keys(config[configElement]).map((key) => ({
          title: config[configElement][key].name,
          translation: `navigation.${configElement}.${key}`,
          href: `/${config[configElement][key].id}`,
          icon: <FormatListBulletedIcon />,
          permission: PERMISSIONS[configElement],
        }))
      : [];
  }
}

export default [
{
    title: "Home",
    href: "/dashboard",
    icon: <DashboardIcon />,
    permission: "list_projects",
  },
  {
    title: "Incoming",
    href: "/incoming",
    icon: <InboxIcon />,
    permission: "list_projects",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: <NextWeekIcon />,
    permission: "list_projects",
  },
  {
    title: "Pre-Investment",
    href: "/pre_investment",
    icon: <FormatListBulletedIcon />,
    permission: "list_projects",
    children: [
      {
        title: "Concepts",
        href: "/concepts",
        icon: <Filter1Icon />,
        permission: "list_projects",
      },
      {
        title: "Proposals",
        href: "/proposals",
        icon: <Filter2Icon />,
        permission: "list_projects",
      },
    ],
  },
  {
    title: "Project Management",
    href: "/project_mgmt",
    icon: <FormatListBulletedIcon />,
    permission: "list_projects",
    children: [
      {
        title: "Gantt Chart",
        href: "/gantt_chart",
        icon: <EqualizerIcon />,
        permission: "list_projects",
      },
      {
        title: "Cost Estimates",
        href: "/cost_estimates",
        icon: <AccountBalanceIcon />,
        permission: "list_projects",
      },
      {
        title: "Warrant Request",
        href: "/warrant_req",
        icon: <SecurityIcon />,
        permission: "list_projects",
      },
    ],
  },
  {
    title: "M&E Management",
    href: "/me_mgmt",
    icon: <FormatListBulletedIcon />,
    permission: "list_projects",
    children: [
      {
        title: "Log Frame",
        href: "/log_frame",
        icon: <AccountTreeIcon />,
        permission: "list_projects",
      },
    ],
  },
  {
    title: "Portfolio Management",
    href: "/portfolio_mgmt",
    icon: <FormatListBulletedIcon />,
    permission: "list_projects",
    children: [
      {
        title: "Query Builder",
        href: "/query_builder",
        icon: <QueryBuilderIcon />,
        permission: "list_projects",
      },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <FormatListBulletedIcon />,
    permission: "list_reports",
    feature: "has_report_management",
    children: [
      {
        title: "Report Builder",
        href: "/report-builder",
        icon: <TableChartIcon />,
        permission: "view_report_builder",
      },
      {
        title: "Reports",
        href: "/reports_list",
        icon: <AssessmentIcon />,
      },
    ],
  },
  {
    title: "Admin",
    href: "/admin",
    icon: <FormatListBulletedIcon />,
    permission: "full_access",
    children: [
      {
        title: "User Management",
        href: "/user_mgmt",
        icon: <PeopleIcon />,
        permission: "edit_users",
      },
      {
        title: "Classifiers",
        href: "/classifiers",
        icon: <FormatListBulletedIcon />,
        permission: "full_access",
      },
      {
        title: "Resources",
        href: "/resources",
        icon: <TuneIcon />,
        permission: "create_resources",
      },
    ],
  },
    {
      title: "Links",
      href: "/useful-links",
      icon: <LinkIcon />,
      feature: "has_usefull_links_page",
    },
  //   {
  //     title: "Projects",
  //     href: "/projects",
  //     icon: <NextWeekIcon />,
  //     permission: "list_projects",
  //   },
  //   {
  //     title: "Prioritize Projects",
  //     href: "/ranking",
  //     icon: <TableChartIcon />,
  //     permission: "list_projects",
  //     feature: "project_has_project_ranking",
  //     translation: "navigation.reports.projects_ranking",
  //   },
  //   {
  //     title: "Report Manager",
  //     href: "reports_management",
  //     icon: <AssessmentIcon />,
  //     permission: "list_reports",
  //     feature: "has_report_management",
  //     children: [
  //       {
  //         title: "Report Builder",
  //         href: "/report-builder",
  //         icon: <TableChartIcon />,
  //         permission: "view_report_builder",
  //       },
  //       // {
  //       //   title: "Report Viewer",
  //       //   href: "/reports",
  //       //   icon: <EqualizerIcon />,
  //       //   permission: "view_report_viewer",
  //       // },
  //     ],
  //   },
  //   {
  //     title: "Implementation Reports",
  //     href: "implement_reports",
  //     icon: <AssessmentIcon />,
  //     feature: "has_implementation_reports",
  //     permission: "list_reports",
  //     children: [
  //       {
  //         title: "Contingency Liability Report",
  //         href: "/reports-contingency-liability-report",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         translation: "navigation.reports.projects_contingency_liability_report",
  //       },
  //       {
  //         title: "Public Investment Plan Report",
  //         href: "/reports-public-investment-plan",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         translation: "navigation.reports.projects_public_investment_plan_report",
  //       },
  //       {
  //         title: "Project Completion Report",
  //         href: "/reports-completion-projects",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         translation: "navigation.reports.projects_completion_report",
  //       },
  //       {
  //         title: "Periodic Project Monitoring Report",
  //         href: "/reports-periodic-monitoring-projects",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         translation: "navigation.reports.projects_monitoring_report",
  //       },
  //       {
  //         title: "Quarterly/Semi-Annual/Annual project progress Report ",
  //         href: "/reports-annual-monitoring-projects",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         translation: "navigation.reports.projects_progress_report",
  //       },
  //       {
  //         title: "MYC Report",
  //         href: "/reports-myc",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "project_has_myc_report",
  //         translation: "navigation.reports.projects_myc_report",
  //       },
  //       {
  //         title: "Project Prioritization Report",
  //         href: "/reports-ranking-projects",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "project_has_project_ranking_report",
  //         translation: "navigation.reports.project_ranking_report",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Reports",
  //     href: "reports",
  //     icon: <AssessmentIcon />,
  //     permission: "list_reports",
  //     children: [
  //       {
  //         title: "Projects in Pipeline",
  //         href: "/reports-pipeline-projects",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_pipeline_report",
  //         translation: "navigation.reports.pipeline_report",
  //       },
  //       {
  //         title: "Public Investment Portfolio",
  //         href: "/reports-pipeline-projects-portfolio",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_pipeline_portfolio_report",
  //         translation: "navigation.reports.pipeline_report_portfolio",
  //       },
  //       {
  //         title: "Projects Completed",
  //         href: "/completed-report",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_completed_projects_report",
  //         translation: "navigation.reports.completed_projects_report",
  //       },
  //       {
  //         title: "Pipline of Projects",
  //         href: "/reports-pipeline-projects",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_pipeline_of_projects_report",
  //         translation: "navigation.reports.pipeline_of_projects_report",
  //       },
  //       {
  //         title: "Fiscal Load",
  //         href: "/reports-fiscal-load",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_fiscal_load_report",
  //         translation: "navigation.reports.fiscal_load_report",
  //       },
  //       {
  //         title: "Project Cost Evolution",
  //         href: "/reports-project-cost-evaluation",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_project_cost_evolution_report",
  //         translation: "navigation.reports.project_cost_evolution_report",
  //       },
  //       {
  //         title:
  //           "Project Costs and Counts at different stages of the Development Cycle",
  //         href: "/reports-project-count",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_costs_and_counts_report",
  //         translation: "navigation.reports.costs_and_counts_report",
  //       },
  //       {
  //         title: "Projects Ranking",
  //         href: "/reports-projects-ranking",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_projects_ranking_report",
  //         translation: "navigation.reports.projects_ranking_report",
  //       },
  //       {
  //         title: "Project Locations",
  //         href: "/reports-project-geo-by-phases",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_projects_location_report",
  //         translation: "navigation.reports.projects_location_report",
  //       },
  //       {
  //         title: "IBP User Action Tracking Report",
  //         href: "/reports-project-ibp-usage",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_ibp_usage_report",
  //         translation: "navigation.reports.ibp_usage_report",
  //       },
  //       {
  //         title: "Projects Scheduled for DC",
  //         href: "/reports-project-dc-report",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_projects_scheduled_dc_report",
  //         translation: "navigation.reports.projects_scheduled_dc_report",
  //       },
  //       {
  //         title: "Projects waiting for action",
  //         href: "/reports-projects-for-action",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_projects_waiting_actions_report",
  //         translation: "navigation.reports.projects_waiting_actions_report",
  //       },
  //       {
  //         title: "Stagnant Projects",
  //         href: "/reports-projects-stagnant",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_stagnant_projects_report",
  //         translation: "navigation.reports.stagnant_projects_report",
  //       },
  //       {
  //         title: "Donor Projects",
  //         href: "/reports-projects-donors",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_donors_projects_report",
  //         translation: "navigation.reports.donors_projects_report",
  //       },
  //       {
  //         title: "Submitted Projects",
  //         href: "/reports-projects-submitted",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_submitted_projects_report",
  //         translation: "navigation.reports.submitted_projects_report",
  //       },
  //       {
  //         title: "Repeated Projects",
  //         href: "/reports-projects-repeated",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_repeated_projects_report",
  //         translation: "navigation.reports.repeated_projects_report",
  //       },
  //       {
  //         title: "Projects by Categories",
  //         href: "/reports-projects-categories",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_projects_categories_report",
  //         translation: "navigation.reports.projects_categories_report",
  //       },
  //       {
  //         title: "Project Programs Counts and Costs",
  //         href: "/reports-project-programs-count",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_projects_programs_report",
  //         translation: "navigation.reports.projects_programs_report",
  //       },
  //       {
  //         title: "Project Functions Counts and Costs",
  //         href: "/reports-project-functions-count",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_projects_functions_report",
  //         translation: "navigation.reports.projects_functions_report",
  //       },
  //       {
  //         title: "NDP goals and strategies report",
  //         href: "/reports-ndp-goals",
  //         icon: <TableChartIcon />,
  //         permission: "list_reports",
  //         feature: "has_projects_ndp_goals_report",
  //         translation: "navigation.reports.projects_ndp_report",
  //       },
  //     ],
  //   },
  //   {
  //     title: "User Management",
  //     href: "user_managment",
  //     icon: <PeopleIcon />,
  //     permission: "edit_permissions",
  //     children: [
  //       {
  //         title: "Users",
  //         href: "/users",
  //         icon: <AccountBoxIcon />,
  //         permission: "edit_users",
  //       },
  //       {
  //         title: "Roles",
  //         href: "/roles",
  //         icon: <SecurityIcon />,
  //         permission: "edit_roles",
  //       },
  //       {
  //         title: "User Delegations",
  //         href: "/delegation",
  //         icon: <AccountBoxIcon />,
  //         permission: "edit_users",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Strategic Objectives",
  //     href: "ndp_project",
  //     icon: <HomeWorkIcon />,
  //     permission: "edit_ndp",
  //     feature: "has_pimis_fields",
  //     children: [
  //       {
  //         title: "Goals",
  //         href: `/ndp-goals`,
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_ndp",
  //       },
  //       {
  //         title: "Outcomes",
  //         href: `/ndp-outcomes`,
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_ndp",
  //       },
  //       {
  //         title: "SDGs",
  //         href: `/ndp-sdgs`,
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_ndp",
  //       },
  //       {
  //         title: "MTFs",
  //         href: `/ndp-mtfs`,
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_ndp",
  //       },
  //       {
  //         title: "Strategies",
  //         href: `/ndp-strategies`,
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_ndp",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Org Structure",
  //     href: "org_structure",
  //     icon: <HomeWorkIcon />,
  //     permission: "edit_organizations",
  //     children: orgStructureMenu("organizational_config"),
  //   },
  //   {
  //     title: "Programs",
  //     href: "Programs",
  //     icon: <HomeWorkIcon />,
  //     permission: "edit_programs",
  //     children: orgStructureMenu("programs_config"),
  //   },
  //   {
  //     title: "Functions",
  //     href: "functions",
  //     icon: <HomeWorkIcon />,
  //     permission: "edit_functions",
  //     feature: "project_has_functions",
  //     children: orgStructureMenu("functions_config"),
  //   },
  //   {
  //     title: "Funds",
  //     href: "funds",
  //     icon: <AccountBalanceIcon />,
  //     permission: "edit_funds",
  //     children: orgStructureMenu("fund_config"),
  //   },
  //   {
  //     title: "Costs",
  //     href: "costs",
  //     icon: <AccountBalanceIcon />,
  //     permission: "edit_costings",
  //     children: orgStructureMenu("cost_config"),
  //   },
  //   {
  //     title: "Locations",
  //     href: "locations",
  //     icon: <AccountBalanceIcon />,
  //     permission: "edit_locations",
  //     children: orgStructureMenu("location_config"),
  //   },

  //   {
  //     title: "Resources",
  //     href: "resources",
  //     icon: <TuneIcon />,
  //     permission: "create_resources",
  //     children: [
  //       {
  //         title: "Phases",
  //         href: "/phases",
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_phases",
  //       },
  //       {
  //         title: "Workflow",
  //         href: "/workflows",
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_workflows",
  //       },
  //       {
  //         title: "M&E Workflow",
  //         href: "/me-workflows",
  //         icon: <FormatListBulletedIcon />,
  //         feature: "has_me_project_reporting",
  //         permission: "edit_workflows",
  //       },
  //       {
  //         title: "File Types",
  //         href: "/file-types",
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_file_types",
  //       },
  //       {
  //         title: "Units",
  //         href: "/units",
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_units",
  //       },
  //       {
  //         title: "Currency",
  //         href: "/currencies",
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_currencies",
  //       },
  //       {
  //         title: "Currency Rates",
  //         href: "/currency-rates",
  //         icon: <AttachMoneyIcon />,
  //         permission: "edit_currency_rate_rates",
  //       },
  //       {
  //         title: "System Parameters",
  //         href: "/parameters",
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_parameters",
  //       },
  //       {
  //         title: "Sectors",
  //         href: "/sectors",
  //         icon: <FormatListBulletedIcon />,
  //         permission: "edit_sectors",
  //       },

  //     ],
  //   },
  //   {
  //     title: "Recycle bin",
  //     href: "/trash",
  //     icon: <DeleteOutlineOutlined />,
  //     permission: "access_deleted_project",
  //   },
  //   {
  //     title: "Reverted Projects",
  //     href: "/reverted",
  //     icon: <DeleteOutlineOutlined />,
  //     permission: "revert_project",
  //   },
  //   {
  //     title: "Useful Links",
  //     href: "/useful-links",
  //     icon: <LinkIcon />,
  //     feature: "has_usefull_links_page",
  //   },
];

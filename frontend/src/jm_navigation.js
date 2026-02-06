import React, { forwardRef, useEffect, useState } from "react";

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import AssessmentIcon from "@material-ui/icons/Assessment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { DeleteOutlineOutlined } from "@material-ui/icons";
import InboxIcon from "@material-ui/icons/Inbox";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import Filter1Icon from "@material-ui/icons/Filter1";
import Filter2Icon from "@material-ui/icons/Filter2";
import Filter3Icon from "@material-ui/icons/Filter3";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import LinkIcon from "@material-ui/icons/Link";
import ListIcon from "@material-ui/icons/List";
import NextWeekIcon from "@material-ui/icons/NextWeek";
import PeopleIcon from "@material-ui/icons/People";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import SecurityIcon from "@material-ui/icons/Security";
import TableChartIcon from "@material-ui/icons/TableChart";
import TuneIcon from "@material-ui/icons/Tune";
import { getApplicationConfig } from "./constants/config";

import {
  Domain,
  LocationCity,
  Room,
  Map,
  Note,
  Receipt,
  PlaylistAddCheck,
  Apartment,
  MenuBook,
  ImportContacts,
  AssignmentTurnedIn,
  NetworkCheck,
  Update,
  AttachFile,
  MonetizationOn,
  PermDataSetting,
  Storage,
} from "@material-ui/icons";

const config = getApplicationConfig();

const PERMISSIONS = {
  organizational_config: "edit_organizations",
  programs_config: "edit_programs",
  functions_config: "edit_functions",
  fund_config: "edit_funds",
  cost_config: "edit_costings",
  location_config: "edit_locations",
};

const ICONS = {
  ministry: <Domain />,
  public_body: <Apartment />,
  departments: <Apartment />,
  program: <ImportContacts />,
  sub_program: <MenuBook />,
  function: <AssignmentTurnedIn />,
  sub_function: <PlaylistAddCheck />,
  fund: <LocationCity />,
  cost_class: <Receipt />,
  cost_object: <Note />,
  cost_sub_object: <Note />,
  cost_detail_sub_object: <Note />,
  central: <Map />,
  province: <Room />,
};

function orgStructureMenu(configElement) {
  if (config && config[configElement]) {
    return config[configElement]
      ? Object.keys(config[configElement]).map((key) => ({
        title: config[configElement][key].name,
        translation: `navigation.${configElement}.${key}`,
        href: `/${config[configElement][key].id}`,
        icon: ICONS[config[configElement][key].id],
        permission: PERMISSIONS[configElement],
      }))
      : [];
  }
}

export default [
  {
    title: "Home",
    icon: <DashboardIcon />,
    permission: "list_projects",
    children: [
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
    ],
  },
  {
    // title: "Projects",
    // href: "/pre_investment",
    icon: <FormatListBulletedIcon />,
    permission: ["pre_inv_list_projects"],
    children: [
      {
        title: "Pre - Investment",
        // href: "/concepts",
        icon: <Filter1Icon />,
        permission: "pre_inv_list_projects",
        children: [
          {
            title: "Concepts",
            href: "/concepts",
            icon: <Filter1Icon />,
          },
          {
            title: "Proposals",
            href: "/proposals",
            icon: <Filter2Icon />,
          },
          {
            title: "Initiation",
            href: "/budjet-proposals",
            icon: <Filter3Icon />,
          },
        ],
      },
    ],
  },
  {
    // title: "PM",
    // href: "/project_mgmt",
    icon: <FormatListBulletedIcon />,
    // permission: [
    //   'gantt_chart_view',
    //   'list_projected_cash_flow',
    //   'list_approved_cash_flow',
    //   'list_adjusted_cash_flow',
    //   'list_warrant_request',
    // ],
    children: [
      {
        title: "Project Management",
        // href: "/gantt_chart",
        icon: <EqualizerIcon />,
        permission: [
          'list_project_management',
          'list_projected_cash_flow',
          'list_approved_cash_flow',
          'list_adjusted_cash_flow',
          'list_warrant_request',
          'list_expenditures_data'
        ],
        children: [
          {
            title: "Gantt Chart",
            href: "/gantt_chart",
            icon: <EqualizerIcon />,
            permission: ["list_project_management", 'view_project_management', 'create_project_management', 'edit_project_management'],
          },
          {
            title: "Projected Cash Flow ",
            href: "/work_plan",
            icon: <AccountBalanceIcon />,
            permission: "list_projected_cash_flow",
          },
          {
            title: "Approved Cash Flow ",
            href: "/work_plan_approved",
            icon: <AccountBalanceIcon />,
            permission: "list_approved_cash_flow",
          },
          {
            title: "Adjusted Cash Flow ",
            href: "/work_plan_adjusted",
            icon: <AccountBalanceIcon />,
            permission: "list_adjusted_cash_flow",
          },
          {
            title: "Warrant Request",
            href: "/work_plan_monthly",
            icon: <SecurityIcon />,
            permission: "list_warrant_request",
          },
          {
            title: "Expenditures",
            href: "/expenditures",
            icon: <AccountBalanceIcon />,
            permission: "list_expenditures_data",
          },
        ],
      },
    ],
  },
  {
    // title: "M&E",
    // href: "/me_mgmt",
    icon: <FormatListBulletedIcon />,
    permission: ["list_log_frame"],
    children: [
      {
        title: "M&E Management",
        // href: "/me_mgmt",
        icon: <FormatListBulletedIcon />,
        permission: ["list_log_frame", "list_indicators"],
        children: [
          {
            title: "Logical Framework",
            href: "/log_frame",
            icon: <AccountTreeIcon />,
            permission: "list_log_frame",
          },
          {
            title: "Indicators",
            href: "/reports-indicators-projects",
            icon: <AccountTreeIcon />,
            permission: "list_indicators",
          },
        ],
      },
    ],
  },
  {
    // title: "Portfolio",
    // href: "/portfolio_mgmt",
    icon: <FormatListBulletedIcon />,
    permission: "create_custom_report",
    children: [
      {
        title: "Portfolio Management",
        // href: "/portfolio_mgmt",
        icon: <FormatListBulletedIcon />,
        permission: "create_custom_report",
        children: [
          {
            title: "Query Builder",
            href: "/query_builder",
            icon: <QueryBuilderIcon />,
            permission: "create_custom_report",
          },
        ],
      },
    ],
  },
  {
    // title: "Reporting ",
    // href: "/reports",
    icon: <FormatListBulletedIcon />,
    permission: ["list_custom_reports", "list_reports"],
    feature: "has_report_management",
    children: [
      {
        title: "Reporting ",
        // href: "/reports",
        icon: <FormatListBulletedIcon />,
        permission: ["list_custom_reports", "list_reports"],
        feature: "has_report_management",
        children: [
          {
            title: "Standard Reports",
            level: 3,
            href: "/reports_list",
            icon: <AssessmentIcon />,
            children: [
              {
                title: "Projects in Pipeline",
                href: "/reports-pipeline-projects",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_pipeline_report",
                translation: "navigation.reports.pipeline_report",
              },
              {
                title: "Public Investment Portfolio",
                href: "/reports-pipeline-projects-portfolio",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_pipeline_portfolio_report",
                translation: "navigation.reports.pipeline_report_portfolio",
              },
              {
                title: "Projects Completed",
                href: "/completed-report",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_completed_projects_report",
                translation: "navigation.reports.completed_projects_report",
              },
              {
                title: "Pipline of Projects",
                href: "/reports-pipeline-projects",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_pipeline_of_projects_report",
                translation: "navigation.reports.pipeline_of_projects_report",
              },
              {
                title: "Fiscal Load",
                href: "/reports-fiscal-load",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_fiscal_load_report",
                translation: "navigation.reports.fiscal_load_report",
              },
              {
                title: "Project Cost Evolution",
                href: "/reports-project-cost-evaluation",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_project_cost_evolution_report",
                translation: "navigation.reports.project_cost_evolution_report",
              },
              {
                title:
                  "Project Costs and Counts at different stages of the Development Cycle",
                href: "/reports-project-count",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_costs_and_counts_report",
                translation: "navigation.reports.costs_and_counts_report",
              },
              {
                title: "Projects Ranking",
                href: "/reports-projects-ranking",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_projects_ranking_report",
                translation: "navigation.reports.projects_ranking_report",
              },
              {
                title: "Project Locations",
                href: "/reports-project-geo-by-phases",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_projects_location_report",
                translation: "navigation.reports.projects_location_report",
              },
              {
                title: "IBP User Action Tracking Report",
                href: "/reports-project-ibp-usage",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_ibp_usage_report",
                translation: "navigation.reports.ibp_usage_report",
              },
              {
                title: "Projects Scheduled for DC",
                href: "/reports-project-dc-report",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_projects_scheduled_dc_report",
                translation: "navigation.reports.projects_scheduled_dc_report",
              },
              {
                title: "Projects waiting for action",
                href: "/reports-projects-for-action",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_projects_waiting_actions_report",
                translation:
                  "navigation.reports.projects_waiting_actions_report",
              },
              {
                title: "Stagnant Projects",
                href: "/reports-projects-stagnant",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_stagnant_projects_report",
                translation: "navigation.reports.stagnant_projects_report",
              },
              {
                title: "Donor Projects",
                href: "/reports-projects-donors",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_donors_projects_report",
                translation: "navigation.reports.donors_projects_report",
              },
              {
                title: "Submitted Projects",
                href: "/reports-projects-submitted",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_submitted_projects_report",
                translation: "navigation.reports.submitted_projects_report",
              },
              {
                title: "Repeated Projects",
                href: "/reports-projects-repeated",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_repeated_projects_report",
                translation: "navigation.reports.repeated_projects_report",
              },
              {
                title: "Projects by Categories",
                href: "/reports-projects-categories",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_projects_categories_report",
                translation: "navigation.reports.projects_categories_report",
              },
              {
                title: "Project Programs Counts and Costs",
                href: "/reports-project-programs-count",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_projects_programs_report",
                translation: "navigation.reports.projects_programs_report",
              },
              {
                title: "Project Functions Counts and Costs",
                href: "/reports-project-functions-count",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_projects_functions_report",
                translation: "navigation.reports.projects_functions_report",
              },
              {
                title: "NDP goals and strategies report",
                href: "/reports-ndp-goals",
                icon: <TableChartIcon />,
                permission: "list_reports",
                feature: "has_projects_ndp_goals_report",
                translation: "navigation.reports.projects_ndp_report",
              },
            ],
          },
          {
            title: "Custom Reports",
            href: "/custom-reports",
            icon: <TableChartIcon />,
            permission: "list_custom_reports",
          },
        ],
      },
    ],
  },
  {
    // title: "Admin",
    // href: "/admin",
    icon: <FormatListBulletedIcon />,
    permission: "full_access",
    children: [
      {
        title: "Administration ",
        icon: <FormatListBulletedIcon />,
        permission: "full_access",
        children: [
          {
            title: "User Management",
            level: 3,
            icon: <PeopleIcon />,
            permission: "edit_users",
            children: [
              {
                title: "Users",
                href: "/users",
                icon: <PeopleIcon />,
                permission: "edit_users",
              },
              {
                title: "Roles",
                href: "/roles",
                icon: <SecurityIcon />,
                permission: "edit_roles",
              },
              {
                title: "User Delegations",
                href: "/delegation",
                icon: <AccountBoxIcon />,
                permission: "edit_users",
              },
            ],
          },
          {
            title: "Validations",
            href: "/validation",
            icon: <PermDataSetting />,
            permission: "edit_parameters",
          },
          {
            title: "Resources",
            // href: "/resources",
            icon: <TuneIcon />,
            permission: "create_resources",
            level: 3,
            children: [
              {
                title: "Phases",
                href: "/phases",
                icon: <NetworkCheck />,
                permission: "edit_phases",
              },
              {
                title: "Workflow",
                href: "/workflows",
                icon: <Update />,
                permission: "edit_workflows",
              },
              {
                title: "Workflow Instances",
                href: "/workflow-instances",
                icon: <Update />,
                permission: "edit_workflows",
              },
              {
                title: "M&E Workflow",
                href: "/me-workflows",
                icon: <AccountTreeIcon />,
                feature: "has_me_project_reporting",
                permission: "edit_workflows",
              },
              {
                title: "File Types",
                href: "/file-types",
                icon: <AttachFile />,
                permission: "edit_file_types",
              },
              {
                title: "Units",
                href: "/units",
                icon: <FormatListBulletedIcon />,
                permission: "edit_units",
              },

              {
                title: "Disaggregation types",
                href: "/disaggregation-types",
                icon: <FormatListBulletedIcon />,
                permission: "edit_disaggregation_type",
              },
              {
                title: "Formats",
                href: "/formats",
                icon: <FormatListBulletedIcon />,
                permission: "edit_format",
              },
              {
                title: "Frequencies",
                href: "/frequencies",
                icon: <FormatListBulletedIcon />,
                permission: "edit_frequency",
              },
              // {
              //   title: "Currency",
              //   href: "/currencies",
              //   icon: <MonetizationOn />,
              //   permission: "edit_currencies",
              // },
              // {
              //   title: "Currency Rates",
              //   href: "/currency-rates",
              //   icon: <AttachMoneyIcon />,
              //   permission: "edit_currency_rate_rates",
              // },
              {
                title: "System Parameters",
                href: "/parameters",
                icon: <PermDataSetting />,
                permission: "edit_parameters",
              },
              // {
              //   title: "Validations",
              //   href: "/validation",
              //   icon: <PermDataSetting />,
              //   permission: "edit_parameters",
              // },
              {
                title: "Sectors",
                href: "/sectors",
                icon: <Storage />,
                permission: "edit_sectors",
              },
              {
                title: "Reverted Projects",
                href: "/reverted",
                icon: <DeleteOutlineOutlined />,
                permission: "revert_project",
              },
              {
                title: "Recycle bin",
                href: "/trash",
                icon: <DeleteOutlineOutlined />,
                permission: "access_deleted_project",
              },
              {
                title: "Goals",
                href: `/ndp-goals`,
                icon: <FormatListBulletedIcon />,
                permission: "list_ndp_data",
              },
              {
                title: "Outcomes",
                href: `/ndp-outcomes`,
                icon: <FormatListBulletedIcon />,
                permission: "list_ndp_data",
              },
              {
                title: "SDGs",
                href: `/ndp-sdgs`,
                icon: <FormatListBulletedIcon />,
                permission: "list_ndp_data",
              },
              {
                title: "MTFs",
                href: `/ndp-mtfs`,
                icon: <FormatListBulletedIcon />,
                permission: "list_ndp_data",
              },
              {
                title: "Strategies",
                href: `/ndp-strategies`,
                icon: <FormatListBulletedIcon />,
                permission: "list_ndp_data",
              },
            ],
          },
          {
            title: "Classifiers",
            level: 3,
            // href: "/classifiers",
            icon: <FormatListBulletedIcon />,
            permission: "full_access",
            children: [
              ...orgStructureMenu("organizational_config"),
              ...orgStructureMenu("programs_config"),
              ...orgStructureMenu("functions_config"),
              ...orgStructureMenu("fund_config"),
              ...orgStructureMenu("cost_config"),
              ...orgStructureMenu("location_config"),
            ],
          },
          {
            title: "Integrations ",
            icon: <FormatListBulletedIcon />,
            permission: "full_access",
            children: [
              {
                title: "BPMS",
                level: 3,
                icon: <FormatListBulletedIcon />,
                permission: "full_access",
                href: "/bpms",
              },
              {
                title: "GFMS",
                level: 3,
                icon: <FormatListBulletedIcon />,
                permission: "full_access",
                href: "/gfms",
              },
              // {
              //   title: "JFMS Data",
              //   level: 3,
              //   icon: <FormatListBulletedIcon />,
              //   permission: "full_access",
              //   href: "/jfms_data",
              // }
            ]
          }
        ],
      },
    ],
  },
  {
    // title: "Links",
    // href: "/useful-links",
    icon: <LinkIcon />,
    feature: "has_usefull_links_page",
    children: [
      {
        title: "Links",
        href: "/useful-links",
        icon: <LinkIcon />,
        feature: "has_usefull_links_page",
      },
    ],
  },
];

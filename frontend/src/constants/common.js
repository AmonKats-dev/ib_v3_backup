// export const API_URL = 'http://api-ibp.torusline.com'; //production
// export const API_URL = 'http://api-ibp-dev.torusline.com'; //development
// export const API_URL = 'http://api.ibp.dev'; //development
// export const API_URL = 'http://ibp-main/api/web'; //local ibp

// export const API_URL =
//     process.env.REACT_APP_API_URL || 'http://api-ibp-dev.torusline.com';
import {
  faFilePdf,
  faFileWord,
  faFileCsv,
} from "@fortawesome/free-solid-svg-icons";
import { VALIDATION } from "./auth";

export const NUMBER_FORMATS = {
  ROMANS: "Romans",
  ARABIC: "Arabic",
};

export const DONORS_FUNDS_IDS = [5, 6, 7];

export const CURRENT_NUMBER_FORMAT = NUMBER_FORMATS.ARABIC;

export const GOOGLE_MAP_API_KEY = "AIzaSyAXBqa642R0oZssGxLvD3rTuCHGBNnL9Z8";

export const DEFAULT_SORTING = { field: "name", order: "ASC" };

export const _PROJECT_STEPS = {
  SUMMARY: "Summary",
  RESPONSIBLE_OFFICER: "Responsible Officer",
  PROJECT_BACKGROUND: "Project Background",
  PROJECT_FRAMEWORK: "Project Framework",
  DEMAND_ANALYSIS: "Demand Analysis",
  OPTIONS_ANALYSIS: "Options Analysis",
  PROJECT_APPRAISAL: "Project Appraisal",
  FIN_ANALYSIS: "Fin&Econ Analysis",
  COST: "Costs",
  RESULT_MATRIX: "Result Matrix",
  MODULES: "Modules",
  ADDITIONAL_INFO: "Additional information",
  OM_COSTS: "O&M Cost",
  INTRODUCTION: "Introduction",
  ME_REPORT: "M&E Report",
  EX_POST_EVALUATION: "Ex-Post Evaluation",
  BUDGET_ALLOCATION: "Project Initialization",
  BENEFICIARY: "Beneficiary",
  STRATEGIC_ALIGNMENT: "StrategicAlignment",
  BEHAVIOR_CHANGE: "BEHAVIOR_CHANGE",
};

export const PROJECT_STEPS = {
  INDICATORS: "INDICATORS",
  COST_ESTIMATES: "COST_ESTIMATES",
  SUMMARY: "SUMMARY",
  RESPONSIBLE_OFFICER: "RESPONSIBLE_OFFICER",
  PROJECT_BACKGROUND: "PROJECT_BACKGROUND",
  PROJECT_FRAMEWORK: "PROJECT_FRAMEWORK",
  DEMAND_ANALYSIS: "DEMAND_ANALYSIS",
  OPTIONS_ANALYSIS: "OPTIONS_ANALYSIS",
  PROJECT_APPRAISAL: "PROJECT_APPRAISAL",
  FIN_ANALYSIS: "FIN_ANALYSIS",
  COST: "COST",
  RESULT_MATRIX: "RESULT_MATRIX",
  MODULES: "MODULES",
  ADDITIONAL_INFO: "ADDITIONAL_INFO",
  OM_COSTS: "OM_COSTS",
  INTRODUCTION: "INTRODUCTION",
  ME_REPORT: "ME_REPORT",
  EX_POST_EVALUATION: "EX_POST_EVALUATION",
  NDP: "NDP",
  PROCUREMENT: "PROCUREMENT",
  RISK_ASSESSMENT: "RISK_ASSESSMENT",
  STAKEHOLDERS: "STAKEHOLDERS",
  CLIMATE_RISK_ASSESSMENT: "CLIMATE_RISK_ASSESSMENT",
  BUDGET_ALLOCATION: "BUDGET_ALLOCATION",
  BENEFICIARY: "BENEFICIARY",
  STRATEGIC_ALIGNMENT: "STRATEGIC_ALIGNMENT",
  BEHAVIOR_CHANGE: "BEHAVIOR_CHANGE",
  LOG_FRAMEWORK: "LOG_FRAMEWORK",
};

export const PROJECT_FORMS = {
  SUMMARY: "SummaryForm",
  RESPONSIBLE_OFFICER: "ResponsibleOfficerForm",
  DEMAND_ANALYSIS: "DemandAnalysisForm",
  PROJECT_BACKGROUND: "ProjectBackgroundForm",
  PROJECT_FRAMEWORK: "ProjectFrameworkForm",
  OPTIONS_APPRAISAL: "OptionsAppraisalForm",
  FINANCIAL_ANALYSIS: "FinancialAnalysisForm",
  RESULT_MATRIX: "ResultMatrixForm",
  MODULES: "ModulesForm",
  ADDITIONAL_INFO: "AdditionalInfoForm",
  OM_COSTS: "OmCostsForm",
  INTRODUCTION: "IntroductionForm",
  ME_REPORT: "MeReportForm",
  EX_POST_EVALUATION: "ExPostEvaluationForm",
  CLIMATE_RISK_ASSESSMENT: "ClimateRiskAssessmentForm",
  RISK_ASSESSMENT: "RiskAssessmentForm",
  STAKEHOLDERS: "StakeholdersForm",
  BENEFICIARY: "BeneficiaryForm",
  STRATEGIC_ALIGNMENT: "StrategicAlignmentForm",
  BEHAVIOR_CHANGE: "BehaviorChangeForm",
};

export const ACTION_TYPES = {
  SUBMIT: "SUBMIT",
  APPROVE: "APPROVE",
  CONDITIONALLY_APPROVE: "CONDITIONALLY_APPROVE",
  REJECT: "REJECT",
  REVISE: "REVISE",
  ASSIGN: "ASSIGN",
  ALLOCATE_FUNDS: "ALLOCATE_FUNDS",
  COMPLETE: "COMPLETE",
};

export const ME_ACTION_TYPES = {
  SUBMIT: "SUBMIT",
  APPROVE: "APPROVE",
  REVISE: "REVISE",
  COMPLETE: "COMPLETE",
};

export const ACTION_PERMISSIONS = {
  SUBMIT: "submit_project",
  APPROVE: "approve_project",
  REJECT: "reject_project",
  REVISE: "revise_project",
  ASSIGN: "assign_project",
};

export const USER_ROLES = {
  ADMIN: "admin",
  DAU: "department_admin_user",
  PCU: "pap_commissioner_user",
  PHU: "pap_head_user",
  PSU: "pap_standard_user",
  SU: "standard_user",
  VAU: "vote_admin_user",
  AO: "account_officer",
  DCU: "dc_member_user",
  SHU: "sector_head_user",
  DOU: "desk_officer_user",
  DU: "donor_user",
  PAC: "pap_assist_commissioner_user",
  PSE: "pap_senior_economist_user",
};

// export const PROJECT_PHASES = {
//   1: "Project Concept",
//   2: "Pre-feasibility",
//   3: "Feasibility",
//   4: "Design",
//   5: "Implementation",
//   6: "Ex-Post Evaluation",
// };

// Project starts from Profile (phase_id from API); Project Concept is omitted as initial stage.
export const PROJECT_PHASES = {
  1: "Project Concept",
  2: "Project Profile",
  3: "Pre-feasibility",
  4: "Feasibility",
  5: "Project Proposal",
  6: "Budget Appropriation",
  7: "Implementation",
  8: "Ex-Post Evaluation",
};

export const PROJECT_PHASES_COLORS = {
  1: "#ffc107",
  2: "#20a8d8",
  3: "#6f42c1",
  4: "#20c997",
  5: "#4d7cbd",
  6: "#d78115",
  7: "#4ebd74",
};

export const PROJECT_PHASE_STATUS = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  APPROVED: "Approved",
  REVISED: "Revised",
  REJECTED: "Rejected",
  ASSIGNED: "Assigned",
  COMPLETED: "Completed",
  ONGOING: "Ongoing",
  SUSPENDED: "Suspended",
  IN_PIPELINE: "In Pipeline",
  POST_EVALUATION: "Post Evaluation",
};

export const ME_REPORT_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  REVISED: "REVISED",
  COMPLETED: "COMPLETED",
  ASSIGNED: "ASSIGNED",
};

export const PROJECT_STATUS = {
  STATUS_REJECTED: "rejected",
  STATUS_APPROVED: "approved",
  STATUS_ASSIGNED: "assigned",
  STATUS_REVISED: "revised",
  STATUS_DRAFT: "draft",
  STATUS_SUBMITTED: "submitted",
  STATUS_IN_PIPELINE: "in pipeline",
  STATUS_IS_COMPLETED: "completed",
};

export const PAP_DEPARTMENT_USERS = [
  USER_ROLES.PCU,
  USER_ROLES.PHU,
  USER_ROLES.PSU,
  USER_ROLES.ADMIN,
  USER_ROLES.DCU, // TODO: need confirmation
  USER_ROLES.PAC,
  USER_ROLES.PSE,
];

export const EXPORT_TYPES = {
  XLS: { id: "csv", icon: faFileCsv },
  WORD: { id: "word", icon: faFileWord },
  PDF: { id: "pdf", icon: faFilePdf },
};

export const PROJECT_CLASSIFICATION = {
  SOCIAL_INVESTMENTS: "Social Investments",
  RETOOLING: "Institutional Development",
  STUDIES: "Studies",
  INFRASTRUCTURE: "Infrastructure",
};

export const PROCUREMENT_IMPLEMENTATION_MODALITY = {
  REGULAR_GOJ_PROCUREMENT: "Regular GOJ Procurement",
  IN_HOUSE_DELIVERY: "Standard In-house delivery of project ",
  OUTSOURCING: "Outsourcing",
  PPP: "Public-Private Partnerships",
  JV: "Joint-Venture",
  UP: "Unsolicited Proposal",
  IDP_PROCUREMENT_MODALITY: "IDP Procurement  Modality ",
};

export const NOTIFICATIONS_REFRESH_TIME = 60000 * 5; // 5 minutes

export const FINANCIAL_PATTERN_TYPE = {
  1: "Recurrent Expenditures",
  4: "Deposit Funds",
  5: "Special Funds",
  6: "Capital",
  9: "Other Funds",
};

export const FINANCIAL_PATTERN_SUBTYPE = {
  1: "Voted",
  2: "Statutory",
};

export const FUND_BODY_TYPES = {
  0: "Not Applicable",
  1: "Loan",
  2: "Grant",
  3: "Government of Jamaica",
};

export const VALIDATION_FIELDS = () => {
  const validationFromStorage = localStorage.getItem(VALIDATION);

  return validationFromStorage
    ? JSON.parse(validationFromStorage)
    : [
        {
          field: "behavior_knowledge_products",
          phases: [5],
          translation: "validation.behavior_knowledge_products",
          step: PROJECT_STEPS.BEHAVIOR_CHANGE,
          app: ["ug"],
        },
        {
          field: "behavior_project_results",
          phases: [5],
          translation: "validation.behavior_project_results",
          step: PROJECT_STEPS.BEHAVIOR_CHANGE,
          app: ["ug"],
        },
        {
          field: "behavior_measures",
          phases: [5],
          translation: "validation.behavior_measures",
          step: PROJECT_STEPS.BEHAVIOR_CHANGE,
          app: ["ug"],
        },
        // {
        //   field: "sector_id",
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.sector_id",
        //   step: PROJECT_STEPS.SUMMARY,
        // },
        // {
        //   field: "program_id",
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.program_id",
        //   step: PROJECT_STEPS.SUMMARY,
        //   app: ["jm", "ug"],
        // },
        // {
        //   field: "function_id",
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.function_id",
        //   step: PROJECT_STEPS.SUMMARY,
        //   app: ["ug"],
        // },
        // {
        //   field: "implementing_agencies",
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.implementing_agencies",
        //   step: PROJECT_STEPS.SUMMARY,
        //   app: ["jm"],
        // },
        {
          field: "revenue_source",
          phases: [1, 2],
          translation: "validation.revenue_source",
          step: PROJECT_STEPS.SUMMARY,
          app: ["jm"],
        },
        {
          field: "proposed_funding_source",
          phases: [1, 2],
          translation: "validation.proposed_funding_source",
          step: PROJECT_STEPS.SUMMARY,
          app: ["jm"],
        },
        {
          field: "summary",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.summary",
          step: PROJECT_STEPS.SUMMARY,
          app: ["jm", "ug"],
        },
        {
          field: "start_date",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.start_date",
          step: PROJECT_STEPS.SUMMARY,
          app: ["jm", "ug"],
        },
        {
          field: "end_date",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.end_date",
          step: PROJECT_STEPS.SUMMARY,
          app: ["jm", "ug"],
        },
        {
          field: "locations",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.location",
          step: PROJECT_STEPS.SUMMARY,
          app: ["jm", "ug"],
        },
        {
          field: "exec_management_plan",
          phases: [3, 4, 5],
          translation: "validation.exec_management_plan",
          step: PROJECT_STEPS.SUMMARY,
          app: ["jm", "ug"],
        },
        {
          field: "project_goal",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.goal",
          step: PROJECT_STEPS.SUMMARY,
          app: ["jm"],
        },
        //officer
        {
          field: "responsible_officers",
          innerFields: [
            // "organization_name",
            "title",
            "name",
            "phone",
            "mobile_phone",
            "email",
            // "address",
          ],
          phases: [1, 2, 3, 4, 5],
          translation: "validation.officer_title",
          step: PROJECT_STEPS.RESPONSIBLE_OFFICER,
          app: ["ug"],
        },
        // {
        //   field: "responsible_officers",
        //   innerFields: [
        //     // "organization_name",
        //     "title",
        //     "name",
        //     // "phone",
        //     // "mobile_phone",
        //     "email",
        //     // "address",
        //   ],
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.officer_title",
        //   step: PROJECT_STEPS.RESPONSIBLE_OFFICER,
        //   app: ["jm"],
        // },
        //back
        {
          field: "work_plan_description",
          phases: [5],
          translation: "validation.work_plan_description",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["ug"],
        },
        {
          field: "procurement_plan_description",
          phases: [5],
          translation: "validation.procurement_plan_description",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["ug"],
        },
        {
          field: "situation_analysis",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.situation_analysis",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["ug"],
        },
        {
          field: "situation_analysis",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.situation_analysis",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["ug"],
        },
        {
          field: "problem_statement",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.problem_statement",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["jm", "ug"],
        },
        {
          field: "problem_cause",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.problem_cause",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["jm", "ug"],
        },
        {
          field: "problem_effects",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.problem_effects",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["jm", "ug"],
        },
        {
          field: "justification",
          phases: [4],
          translation: "validation.justification",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["ug"],
        },
        {
          field: "justification",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.justification",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["jm"],
        },
        {
          field: "sustainability_plan",
          phases: [7],
          translation: "validation.sustainability_plan",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["jm"],
        },
        // {
        //   field: "me_strategies",
        //   phases: [7],
        //   translation: "validation.me_strategies",
        //   step: PROJECT_STEPS.PROJECT_BACKGROUND,
        //   app: ["ug"],
        // },
        // { TODO remove ehen change to array
        //   field: "stakeholders",
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.stakeholders",
        //   step: PROJECT_STEPS.PROJECT_BACKGROUND,
        // },
        // {
        //   field: "ndp_type",
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.ndp_type",
        //   step: PROJECT_STEPS.PROJECT_BACKGROUND,
        // },
        {
          field: "ndp_plan_details",
          phases: [2, 3, 4, 5],
          translation: "validation.ndp_plan_details",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["ug"],
        },
        // {
        //   field: "government_coordinations",
        //   innerFields: ["name", "details"],
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.government_coordinations",
        //   step: PROJECT_STEPS.PROJECT_BACKGROUND,
        // },
        {
          field: "stakeholders",
          innerFields: ["name", "details"],
          phases: [4],
          translation: "validation.stakeholders",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["ug"],
        },
        {
          field: "stakeholder_consultation",
          phases: [1],
          translation: "validation.stakeholders",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["jm"],
        },
        {
          field: "stakeholders",
          innerFields: [
            "name",
            "description",
            "interest_level",
            "influence_level",
            "communication_channel",
            "engagement_frequency",
            "responsible_entity",
          ],
          phases: [2],
          translation: "validation.stakeholders",
          step: PROJECT_STEPS.STAKEHOLDERS,
          app: ["jm"],
        },
        //matrix
        {
          field: "goal",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.goal",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug"],
        },
        {
          field: "goal",
          phases: [2, 3, 4, 5],
          translation: "validation.goal",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["jm"],
        },
        {
          field: "indicators",
          innerFields: ["name", "baseline", "verification_means"],
          phases: [2, 3, 4, 5],
          translation: "validation.goal_indicators",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug", "jm"],
        },
        {
          field: "outcomes",
          innerFields: ["name"],
          phases: [1, 2, 3, 4, 5],
          translation: "validation.outcomes",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug"],
        },
        {
          field: "outcomes",
          innerFields: ["name"],
          phases: [2, 3, 4, 5],
          translation: "validation.outcomes",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["jm"],
        },
        {
          field: "outcomes.indicators",
          innerFields: [
            "name",
            "baseline",
            "verification_means",
            "assumptions",
            "risk_factors",
          ],
          phases: [2, 3, 4, 5],
          translation: "validation.outcomes_indicators",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug"],
        },
        {
          field: "outcomes.indicators",
          innerFields: [
            "name",
            "baseline",
            "verification_means",
            "assumptions",
            "risk_factors",
          ],
          phases: [2, 3, 4, 5],
          translation: "validation.outcomes_indicators",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["jm"],
        },
        {
          field: "outputs",
          innerFields: [
            "name",
            "outcome_ids",
            "organization_ids",
            "description",
            "unit_id",
          ],
          phases: [1, 2, 3, 4, 5],
          translation: "validation.outputs",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug"],
        },
        {
          field: "outputs",
          innerFields: [
            "name",
            "outcome_ids",
            "organization_ids",
            "component_id",
            "description",
          ],
          phases: [2, 3, 4, 5],
          translation: "validation.outputs",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["jm"],
        },
        // {
        //   field: "outputs",
        //   innerFields: ["tech_specs", "alternative_specs"],
        //   phases: [4],
        //   translation: "validation.outputs_design",
        //   step: PROJECT_STEPS.RESULT_MATRIX,
        // },
        {
          field: "outputs.indicators",
          innerFields: [
            "name",
            "baseline",
            "verification_means",
            "assumptions",
            "risk_factors",
          ],
          phases: [2, 3, 4, 5],
          translation: "validation.outputs_indicators",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug"],
        },
        {
          field: "outputs.indicators",
          innerFields: [
            "name",
            "baseline",
            "verification_means",
            "assumptions",
            "risk_factors",
          ],
          phases: [2, 3, 4, 5],
          translation: "validation.outputs_indicators",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["jm"],
        },
        {
          field: "outputs.investments",
          innerFields: ["fund_id", "costing_id"],
          phases: [1],
          translation: "validation.outputs_investments",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug"],
        },
        // {
        //   field: "outputs.investments",
        //   innerFields: ["fund_id", "costing_id"],
        //   phases: [2],
        //   translation: "validation.outputs_investments",
        //   step: PROJECT_STEPS.RESULT_MATRIX,
        //   app: ["jm"],
        // },
        {
          field: "components.investments",
          innerFields: ["fund_id"],
          phases: [2],
          translation: "validation.components_investments",
          step: PROJECT_STEPS.COST_ESTIMATES,
          app: ["jm"],
        },
        {
          field: "components.subcomponents",
          innerFields: ["name", "description"],
          phases: [2],
          translation: "validation.components_subcomponents",
          step: PROJECT_STEPS.COST_ESTIMATES,
          app: ["jm"],
        },
        {
          field: "activities",
          innerFields: [
            "name",
            "start_date",
            "end_date",
            "output_ids",
            "description",
          ],
          phases: [2, 3, 4, 5],
          translation: "validation.activities",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug"],
        },
        {
          field: "activities.investments",
          innerFields: ["fund_id", "costing_id"],
          phases: [2, 3, 4, 5],
          translation: "validation.activities_investments",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug"],
        },
        {
          field: "baseline",
          phases: [2, 3, 4, 5],
          translation: "validation.baseline",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["ug"],
        },
        {
          field: "baseline",
          phases: [2, 3, 4, 5],
          translation: "validation.baseline",
          step: PROJECT_STEPS.RESULT_MATRIX,
          app: ["jm"],
        },
        //cost estimated
        {
          field: "components",
          innerFields: ["name", "description"],
          phases: [1, 2, 3, 4, 5],
          translation: "validation.components",
          step: PROJECT_STEPS.COST_ESTIMATES,
          app: ["jm"],
        },
        //introduction
        {
          field: "rational_study",
          phases: [3, 4, 5],
          translation: "validation.rational_study",
          step: PROJECT_STEPS.INTRODUCTION,
          app: ["ug"],
        },
        {
          field: "methodology",
          phases: [3, 4, 5],
          translation: "validation.methodology",
          step: PROJECT_STEPS.INTRODUCTION,
          app: ["ug"],
        },
        {
          field: "organization_study",
          phases: [3, 4, 5],
          translation: "validation.organization_study",
          step: PROJECT_STEPS.INTRODUCTION,
          app: ["ug"],
        },
        //om costs and defect period
        {
          field: "om_costs",
          innerFields: ["fund_id", "costing_id"],
          phases: [3, 4, 5],
          translation: "validation.om_costs",
          step: PROJECT_STEPS.OM_COSTS,
          app: ["ug"],
        },
        {
          field: "om_costs",
          innerFields: ["fund_id", "costing_id"],
          phases: [2],
          translation: "validation.om_costs",
          step: PROJECT_STEPS.OM_COSTS,
          app: ["jm"],
        },
        //additional info filled validation
        // {
        //   field: "other_info",
        //   phases: [1, 2],
        //   translation: "validation.other_info",
        //   step: PROJECT_STEPS.ADDITIONAL_INFO,
        //   app: ["jm", "ug"],
        // },
        // {
        //   field: "revenue_source",
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.revenue_source",
        //   step: PROJECT_STEPS.SUMMARY,
        //   app: ["jm"],
        // },
        {
          field: "national_scope",
          phases: [5],
          translation: "validation.national_scope",
          step: PROJECT_STEPS.SUMMARY,
          app: ["ug"],
        },
        // {
        //   field: "expected_fund_source",
        //   phases: [5],
        //   translation: "validation.expected_fund_source",
        //   step: PROJECT_STEPS.SUMMARY,
        //   app: ["ug"],
        // },
        {
          field: "procurement_modality",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.procurement_modality",
          step: PROJECT_STEPS.SUMMARY,
          app: ["jm"],
        },
        {
          field: "me_strategies",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.me_strategies",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["jm"],
        },
        {
          field: "governance",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.governance",
          step: PROJECT_STEPS.PROJECT_BACKGROUND,
          app: ["jm"],
        },

        {
          field: "ppp_similar_reference",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.ppp_similar_reference",
          step: PROJECT_STEPS.PROCUREMENT,
          app: ["jm"],
        },
        {
          field: "ppp_interest",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.ppp_interest",
          step: PROJECT_STEPS.PROCUREMENT,
          app: ["jm"],
        },
        {
          field: "ppp_impediments",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.ppp_impediments",
          step: PROJECT_STEPS.PROCUREMENT,
          app: ["jm"],
        },
        {
          field: "ppp_risk_allocation",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.ppp_risk_allocation",
          step: PROJECT_STEPS.PROCUREMENT,
          app: ["jm"],
        },
        {
          field: "ndp_strategies",
          phases: [1, 2, 3, 4, 5],
          innerFields: [
            "ndp_goal_id",
            "ndp_outcome_id",
            "ndp_sdgs_ids",
            "ndp_strategy_ids",
          ], //TODO validate one of "ndp_strategy_id", "ndp_sdg_id"
          translation: "validation.ndp_strategy_id",
          step: PROJECT_STEPS.NDP,
          app: ["jm"],
        },
        // {
        //   field: "ndp_strategies",
        //   phases: [1, 2, 3, 4, 5],
        //   innerFields: ["ndp_strategy_ids", "ndp_sdgs_id"],
        //   translation: "validation.ndp_sdgs_id",
        //   step: PROJECT_STEPS.NDP,
        //   app: ["jm"],
        //   condition: "OR",
        // },
        // {
        //   field: "ndp_sustainable_goals",
        //   phases: [1, 2, 3, 4, 5],
        //   translation: "validation.ndp_sustainable_goals",
        //   step: PROJECT_STEPS.NDP,
        //   app: ["jm"],
        // },
        {
          field: "ndp_policy_alignment",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.ndp_policy_alignment",
          step: PROJECT_STEPS.NDP,
          app: ["jm"],
        },
        {
          field: "ndp_compliance",
          phases: [1, 2, 3, 4, 5],
          translation: "validation.ndp_compliance",
          step: PROJECT_STEPS.NDP,
          app: ["jm"],
        },
        {
          field: "default_option_name",
          phases: [1, 2],
          translation: "validation.default_option_name",
          step: PROJECT_STEPS.OPTIONS_ANALYSIS,
          app: ["jm"],
        },
        {
          field: "default_option_description",
          phases: [1, 2],
          translation: "validation.default_option_description",
          step: PROJECT_STEPS.OPTIONS_ANALYSIS,
          app: ["jm"],
        },
        {
          field: "default_option_description_impact",
          phases: [1, 2],
          translation: "validation.default_option_description_impact",
          step: PROJECT_STEPS.OPTIONS_ANALYSIS,
          app: ["jm"],
        },
        {
          field: "project_options",
          phases: [1],
          innerFields: [
            "name",
            "description",
            "swot_analysis",
            "start_date",
            "end_date",
            "capital_expenditure",
            "funding_modality",
          ],
          translation: "validation.project_options",
          step: PROJECT_STEPS.OPTIONS_ANALYSIS,
          app: ["jm"],
        },
        {
          field: "project_options",
          phases: [2],
          innerFields: [
            "name",
            "description",
            "swot_analysis",
            "start_date",
            "end_date",
            "capital_expenditure",
            "funding_modality",
            "financial_evaluation",
            "economic_evaluation",
            "stakeholder_evaluations",
          ],
          translation: "validation.project_options",
          step: PROJECT_STEPS.OPTIONS_ANALYSIS,
          app: ["jm"],
        },
        {
          field: "project_options",
          phases: [4],
          innerFields: [
            "building_blocks",
            "financial_evaluation",
            "economic_evaluation",
            "stakeholder_evaluations",
            "risk_evaluations",
          ],
          translation: "validation.project_options",
          step: PROJECT_STEPS.OPTIONS_ANALYSIS,
          app: ["ug"],
        },
        {
          field: "climate_risks",
          phases: [2],
          innerFields: [
            "climate_hazard",
            "exposure_risk",
            "vulnerability_risk",
            "overall_risk",
            "vulnerability_impact",
          ],
          translation: "validation.climate_risks",
          step: PROJECT_STEPS.CLIMATE_RISK_ASSESSMENT,
          app: ["jm"],
        },
        {
          field: "project_risks",
          phases: [2],
          innerFields: [
            "name",
            "impact_level",
            "probability",
            "score",
            "response",
            "owner",
          ],
          translation: "validation.project_risks",
          step: PROJECT_STEPS.RISK_ASSESSMENT,
          app: ["jm"],
        },
      ];
};

export const FILE_TYPES = {
  MANDATORY: "MANDATORY",
};

export const DEFAULT_MEDIA_EXTENSIONS = [
  { id: ".xls", name: "Microsoft Excel (.xls)" },
  { id: ".xlsx", name: "Microsoft Excel (.xlsx)" },
  { id: ".doc", name: "Microsoft Word (.doc)" },
  { id: ".docx", name: "Microsoft Word (.docx)" },
  { id: ".csv", name: "Comma Separated File" },
  { id: ".pdf", name: "Adobe Acrobat PDF" },
  { id: null, name: "ALL" },
];

export const PROJECT_TYPE = {
  INFRASTRUCTURE: "infrastructure",
  ACQUISITION: "simple_acquisition",
  INITIAL: "initial",
};

export const STRATEGIC_VALUES = {
  PLANS: [
    {
      id: "Plano Quinquenal do Governo",
      name: "Plano Quinquenal do Governo",
    },
    {
      id: "Estratégia Nacional de Desenvolvimento",
      name: "Estratégia Nacional de Desenvolvimento",
    },
    {
      id: "Plano Estratégico Territorial",
      name: "Plano Estratégico Territorial",
    },
    {
      id: "Plano Estratégico do Sector",
      name: "Plano Estratégico do Sector",
    },
    {
      id: "Plano Nacional Plurianual de Investimento Público",
      name: "Plano Nacional Plurianual de Investimento Público",
    },
    { id: "Plano Económico e Social", name: "Plano Económico e Social" },
    { id: "Programa Regional (SADC)", name: "Programa Regional (SADC)" },
  ],
  OBJECTIVES: {
    "Plano Quinquenal do Governo": [
      { id: "Prioridade I", name: "Prioridade I" },
      { id: "Prioridade II", name: "Prioridade II" },
      { id: "Prioridade III", name: "Prioridade III" },
      { id: "Prioridade IV", name: "Prioridade IV" },
      { id: "Prioridade V", name: "Prioridade V" },
    ],
    "Estratégia Nacional de Desenvolvimento": [
      { id: "Estratégia 01", name: "Estratégia 01" },
      { id: "Estratégia 02", name: "Estratégia 02" },
      { id: "Estratégia 03", name: "Estratégia 03" },
      { id: "Estratégia 04", name: "Estratégia 04" },
      { id: "Estratégia 05", name: "Estratégia 05" },
      { id: "Estratégia 06", name: "Estratégia 06" },
    ],
    "Plano Estratégico Territorial": [
      {
        id: "Objectivo Territorial 01",
        name: "Objectivo Territorial 01",
      },
      {
        id: "Objectivo Territorial 02",
        name: "Objectivo Territorial 02",
      },
      {
        id: "Objectivo Territorial 03",
        name: "Objectivo Territorial 03",
      },
      {
        id: "Objectivo Territorial 04",
        name: "Objectivo Territorial 04",
      },
      {
        id: "Objectivo Territorial 05",
        name: "Objectivo Territorial 05",
      },
      {
        id: "Objectivo Territorial 06",
        name: "Objectivo Territorial 06",
      },
    ],
    "Plano Estratégico do Sector": [
      { id: "Objectivo Sectorial 01", name: "Objectivo Sectorial 01" },
      { id: "Objectivo Sectorial 02", name: "Objectivo Sectorial 02" },
      { id: "Objectivo Sectorial 03", name: "Objectivo Sectorial 03" },
      { id: "Objectivo Sectorial 04", name: "Objectivo Sectorial 04" },
      { id: "Objectivo Sectorial 05", name: "Objectivo Sectorial 05" },
      { id: "Objectivo Sectorial 06", name: "Objectivo Sectorial 06" },
    ],
    "Plano Nacional Plurianual de Investimento Público": [
      { id: "Objectivo 01", name: "Objectivo 01" },
      { id: "Objectivo 02", name: "Objectivo 02" },
      { id: "Objectivo 03", name: "Objectivo 03" },
      { id: "Objectivo 04", name: "Objectivo 04" },
      { id: "Objectivo 05", name: "Objectivo 05" },
      { id: "Objectivo 06", name: "Objectivo 06" },
    ],
    "Plano Económico e Social": [
      { id: "Objectivo PES 01", name: "Objectivo PES 01" },
      { id: "Objectivo PES 02", name: "Objectivo PES 02" },
      { id: "Objectivo PES 03", name: "Objectivo PES 03" },
      { id: "Objectivo PES 04", name: "Objectivo PES 04" },
      { id: "Objectivo PES 05", name: "Objectivo PES 05" },
      { id: "Objectivo PES 06", name: "Objectivo PES 06" },
    ],
    "Programa Regional (SADC)": [
      { id: "Objectivo Regional 01", name: "Objectivo Regional 01" },
      { id: "Objectivo Regional 02", name: "Objectivo Regional 02" },
      { id: "Objectivo Regional 03", name: "Objectivo Regional 03" },
      { id: "Objectivo Regional 04", name: "Objectivo Regional 04" },
      { id: "Objectivo Regional 05", name: "Objectivo Regional 05" },
      { id: "Objectivo Regional 06", name: "Objectivo Regional 06" },
    ],
  },
};

export const QUARTERS = [
  { id: "Q1", name: "Q1" },
  { id: "Q2", name: "Q2" },
  { id: "Q3", name: "Q3" },
  { id: "Q4", name: "Q4" },
];

export const ADDITIONAL_SOURCES = [
  { id: "CF", name: "Contractual Financing" },
  { id: "AF", name: "Alternative financing" },
  { id: "BF", name: "Bridge Financing" },
  { id: "JV", name: "Joint Venture" },
];

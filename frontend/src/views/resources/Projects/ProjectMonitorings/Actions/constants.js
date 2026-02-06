export const VALIDATION_FIELDS_ME = [
  "year",
  "quarter",
  "data_collection_type",
  "me_type",
  "effectiveness_date",
  "summary",
  "rational_study",
  "methodology",
  "challenges",
  "recommendations",
  "lessons_learned",
  "me_outputs",
  "me_activities",
  "issues",

  // me_outputs[].indicators[].target
  // me_outputs[].output_progress
  // me_outputs[].output_status
  // me_outputs[].risk_description
  // me_outputs[].risk_response

  // me_activities[].budget_appropriation
  // me_activities[].budget_allocation
  // me_activities[].budget_supplemented
  // me_activities[].financial_execution
  // me_activities[].fund_source

  // issues[].issue
  // issues[].challenges -> issues[].issue !== "No issues"
  // issues[].recommendations -> issues[].issue !== "No issues"
];

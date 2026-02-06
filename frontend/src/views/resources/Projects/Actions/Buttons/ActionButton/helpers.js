import lodash from "lodash";
import { checkFeature } from "../../../../../../helpers/checkPermission";

export function validateProjectDetails(props) {
  const { details } = props;
  const detailsValidationError = [];

  if (lodash.isEmpty(details)) {
    return detailsValidationError;
  }

  if (details.outcomes && details.outcomes.length > 2) {
    detailsValidationError.push(props.translate("messages.max_outcomes"));
  }

  if (
    details.outputs &&
    details.outputs.filter(
      (item) => item.outcome_ids && item.outcome_ids.length > 2
    ).length !== 0
  ) {
    detailsValidationError.push(
      props.translate("messages.max_outcomes_per_output")
    );
  }

  if (details.phase_id >= 1) {
    if (
      details.outputs &&
      details.outputs.filter(
        (item) => item.activities && item.activities.length === 0
      ).length !== 0
    ) {
      detailsValidationError.push(
        props.translate("messages.min_activity_per_output")
      );
    }
  }

  if (checkFeature("project_options_best_item_validation", details.phase_id)) {
    if (
      details.project_options &&
      details.project_options.filter((item) => item.is_shortlisted).length > 3
    ) {
      detailsValidationError.push(
        props.translate("messages.max_shortlisted_options")
      );
    }
    if (
      details.project_options &&
      details.project_options.filter((item) => item.is_shortlisted).length === 0
    ) {
      detailsValidationError.push(
        props.translate("messages.min_selected_option")
      );
    }
    if (
      details.project_options &&
      details.project_options.filter((item) => item.is_preferred).length > 1
    ) {
      detailsValidationError.push(props.translate("messages.max_best_option"));
    }
    if (
      details.project_options &&
      details.project_options.filter((item) => item.is_preferred).length === 0
    ) {
      detailsValidationError.push(props.translate("messages.min_best_option"));
    }
  }

  return detailsValidationError;
}

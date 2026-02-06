// in src/comments/ApproveButton.js
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { showNotification, translate } from "react-admin";
import { push } from "react-router-redux";
import { Button } from "react-admin";
import lodash from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";

import ArrowForward from "@material-ui/icons/ArrowForward";

import dataProvider from "../../../providers/dataProvider";
import { VALIDATION_FIELDS } from "../../../constants/common";
import { checkFeature } from "../../../../../helpers/checkPermission";
import { PROJECT_STEPS } from "../../../../../constants/common";

class SubmitButton extends Component {
  state = {
    isFetching: false,
    data: {},
    validationErrors: [],
  };

  componentDidMount() {
    if (this.props.data) {
      dataProvider("GET_ONE", "project-details", {
        id: this.props.data.project_detail_id,
      }).then((response) => {
        this.setState({ data: response.data });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      dataProvider("GET_ONE", "project-details", {
        id: nextProps.data.project_detail_id,
      }).then((response) => {
        this.setState({ data: response.data });
      });
    }
  }

  getRequiredFilesForPhase = (file_types, phase_id) =>
    file_types
      .filter(
        (item) =>
          item.phase_ids.includes(phase_id) && item.is_required === "yes"
      )
      .map((item) => item.id);

  validateFiles = (record) => {
    const { data } = this.state;
    const fileValidationError = [];
    const requiredFiles = this.getRequiredFilesForPhase(
      data.file_types,
      data.phase_id
    );

    if (requiredFiles && requiredFiles.length !== 0) {
      if (!data.files || data.files.length === 0) {
        fileValidationError.push(this.props.translate("messages.no_files"));
        return fileValidationError;
      }
    }

    const files = data.files.map((item) => item.file_type_id);
    const result = requiredFiles.filter((item) => !files.includes(item));
    const notLoadedFiles =
      result.length !== 0 &&
      result
        .map((id) =>
          data.file_types
            .filter((item) => item.id === id)
            .map((item) => item.name)
        )
        .join(", ");

    if (result.length !== 0) {
      fileValidationError.push(
        `${this.props.translate(
          "messages.no_file_type"
        )} "${notLoadedFiles}" - ${this.props.translate(
          "messages.no_file_action"
        )}`
      );
    }

    return fileValidationError;
  };

  validateProjectDetails = () => {
    const { data } = this.state;
    const detailsValidationError = [];

    if (
      checkFeature("project_result_matrix_has_max_2_outcomes") &&
      data.outcomes &&
      data.outcomes.length > 2
    ) {
      detailsValidationError.push(
        this.props.translate("messages.max_outcomes")
      );
    }

    if (
      data.outputs &&
      data.outputs.filter((item) => item.outcome_ids.length > 2).length !== 0
    ) {
      detailsValidationError.push(
        this.props.translate("messages.max_outcomes_per_output")
      );
    }

    if (checkFeature("project_options_best_item_validation", data.phase_id)) {
      if (
        data.project_options &&
        data.project_options.filter((item) => item.is_shortlisted).length > 3
      ) {
        detailsValidationError.push(
          this.props.translate("messages.max_shortlisted_options")
        );
      }
      if (
        data.project_options &&
        data.project_options.filter((item) => item.is_shortlisted).length === 0
      ) {
        detailsValidationError.push(
          this.props.translate("messages.min_selected_option")
        );
      }
      if (
        data.project_options &&
        data.project_options.filter((item) => item.is_preferred).length > 1
      ) {
        detailsValidationError.push(
          this.props.translate("messages.max_best_option")
        );
      }
      if (
        data.project_options &&
        data.project_options.filter((item) => item.is_preferred).length === 0
      ) {
        detailsValidationError.push(
          this.props.translate("messages.min_best_option")
        );
      }
    }

    return detailsValidationError;
  };

  validateFieldsByPhase = (record) => {
    const RETOOLING_SKIPPED_STEPS = [
      PROJECT_STEPS.BEHAVIOR_CHANGE,
      PROJECT_STEPS.INTRODUCTION,
      PROJECT_STEPS.OM_COSTS,
      PROJECT_STEPS.OPTIONS_ANALYSIS,
    ];
    const { data } = this.state;

    const validationFields = VALIDATION_FIELDS();
    const emptyFields = validationFields
      .filter((item) => {
        const isRetoolingProject =
          data?.project?.classification === "RETOOLING" ||
          data?.project?.classification === "STUDIES";

        if (checkFeature("has_retooling_skip_phases") && isRetoolingProject) {
          return !RETOOLING_SKIPPED_STEPS.includes(item.step);
        }

        return true;
      })
      .filter((item) => {
        if (item.phases.includes(data.phase_id)) {
          if (
            item.field === "ndp_type" &&
            data.in_ndp === 1 &&
            data.ndp_type === "core"
          ) {
            if (!data.ndp_name || !data.ndp_page_no || !data.ndp_focus_area) {
              return true;
            }
          }
          if (
            item.field === "ndp_type" &&
            data.in_ndp === 1 &&
            data.ndp_type === "priority"
          ) {
            if (!data.intervention || !data.ndp_focus_area) {
              return true;
            }
          }
          if (item.field === "ndp_type" && data.in_ndp === 0) {
            if (!data.ndp_strategic_directives) {
              return true;
            }
          }
          if (!data[item.field]) {
            return true;
          }
          if (
            data[item.field] &&
            lodash.isArray(data[item.field]) &&
            lodash.isEmpty(data[item.field])
          ) {
            return true;
          }
        }
        return false;
      })
      .map((item) => item.field);

    if (emptyFields && emptyFields.length !== 0) {
      return `Fields are empty: ${emptyFields.join(", ")}`;
    }

    return [];
  };

  handleClick = () => {
    const { push, record, showNotification, action, data } = this.props;
    const filesError = this.validateFiles(record);
    const detailsError = this.validateProjectDetails(record);
    const fieldsError = this.validateFieldsByPhase(record);

    const result = lodash.concat(filesError, detailsError, fieldsError);

    if (result.length === 0) {
      return this.handleWorkFlowStep(action, data);
    }

    result.forEach((msg) => {
      if (msg) {
        showNotification(msg, "warning");
      }
    });
  };

  handleWorkFlowStep = (action, params) => {
    const requestParams = {
      data: {
        action: action,
      },
      id: params.id,
    };

    dataProvider("UPDATE", "projects", requestParams)
      .then((response) => {
        this.props.showNotification(
          this.props.translate("workflow.messages.status_change")
        );
        this.setState({ isFetching: false, showDialog: false });
        this.props.onRefresh(response.data);
      })
      .catch((err) => {
        this.props.showNotification(
          this.props.translate("workflow.messages.status_not_change"),
          "warning"
        );
        this.setState({ isFetching: false, showDialog: false });
      });
  };

  render() {
    const text = this.state.isFetching ? (
      <Fragment>
        <CircularProgress size={25} thickness={2} />
        <span style={{ marginLeft: "10px" }}>
          {this.props.translate("buttons.submit")}
        </span>
      </Fragment>
    ) : (
      this.props.translate("buttons.submit")
    );
    const content = this.state.isFetching ? (
      <CircularProgress size={25} thickness={2} />
    ) : (
      <ArrowForward />
    );
    return (
      <Button
        label={this.props.translate("buttons.submit")}
        onClick={this.handleClick}
      >
        {content}
      </Button>
    );
  }
}

SubmitButton.propTypes = {
  push: PropTypes.func,
  record: PropTypes.object,
  showNotification: PropTypes.func,
};

export default translate(
  connect(null, {
    showNotification,
    push,
  })(SubmitButton)
);

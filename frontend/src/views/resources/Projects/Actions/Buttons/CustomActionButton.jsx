// import {
//     ACTION_TYPES,
//     API_URL,
//     PROJECT_STATUS,
//     USER_ROLES,
// } from '../../../constants/common';
import {
  Button,
  CREATE,
  LongTextInput,
  REDUX_FORM_NAME,
  SaveButton,
  SimpleForm,
  TextInput,
  fetchEnd,
  fetchStart,
  required,
  showNotification,
  translate,
} from "react-admin";
// in src/comments/ApproveButton.js
import React, { Component, Fragment } from "react";
// import { change, isSubmitting, submit } from 'redux-form';

import ArrowForward from "@material-ui/icons/ArrowForward";
import Assignment from "@material-ui/icons/Assignment";
import Cancel from "@material-ui/icons/Cancel";
import Check from "@material-ui/icons/Check";
import CircularProgress from "@material-ui/core/CircularProgress";
// import CustomFileLoader from '../../../components/customFileLoader';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
// import PropTypes from 'prop-types';
import Refresh from "@material-ui/icons/Refresh";
import Select from "@material-ui/core/Select";
// import { connect } from 'react-redux';
// import dataProvider from '../../../providers/dataProvider';
import lodash from "lodash";
import {
  ACTION_TYPES,
  USER_ROLES,
  PROJECT_STATUS,
} from "../../../../../constants/common";
import { validateOptionsBeforeSave } from "../../../../../helpers";
import { validateFieldsByPhase } from "../../validation";
import { TextField } from "@material-ui/core";
import { checkFeature } from "../../../../../helpers/checkPermission";
import FileUploader from "../../../../components/FileUploader";
// import { validateFieldsByPhase } from '../validation';
// import { validateOptionsBeforeSave } from '../helpers';

class CustomActionButton extends Component {
  state = {
    isFetching: false,
    showDialog: false,
    targetUser: null,
    decision: "",
    getValidation: false,
    fileUploaded: false,
    additionalFileUploaded: false,
    fileSelected: false,
    additionalFileSelected: false,
    showConfirmationPopup: false,
    data: this.props.data,
    approvedUploading: false
  };

  componentDidUpdate(prevProps, prevState) {
    const { fileUploaded, additionalFileUploaded, showDialog } = this.state;
    const {
      action,
      data,
      isFetching,
      isSubmitted,
      filesValidation,
    } = this.props;

    if (filesValidation) {
      if (fileUploaded && additionalFileUploaded) {
        if (!isFetching && !isSubmitted && showDialog) {
          this.handleWorkFlowStep(action, data);
        }
      }
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
    const { details } = this.props;
    // const { data } = this.state;
    const fileValidationError = [];

    if (lodash.isEmpty(details)) {
      return fileValidationError;
    }

    // const requiredFiles = this.getRequiredFilesForPhase(
    //   data.file_types,
    //   data.phase_id
    // );

    if (this.props.fileTyes && this.props.fileTyes.length !== 0) {
      if (!details.files || details.files.length === 0) {
        fileValidationError.push(this.props.translate("messages.no_files"));
        return fileValidationError;
      }
    }

    const files =
      details.files &&
      details.files
        .filter((item) => {
          const meta = JSON.parse(item.meta);
          return meta.relatedField;
        })
        .map((item) => {
          const meta = JSON.parse(item.meta);
          return meta.relatedField;
        });

    const result = this.props.fileTypes.filter(
      (item) => files && !files.includes(item.name)
    );

    const notLoadedFiles =
      result.length !== 0 &&
      result
        .map((id) =>
          this.props.file_types
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
    const { details } = this.props;
    const detailsValidationError = [];

    if (lodash.isEmpty(details)) {
      return detailsValidationError;
    }

    if (details.outcomes && details.outcomes.length > 2) {
      detailsValidationError.push(
        this.props.translate("messages.max_outcomes")
      );
    }

    if (
      details.outputs &&
      details.outputs.filter(
        (item) => item.outcome_ids && item.outcome_ids.length > 2
      ).length !== 0
    ) {
      detailsValidationError.push(
        this.props.translate("messages.max_outcomes_per_output")
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
          this.props.translate("messages.min_activity_per_output")
        );
      }
    }

    if (
      checkFeature("project_options_best_item_validation", details.phase_id)
    ) {
      if (
        details.project_options &&
        details.project_options.filter((item) => item.is_shortlisted).length > 3
      ) {
        detailsValidationError.push(
          this.props.translate("messages.max_shortlisted_options")
        );
      }
      if (
        details.project_options &&
        details.project_options.filter((item) => item.is_shortlisted).length ===
          0
      ) {
        detailsValidationError.push(
          this.props.translate("messages.min_selected_option")
        );
      }
      if (
        details.project_options &&
        details.project_options.filter((item) => item.is_preferred).length > 1
      ) {
        detailsValidationError.push(
          this.props.translate("messages.max_best_option")
        );
      }
      if (
        details.project_options &&
        details.project_options.filter((item) => item.is_preferred).length === 0
      ) {
        detailsValidationError.push(
          this.props.translate("messages.min_best_option")
        );
      }
    }

    return detailsValidationError;
  };

  getValidationMessages = () => {
    const { details } = this.props;
    const { translate } = this.props;
    const emptyFields = validateFieldsByPhase(details);

    if (emptyFields && emptyFields.length !== 0) {
      let resultString = "";
      const result = lodash.groupBy(emptyFields, (item) => item.step);

      for (const key in result) {
        if (result.hasOwnProperty(key)) {
          const element = result[key];
          resultString += `${
            key || translate("validation.empty_fields")
          } - ${element
            .map((item) => `${translate(item.translation)}`)
            .join(", ")}; `;
        }
      }

      return `${translate("validation.empty_fields")}:  ${resultString}`;
    }

    return [];
  };

  handleShowDialog = () => {
    this.setState({ showDialog: true });
  };

  handleHideDialog = () => {
    this.setState({ showDialog: false });
  };

  handleShowConfirmDialog = () => {
    this.setState({ showConfirmationPopup: true });
  };

  handleHideConfirmDialog = () => {
    this.setState({ showConfirmationPopup: false });
  };

  handleWorkFlowStep = (action, params) => {
    const requestParams = {
      data: {
        action: action,
        reason: this.state.decision,
      },
      id: params.id,
    };
    if (action === ACTION_TYPES.ASSIGN) {
      requestParams.data.target_user = this.state.targetUser;
    }

    this.setState({ showDialog: false }, () => {
      this.props.onRefresh(requestParams).then((result) => {
        this.setState({ isFetching: false, decision: "" });
      });
    });
  };

  handleSubmitAction = () => {
    const {
      filesValidation,
      record,
      showNotification,
      action,
      data,
    } = this.props;

    if (this.state.fileSelected) {
      this.setState({ approvedUploading: true });
    }

    // if (!filesValidation) {
    //   if (record && record.project_status !== PROJECT_STATUS.STATUS_DRAFT) {
    //     this.setState({ isFetching: true });
    //     this.handleWorkFlowStep(action, data);
    //   } else {
    //     if (this.getSubmissionValidation().length === 0) {
    //       this.setState({ isFetching: true });
    //       this.handleWorkFlowStep(action, data);
    //     }
    //   }
    // } else {
    //   this.setState({ isFetching: true });
    // }
  };

  handleFileUpload = () => {
    const {
      filesValidation,
      record,
      showNotification,
      action,
      data,
    } = this.props;

    if (this.getSubmissionValidation().length === 0) {
      this.handleWorkFlowStep(action, data);
    }
  };

  renderFileCheckMessage = () => (
    <p style={{ fontStyle: "italic" }}>
      {" "}
      {this.props.translate("workflow.workflow_file_upload")}{" "}
    </p>
  );

  renderIcon() {
    switch (this.props.action) {
      case ACTION_TYPES.SUBMIT:
        return this.getSubmissionValidation().length === 0 ? (
          <ArrowForward />
        ) : (
          <Cancel />
        );
      case ACTION_TYPES.APPROVE:
        return <Check />;
      case ACTION_TYPES.REJECT:
        return <Cancel />;
      case ACTION_TYPES.REVISE:
        return <Refresh />;
      case ACTION_TYPES.ASSIGN:
        return <Assignment />;
      case ACTION_TYPES.ALLOCATE_FUNDS:
        return <Assignment />;
      case ACTION_TYPES.COMPLETE:
        return <Check />;
      default:
        return null;
    }
  }

  getSubmissionValidation = () => {
    const {
      push,
      details,
      record,
      showNotification,
      action,
      data,
      translate,
    } = this.props;
    let optionsErrors = [],
      result = [],
      optionsErrorsMsg;
    // const filesError = this.validateFiles(record);
    const detailsError = this.validateProjectDetails(details);
    const fieldsError = this.getValidationMessages(details);
    if (!details) {
      return false;
    }

    if (details.phase_id >= 2) {
      optionsErrorsMsg = validateOptionsBeforeSave(
        details,
        showNotification,
        translate
      );
      if (lodash.isString(optionsErrorsMsg)) {
        optionsErrors.push(optionsErrorsMsg);
      }
    }

    result = lodash.concat(
      // filesError,
      detailsError,
      fieldsError,
      optionsErrors
    );

    return result;
  };

  handleSubmitActionClick = () => {
    if (this.getSubmissionValidation().length === 0) {
      this.setState({ showDialog: true });
    } else {
      this.getSubmissionValidation().forEach((msg) => {
        if (msg) {
          this.props.showNotification(msg, "warning");
        }
      });
    }
  };

  renderButton() {
    const popupsActions = [
      ACTION_TYPES.SUBMIT,
      ACTION_TYPES.APPROVE,
      ACTION_TYPES.ASSIGN,
      ACTION_TYPES.REJECT,
      ACTION_TYPES.REVISE,
    ];
    let actionClick = popupsActions.includes(this.props.action)
      ? this.handleShowDialog
      : this.handleSubmitAction;

    if (
      this.props.action === ACTION_TYPES.SUBMIT &&
      this.props.currentStep === 1
    ) {
      actionClick = this.handleSubmitActionClick;
    }

    const buttonStyle = {
      color:
        this.props.action === ACTION_TYPES.SUBMIT
          ? this.getSubmissionValidation().length === 0
            ? "green"
            : "red"
          : "",
    };
    const icon = this.renderIcon();
    const text = this.state.isFetching ? (
      <Fragment>
        <CircularProgress size={25} thickness={2} />
        <span style={{ marginLeft: "10px" }}>
          {this.props.translate(`buttons.${this.props.action.toLowerCase()}`)}
        </span>
      </Fragment>
    ) : (
      this.props.translate(`buttons.${this.props.action.toLowerCase()}`)
    );

    return (
      <Button
        style={buttonStyle}
        label={text}
        onClick={actionClick}
        disabled={this.props.isFetching}
      >
        {icon}
      </Button>
    );
  }

  handleSelectUser = (event) => {
    this.setState({ targetUser: event.target.value });
  };

  handleSelectFile = (event) => {
    this.setState({ selectedFile: event.target.value });
  };

  handleChangeDecision = (event) => {
    this.setState({ decision: event.target.value });
  };

  renderDialogContent = (action) => {
    const { workflow } = this.props.data;
    let title =
      action === ACTION_TYPES.ASSIGN
        ? this.props.translate("workflow.assign")
        : this.props.translate("workflow.decision");

    if (
      this.props.action === ACTION_TYPES.SUBMIT &&
      this.props.currentStep === 1
    ) {
      title = this.props.translate("workflow.comments");
    }

    const content =
      action === ACTION_TYPES.ASSIGN ? (
        <Select
          autoWidth={true}
          value={this.state.targetUser}
          onChange={this.handleSelectUser}
          style={{ width: "100%" }}
          label={this.props.translate("workflow.assign_user")}
        >
          {workflow.target_users.map((user) => (
            <MenuItem
              value={user.id}
            >{`${user.fullname} (${user.email})`}</MenuItem>
          ))}
        </Select>
      ) : null;

    return (
      <Fragment>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div>
            {content}
            <br />
            <TextField
              style={{
                width: "100%",
              }}
              multiline
              rows={3}
              value={this.state.decision}
              onChange={this.handleChangeDecision}
              variant="outlined"
            />
            <br />
            {this.renderPrimaryFileLoader()}
            {this.props.filesValidation && this.renderAdditionalFileLoader()}
          </div>
        </DialogContent>
      </Fragment>
    );
  };

  renderPrimaryFileLoader = () => {
    const { workflow } = this.props.data;

    const entityType =
      workflow && workflow.source_role === USER_ROLES.VAU
        ? "project_detail"
        : "timeline";
    const fileTypeId =
      workflow && workflow.source_role === USER_ROLES.VAU
        ? this.props.record && this.props.record.project_detail_id
        : 0;
    const fileSubtitle = !this.props.filesValidation
      ? null
      : workflow && workflow.source_role === USER_ROLES.PSU
      ? this.props.translate("workflow.workflow_file_upload")
      : workflow.source_role === USER_ROLES.VAU
      ? this.props.translate("workflow.va_file_subtitle")
      : null;
    //meta = {"current_step": N}
    //entity_id = project_id
    //entity_type = timeline
    return (
      <Fragment>
        <FileUploader
          meta={{ current_step: workflow.step, phase_id: this.props.record.phase_id }}
          resource={entityType}
          formData={this.props.data}
          entityId={this.props.record && this.props.record.id}
          fileSelected={this.state.fileSelected}
          approvedUploading={this.state.approvedUploading}
          placeholder={this.props.translate("titles.drop_files")}
          onFileUpload={this.handleFileUpload}
          onFileSelect={this.handleSelectFile}
          // isSubmitted={this.state.isFetching}
          // filesValidation={this.props.filesValidation}
        />
        <p style={{ fontStyle: "italic" }}>{fileSubtitle}</p>
      </Fragment>
    );
  };

  renderAdditionalFileLoader = () => {
    const { workflow } = this.props.data;
    const relatedField = (workflow && String(workflow.step) + "_1") || 0;
    const entityType =
      workflow && workflow.source_role === USER_ROLES.VAU
        ? "project_detail"
        : "timeline";
    const fileTypeId =
      workflow && workflow.source_role === USER_ROLES.VAU
        ? this.props.record && this.props.record.project_detail_id
        : 0;
    const fileSubtitle = !this.props.filesValidation
      ? null
      : workflow && workflow.source_role === USER_ROLES.PSU
      ? this.props.translate("workflow.workflow_additional_file_upload")
      : workflow.source_role === USER_ROLES.VAU
      ? this.props.translate("workflow.va_additionalFile_subtitle")
      : null;

    return (
      <Fragment>
        {/* <CustomFileLoader
                    entityType={entityType}
                    fileTypeId={fileTypeId}
                    formData={this.props.data}
                    entityId={
                        this.props.record && this.props.record.project_detail_id
                    }
                    relatedField={relatedField}
                    isSubmitted={this.state.isFetching}
                    onFileSelect={this.handleSelectAdditionalFile}
                    onFileUpload={this.handleUploadAdditionalFile}
                    filesValidation={this.props.filesValidation}
                /> */}
        <p style={{ fontStyle: "italic" }}>{fileSubtitle}</p>
      </Fragment>
    );
  };

  handleSelectFile = (selected) => {
    this.setState({ fileSelected: selected });
  };

  handleSelectAdditionalFile = () => {
    this.setState({ additionalFileSelected: true });
  };

  handleUploadFile = () => {
    this.setState({ fileUploaded: true });
  };

  handleUploadAdditionalFile = () => {
    this.setState({ additionalFileUploaded: true });
  };

  checkSaveButton = () => {
    const { record, action, filesValidation } = this.props;
    const { isFetching, fileSelected, additionalFileSelected } = this.state;

    if (isFetching) {
      return true;
    }

    if (
      filesValidation &&
      record &&
      record.workflow &&
      record.workflow.source_role === USER_ROLES.PSU &&
      (!fileSelected || !additionalFileSelected)
    ) {
      return true;
    }

    if (
      filesValidation &&
      record &&
      record.workflow &&
      record.workflow.source_role === USER_ROLES.VAU &&
      (!fileSelected || !additionalFileSelected)
    ) {
      return true;
    }

    if (action === ACTION_TYPES.ASSIGN && !this.state.targetUser) {
      return true;
    }

    return false;
  };

  renderHelpMessage = (action) => {
    switch (action) {
      case ACTION_TYPES.SUBMIT:
        return `Submit means you are submitting the project for approval. You will not be able to take any action on the project after the submission. Please confirm! (Standard User and PAP Standard User, PAP Principal)`;
      case ACTION_TYPES.REVISE:
        return `Revise means you are returning the project for revision. Are you sure you want to revise?!  (Department Head, Planning Head, Accounting Officer, Commissioner PAP, PAP Principal)`;
      case ACTION_TYPES.APPROVE:
        return `Approve means forwarding the project to the next in tier.  Are you sure you want to approve? (Department Head, Planning Head, Accounting Officer, Commissioner PAP, PAP Principal)`;
      case ACTION_TYPES.REJECT:
        return `This action means that the project will be deleted from the system and archived. No further action will be undertaken on it once rejected. Are you sure you want to reject the project? (Department Head, Planning Head, Accounting Officer, Commissioner PAP.)`;
      default:
        return null;
    }
  };

  render() {
    const { push, record, showNotification, action, config } = this.props;
    const { showDialog, isFetching, fileUploaded } = this.state;
    return (
      <Fragment>
        {this.renderButton()}
        <Dialog
          fullWidth
          open={showDialog}
          onClose={this.handleHideDialog}
          aria-label={this.props.translate("workflow.assign")}
        >
          {this.renderDialogContent(action)}
          <DialogActions>
            <Fragment>
              <Button
                label="Save"
                disabled={this.checkSaveButton()}
                saving={isFetching}
                onClick={this.handleShowConfirmDialog}
              />
              <Dialog
                open={this.state.showConfirmationPopup}
                onClose={this.handleHideConfirmDialog}
                aria-label={this.props.translate(
                  "messages.project_reject_confirmation"
                )}
              >
                <DialogTitle>{this.renderHelpMessage(action)}</DialogTitle>
                <DialogActions>
                  <Button
                    onClick={this.handleSubmitAction}
                    label="ra.action.confirm"
                    key="button"
                  >
                    <Check />
                  </Button>
                  <Button
                    label="ra.action.cancel"
                    onClick={this.handleHideConfirmDialog}
                  >
                    <Cancel />
                  </Button>
                </DialogActions>
              </Dialog>
            </Fragment>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default CustomActionButton;

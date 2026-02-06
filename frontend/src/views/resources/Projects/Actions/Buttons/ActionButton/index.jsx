import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  ArrowForward,
  Assignment,
  Cancel,
  Check,
  Refresh,
} from "@material-ui/icons";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslate, useNotify, Button } from "react-admin";
import { ACTION_TYPES, USER_ROLES } from "../../../../../../constants/common";
import ConfirmationDialog from "./ConfirmationDialog";
import lodash from "lodash";
import { checkFeature } from "../../../../../../helpers/checkPermission";
import { validateOptionsBeforeSave } from "../../../../../../helpers";
import { fileValidation, validateFieldsByPhase } from "../../../validation";
import FilesUploaderSection from "./FilesUploaderSection";
import { validateProjectDetails } from "./helpers";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  textarea: {
    padding: "0 !important",
    width: "100%",
  },
}));

let counter = 0;

function ActionButton(props) {
  const classes = useStyles();
  const translate = useTranslate();
  const showNotification = useNotify();
  const [filesUploaded, setFilesUploaded] = useState(0);
  const [filesSelected, setFilesSelected] = useState(0);
  const [issues, setIssues] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [decision, setDecision] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const { push, record, action, currentStep } = props;
  const appConfig = useSelector((state) => state.app.appConfig);

  useEffect(() => {
    if (props.filesValidation) {
      if (
        isConfirmed &&
        filesSelected === filesUploaded &&
        filesSelected === props.mandatoryFiles.length
      ) {
        handleSubmit();
      }
    } else {
      if (isConfirmed) {
        if (filesSelected > 0 && filesSelected === filesUploaded) {
          handleSubmit();
        } else {
          handleSubmit();
        }
      }
    }
  }, [filesUploaded]);

  useEffect(() => {
    if (
      props.filesValidation &&
      isConfirmed &&
      filesSelected === filesUploaded &&
      filesSelected === props.mandatoryFiles.length
    ) {
      handleSubmit();
    } else {
      if (isConfirmed && filesSelected === filesUploaded) {
        handleSubmit();
      }
    }
  }, [isConfirmed]);

  function getValidationMessages() {
    const { details } = props;
    const { translate } = props;
    const emptyFields = validateFieldsByPhase(
      details,
      false,
      appConfig.application_config.prefix
    );

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
  }

  function getSubmissionValidation() {
    const {
      push,
      details,
      record,
      showNotification,
      action,
      data,
      translate,
      fileTypes,
    } = props;
    let optionsErrors = [],
      result = [],
      optionsErrorsMsg;
    // const filesError = validateFiles(record);
    const filesError = fileValidation(details, fileTypes)
      ? "No Mandatory Files"
      : [];
    const detailsError = validateProjectDetails({ ...details, translate });
    const fieldsError = getValidationMessages(details);
    if (!details) {
      return false;
    }

    if (checkFeature("project_options_validate_options", details.phase_id)) {
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
      filesError,
      detailsError,
      fieldsError,
      optionsErrors
    );

    return result;
  }

  function renderIcon() {
    switch (action) {
      case ACTION_TYPES.SUBMIT:
        if (currentStep === 1) {
          return getSubmissionValidation().length === 0 ? (
            <ArrowForward />
          ) : (
            <Cancel />
          );
        }
        return <ArrowForward />;
      case ACTION_TYPES.APPROVE:
      case ACTION_TYPES.CONDITIONALLY_APPROVE:
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

  function handleSubmitActionClick() {
    if (getSubmissionValidation().length === 0) {
      setShowActionPopup(true);
    } else {
      getSubmissionValidation().forEach((msg) => {
        if (msg) {
          showNotification(msg, "warning");
        }
      });
    }
  }

  function handleShowDialog() {
    setShowActionPopup(true);
  }

  function handleSubmitAction() {
    alert("handleSubmitAction");
  }

  function renderButton() {
    const popupsActions = [
      ACTION_TYPES.SUBMIT,
      ACTION_TYPES.APPROVE,
      ACTION_TYPES.ASSIGN,
      ACTION_TYPES.REJECT,
      ACTION_TYPES.REVISE,
    ];

    let actionClick = handleShowDialog;

    if (action === ACTION_TYPES.SUBMIT && currentStep === 1) {
      actionClick = handleSubmitActionClick;
    }

    const buttonStyle = {
      color:
        action === ACTION_TYPES.SUBMIT && currentStep === 1
          ? getSubmissionValidation().length === 0
            ? "green"
            : "red"
          : "",
    };
    const icon = renderIcon();
    let text = isFetching ? (
      <Fragment>
        <CircularProgress size={25} thickness={2} />
        <span style={{ marginLeft: "10px" }}>
          {translate(`buttons.${action.toLowerCase()}`)}
        </span>
      </Fragment>
    ) : (
      translate(`buttons.${action.toLowerCase()}`)
    );

    if (checkFeature("has_ibp_fields")) {
      if (currentStep === 16) {
        let changedText = action;
        if (action === "CONDITIONALLY_APPROVE") {
          changedText = "revise";
        }
        if (action === "REVISE") {
          changedText = "differ";
        }

        text = isFetching ? (
          <Fragment>
            <CircularProgress size={25} thickness={2} />
            <span style={{ marginLeft: "10px" }}>
              {translate(`buttons.${changedText.toLowerCase()}`)}
            </span>
          </Fragment>
        ) : (
          translate(`buttons.${changedText.toLowerCase()}`)
        );
      }
    }

    return (
      <Button
        style={buttonStyle}
        label={text}
        onClick={actionClick}
        disabled={isFetching}
      >
        {icon}
      </Button>
    );
  }

  function handleSubmit() {
    if (props.filesValidation) {
      if (filesSelected === props.mandatoryFiles.length) {
        handleWorkFlowStep(props.action, props.data);
      } else {
        alert("No mandatory files in attachments!");
      }
    } else {
      handleWorkFlowStep(props.action, props.data);
    }
  }

  function handleCancel() {
    setShowConfirmPopup(false);
    setShowActionPopup(false);

    setIsFetching(false);
    setTargetUser(null);
    setDecision("");
    setRecommendations("");
    setIssues("");
    setFilesSelected(0);
    setFilesUploaded(0);
    counter = 0;
  }

  function handleApproveStep() {
    setIsConfirmed(true);
  }

  function handleCloseActionPopup() {
    setShowActionPopup(false);

    setIsFetching(false);
    setTargetUser(null);
    setDecision("");
    setRecommendations("");
    setIssues("");
    setFilesSelected(0);
    setFilesUploaded(0);
    counter = 0;
  }

  function handleShowConfirmationPopup() {
    setShowConfirmPopup(true);
  }

  function checkSaveButton() {
    const { record, action, filesValidation } = props;

    if (isFetching) {
      return true;
    }

    if (filesValidation && filesSelected !== props.mandatoryFiles.length) {
      return true;
    }

    if (action === ACTION_TYPES.ASSIGN && !targetUser) {
      return true;
    }

    if (
      checkFeature("has_pimis_fields") &&
      props.data &&
      props.data.workflow &&
      props.data.workflow.additional_data &&
      props.data.workflow.additional_data.submit_project_analysis
    ) {
      if (!recommendations || !issues) {
        return true;
      }
    }

    return false;
  }

  function handleChangeDecision(event) {
    setDecision(event.target.value);
  }

  function handleSelectUser(event) {
    setTargetUser(event.target.value);
  }

  function handleFileSelect(event) {
    const filesSelectedResult = filesSelected + 1;
    setFilesSelected(filesSelectedResult);
  }

  function handleDeleteSelected() {
    const filesSelectedResult = filesSelected - 1;
    setFilesSelected(filesSelectedResult);
  }

  function handleFileUpload(uploadedFile) {
    counter += 1;
    setFilesUploaded(counter);
    // props.onUploadFiles(uploadedFile);
  }

  function handleChangeIssues(event) {
    setIssues(event.target.value);
  }

  function handleChangeRecommendations(event) {
    setRecommendations(event.target.value);
  }

  function renderDialogContent(action) {
    const { workflow, assignable_users } = props.data;
    let title =
      action === ACTION_TYPES.ASSIGN
        ? translate("workflow.assign")
        : translate("workflow.decision");

    if (action === ACTION_TYPES.SUBMIT) {
      title = translate("workflow.comments");
    }

    const additionalContent =
      checkFeature("has_pimis_fields") &&
      workflow &&
      workflow.additional_data &&
      workflow.additional_data.submit_project_analysis ? (
        <>
          <Typography variant="caption">Issues</Typography>
          <TextField
            className={classes.textarea}
            multiline
            rows={3}
            value={issues}
            onChange={handleChangeIssues}
            variant="outlined"
          />
          <br />
          <Typography variant="caption">Recommendations</Typography>
          <TextField
            className={classes.textarea}
            multiline
            rows={3}
            value={recommendations}
            onChange={handleChangeRecommendations}
            variant="outlined"
          />
          <br />
        </>
      ) : null;

    const content =
      action === ACTION_TYPES.ASSIGN ? (
        <>
          <Typography variant="caption">
            {translate("workflow.assign_user")}
          </Typography>
          <Select
            autoWidth={true}
            value={targetUser}
            placeholder={translate("workflow.assign_user")}
            onChange={handleSelectUser}
            style={{ width: "100%" }}
            label={translate("workflow.assign_user")}
            variant="outlined"
          >
            {assignable_users &&
              assignable_users.map((user) => (
                <MenuItem
                  value={user.id}
                >{`${user.full_name} (${user.username})`}</MenuItem>
              ))}
          </Select>
          <br />
        </>
      ) : null;

    if (action === ACTION_TYPES.ASSIGN && !checkFeature("has_pimis_fields")) {
      return <DialogContent>{content}</DialogContent>;
    }

    return (
      <Fragment>
        <DialogContent>
          {content}
          {additionalContent ? (
            additionalContent
          ) : (
            <>
              <br />
              <Typography variant="caption">
                {action === ACTION_TYPES.SUBMIT ? "Comments" : "Decision"}
              </Typography>
              <TextField
                className={classes.textarea}
                multiline
                rows={3}
                value={decision}
                onChange={handleChangeDecision}
                variant="outlined"
              />
            </>
          )}
          <br />
          {props.mandatoryFiles && props.mandatoryFiles.length > 0 ? (
            props.mandatoryFiles.map((fileType) => (
              <FilesUploaderSection
                isRequired={props.filesValidation}
                onDeleteSelected={handleDeleteSelected}
                onFileSelect={handleFileSelect}
                onFileUploaded={handleFileUpload}
                type="PRIMARY"
                isConfirmed={isConfirmed}
                fileType={fileType}
                additional_data={workflow?.additional_data || {}}
                // projectAnalysis={
                //   workflow &&
                //   workflow.additional_data &&
                //   workflow.additional_data.submit_project_analysis
                // }
                // completionReport={
                //   workflow &&
                //   workflow.additional_data &&
                //   workflow.additional_data.completion_report
                // }
                // expostReport={
                //   workflow &&
                //   workflow.additional_data &&
                //   workflow.additional_data.expost_report
                // }
                {...props}
              />
            ))
          ) : workflow &&
            workflow.additional_data &&
            workflow.additional_data.hide_uploader ? null : (
            <FilesUploaderSection
              onFileSelect={handleFileSelect}
              onFileUploaded={handleFileUpload}
              type="PRIMARY"
              isConfirmed={isConfirmed}
              {...props}
            />
          )}
          {renderAdditionalContent()}
        </DialogContent>
      </Fragment>
    );
  }

  function renderAdditionalContent() {
    return props.additionalLink ? (
      <a href={props.additionalLink} download>
        Example
      </a>
    ) : null;
  }

  function handleWorkFlowStep(action, params) {
    const requestParams = {
      data: {
        action: action,
        reason: decision,
      },
      id: params.id,
    };
    if (action === ACTION_TYPES.ASSIGN) {
      requestParams.data.assigned_user_id = targetUser;
    }
    if (issues && recommendations) {
      requestParams.data.issues = issues;
      requestParams.data.recommendations = recommendations;
    }

    setIsFetching(true);
    setShowConfirmPopup(false);
    setShowActionPopup(false);
    setIsConfirmed(false);

    props
      .onRefresh(requestParams)
      .then((result) => {
        setIsFetching(false);
        setTargetUser(null);
        setDecision("");
        setRecommendations("");
        setIssues("");
        setFilesSelected(0);
        setFilesUploaded(0);
        counter = 0;
      })
      .catch((err) => {
        setIsFetching(false);
        setTargetUser(null);
        setDecision("");
        setRecommendations("");
        setIssues("");
        setFilesSelected(0);
        setFilesUploaded(0);
        counter = 0;
      });
  }

  return (
    <Fragment>
      {renderButton()}
      <Dialog
        fullWidth
        open={showActionPopup}
        onClose={handleCloseActionPopup}
        aria-label={translate("workflow.assign")}
      >
        {renderDialogContent(action)}
        <DialogActions>
          <Fragment>
            <Button
              label={translate("buttons.confirm")}
              disabled={checkSaveButton()}
              saving={isFetching}
              onClick={handleShowConfirmationPopup}
              variant="contained"
            />
            <ConfirmationDialog
              action={action}
              show={showConfirmPopup}
              onClose={handleCancel}
              onSubmit={handleApproveStep}
            />
          </Fragment>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ActionButton;

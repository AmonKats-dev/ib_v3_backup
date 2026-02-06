import React, { Component, Fragment } from "react";
import {
  useNotify,
  useTranslate,
  useDataProvider,
  useRedirect,
  useRefresh,
} from "react-admin";
import { useSelector } from "react-redux";
import CustomActionButton from "./CustomActionButton";
import {
  ACTION_TYPES,
  USER_ROLES,
  ACTION_PERMISSIONS,
} from "../../../../../constants/common";
import useFileTypes from "../../../../../hooks/useFileTypes";
import {
  checkFeature,
  useCheckPermissions,
} from "../../../../../helpers/checkPermission";
import ActionButton from "./ActionButton";
import CustomEditButton from "./CustomEditButton";
import lodash from "lodash";

function WorkflowActions(props) {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();
  const [isFetching, setIsFetching] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const fileTypes = useFileTypes(props.record.phase_id);
  const userInfo = useSelector((state) => state.user.userInfo);
  const checkPermission = useCheckPermissions();
  // console.log(props.record, "props.record");
  if (!props.record) return null;

  const handleRefresh = (requestParams) => {
    setIsFetching(true);
    return dataProvider
      .action("projects", requestParams)
      .then((response) => {
        setIsSubmitted(true);
        setIsFetching(false);
        showNotification("workflow.messages.status_change");
        if (response && response.data) {
          if (response.data.phase_id !== props.record.phase_id) {
            redirect(
              `/projects/${response.data.id}/show/${response.data.phase_id}`
            );
            refresh();
          }
        }
        refresh();
      })
      .catch((err) => {
        setIsFetching(false);
        showNotification("workflow.messages.status_not_change", "warning");
      });
  };

  function getMandatoryFiles(action) {
    const { workflow, phase_id } = props.record;
    const isRequiredAction =
      action === ACTION_TYPES.APPROVE || action === ACTION_TYPES.SUBMIT;
    const hasRequiredFileTypes =
      workflow && workflow.file_type_ids && workflow.file_type_ids.length > 0;
    // const hasRequiredAttachments =
    //   workflow &&
    //   workflow.additional_data &&
    //   (workflow.additional_data.submit_project_analysis ||
    //     workflow.additional_data.completion_report ||
    //     workflow.additional_data.expost_report ||
    //     workflow.additional_data.submit_cabinet_submission ||
    //     workflow.additional_data.submit_project_minutes);
    // const hasRequiredPhase =
    //   workflow &&
    //   workflow.additional_data &&
    //   (!workflow.additional_data.phase_ids ||
    //     workflow.additional_data.phase_ids.includes(phase_id));

    return isRequiredAction && hasRequiredFileTypes
      ? //&&
        // hasRequiredAttachments &&
        // hasRequiredPhase
        workflow && workflow.file_type_ids
      : [];
  }

  function getAdditionalLink() {
    // if (
    //   workflow &&
    //   workflow.additional_data &&
    //   workflow.additional_data.completion_report
    // ) {
    //   return "assets/templates/CompletionReport.docx";
    // }

    if (
      workflow &&
      workflow.additional_data &&
      workflow.additional_data.expost_report
    ) {
      return "assets/templates/EvaluationReport.docx";
    }

    return null;
  }

  function renderButtons() {
    const { actions, step, role_id } = props.record.workflow;

    if (
      userInfo.current_role &&
      (Number(role_id) === Number(userInfo.current_role.role_id) ||
        Number(userInfo.current_role.role_id) === 1) //admin role)
    ) {
      return actions
        .filter((itemAction) => checkPermission(ACTION_PERMISSIONS[itemAction]))
        .filter((itemAction) => {
          if (itemAction === "APPROVE" && step === 19) {
            //todo: make feature for that
            return false;
          }
          return true;
        })
        .map((itemAction) => (
          <Fragment key={itemAction}>
            {itemAction === ACTION_TYPES.SUBMIT &&
              props.showEditButtonBeforeSubmit && (
                <CustomEditButton
                  basePath="/project-details"
                  lastDetailId={props.details?.id}
                label={translate("buttons.edit_project_details", {
                  _: "Edit",
                })}
                />
              )}
            <ActionButton
              action={itemAction}
              data={props.record}
              details={props.details}
              onRefresh={handleRefresh}
              currentStep={step}
              isFetching={isFetching}
              isSubmitted={isSubmitted}
              translate={translate}
              fileTypes={fileTypes}
              showNotification={showNotification}
              filesValidation={getMandatoryFiles(itemAction).length > 0}
              mandatoryFiles={getMandatoryFiles(itemAction)}
              additionalLink={getAdditionalLink()}
              {...props}
            />
          </Fragment>
        ));
    } else {
      return null;
    }
  }

  const { workflow } = props.record;
  if (lodash.isEmpty(workflow)) {
    return null;
  }

  return !lodash.isEmpty(workflow) &&
    workflow.actions &&
    workflow.actions.length !== 0
    ? renderButtons()
    : null;
}

export default WorkflowActions;

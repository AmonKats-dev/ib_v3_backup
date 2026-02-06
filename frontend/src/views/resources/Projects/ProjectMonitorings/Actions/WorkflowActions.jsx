// import { Button } from "@material-ui/core";
import React from "react";
import {
  Button,
  useDataProvider,
  useNotify,
  useRefresh,
  useTranslate,
} from "react-admin";
import { useCheckPermissions } from "../../../../../helpers/checkPermission";
import { useSelector } from "react-redux";
import { ME_ACTION_TYPES } from "../../../../../constants/common";
import { ArrowForward, Cancel, Check, Refresh } from "@material-ui/icons";
import { VALIDATION_FIELDS_ME } from "./constants";
import { isArray, isEmpty } from "lodash";

//add props undoable={false} for save without undo
const WorkflowActions = ({
  basePath,
  data,
  resource,
  location,
  projectId,
  id,
  record,
  ...props
}) => {
  const checkPermissions = useCheckPermissions();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const userInfo = useSelector((state) => state.user.userInfo);
  const role_id = record && record.me_workflow && record.me_workflow.role_id;
  const showNotification = useNotify();
  const translate = useTranslate();

  function getSubmissionValidation() {
    let result = VALIDATION_FIELDS_ME.filter((item) => {
      if (!record[item]) {
        return true;
      }
      if (record[item] && isArray(record[item]) && isEmpty(record[item])) {
        return true;
      }

      if (item === "me_outputs" && record[item]) {
        const emptyIndicators = record[item].filter((output) => {
          return output.indicators.filter((indicator) => {
            return !indicator.target;
          }).length;
        });

        return emptyIndicators.length > 0;
      }

      if (item === "me_activities" && record[item]) {
        const activityFields = [
          "budget_appropriation",
          "budget_allocation",
          "budget_supplemented",
          "financial_execution",
          "fund_source",
        ];
        const emptyIActivities = record[item].filter((activity) => {
          const res = activityFields.filter((field) => !activity[field]);
          return res.length > 0;
        });

        return emptyIActivities.length > 0;
      }

      return false;
    });
    return result;
  }

  function renderIcon(action) {
    switch (action) {
      case ME_ACTION_TYPES.SUBMIT:
        return getSubmissionValidation().length === 0 ? (
          <ArrowForward />
        ) : (
          <Cancel />
        );
      case ME_ACTION_TYPES.APPROVE:
        return <Check />;
      case ME_ACTION_TYPES.REVISE:
        return <Refresh />;
      default:
        return null;
    }
  }
  function handleSubmitActionClick() {
    if (getSubmissionValidation().length === 0) {
      handleSubmitAction();
    } else {
      const missedFields = getSubmissionValidation()
        .map((item) => translate(`validation.me_reports.${item}`))
        .join(", ");
      showNotification(`Required fields: ${missedFields}`, "warning");
    }
  }

  function renderButton(action) {
    let actionClick = handleClickAction(String(action).toUpperCase());

    if (
      action === ME_ACTION_TYPES.SUBMIT &&
      record &&
      record.me_workflow &&
      record.me_workflow.step === 1
    ) {
      actionClick = handleSubmitActionClick;
    }

    const buttonStyle = {
      color:
        action === ME_ACTION_TYPES.SUBMIT &&
        record &&
        record.me_workflow &&
        record.me_workflow.step === 1
          ? getSubmissionValidation().length === 0
            ? "green"
            : "red"
          : "",
    };
    const icon = renderIcon();
    let text = translate(`buttons.${action.toLowerCase()}`);

    return (
      <Button style={buttonStyle} label={text} onClick={actionClick}>
        {icon}
      </Button>
    );
  }

  const handleSubmitAction = () => {
    const requestParams = {
      data: {
        action: "SUBMIT",
        reason: "decision",
      },
      id: record.id,
    };
    dataProvider.action("me-reports", requestParams).then((resp) => {
      refresh();
    });
  };

  const handleClickAction = (action) => () => {
    const requestParams = {
      data: {
        action: action,
        reason: "decision",
      },
      id: record.id,
    };
    dataProvider.action("me-reports", requestParams).then((resp) => {
      refresh();
    });
  };

  if (
    userInfo.current_role &&
    (Number(role_id) === Number(userInfo.current_role.role_id) ||
      Number(userInfo.current_role.role_id) === 1) //admin role)
  ) {
    return (
      record &&
      record.me_workflow &&
      record.me_workflow.actions &&
      record.me_workflow.actions
        .filter((item) =>
          checkPermissions(`${String(item).toLowerCase()}_me_report`)
        )
        .map((item) => {
          return renderButton(item);
        })
    );
  }

  return <></>;
};

export default WorkflowActions;

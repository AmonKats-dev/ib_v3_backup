import * as React from "react";

import {
  Button,
  CreateButton,
  EditButton,
  ExportButton,
  ListButton,
  TopToolbar,
  sanitizeListRestProps,
  useDataProvider,
  useListContext,
  useRedirect,
  useShowController,
  useTranslate,
  DeleteButton,
} from "react-admin";
import moment from "moment";
import {
  setProjectGanttChartContent,
  setRigtPanelContent,
  setRigtPanelVisibility,
} from "../../../../../actions/ui";

import AssessmentIcon from "@material-ui/icons/Assessment";
import CreateReportButton from "./ReportCreateButton";
import CustomEditButton from "../Buttons/CustomEditButton";
import CustomPrintButton from "../Buttons/CustomPrintButton";
import RevertButton from "../Buttons/RevertButton";
import TimelineIcon from "@material-ui/icons/Timeline";
import WorkFlowActions from "../Buttons/WorkFlowActions";
import {
  checkFeature,
  checkPermission,
  useCheckPermissions,
} from "../../../../../helpers/checkPermission";
import lodash, { isEmpty } from "lodash";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { CommentOutlined } from "@material-ui/icons";
import CustomRestoreButton from "../Buttons/CustomRestoreButton";
import ReportsShowButton from "./ReportsShowButton";
import CustomLinkButton from "../Buttons/CustomLinkButton";
import CompletionReportShowButton from "./CompletionReportShowButton";
import AmpDataButton from "./AmpDataButton";
import BpmsDataButton from "./BpmsDataButton";
import GfmsDataButton from "./GfmsDataButton";

const ShowActions = ({
  basePath,
  data,
  resource,
  location,
  id,
  hasList,
  hasEdit,
  hasShow,
  hasCreate,
  ...props
}) => {
  const translate = useTranslate();
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = React.useState(false);
  const [lastDetailId, setLastDetailId] = React.useState(null);
  const [projectDetails, setProjectDetails] = React.useState(null);
  const { userInfo } = useSelector((state) => state.user);
  const { resources } = useSelector((state) => state.admin);
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const checkPermissions = useCheckPermissions();
  const currentTabId = location
    ? location.pathname[location.pathname.length - 1]
    : 1;

  useEffect(() => {
    // if (data && (lastDetailId && lastDetailId.phase_id !==  data.phase_id) && data.phase_id)
    dataProvider
      .getListOfAll("project-details", {
        filter: { project_id: Number(id) },
        sort_field: "id",
      })
      .then((response) => {
        response.data.map((detail) => {});
        const lastDetailId = lodash.maxBy(response.data, "id");
        setProjectDetails(response.data);
        setLastDetailId(lastDetailId);
        setIsFetching(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [data && data.phase_id]);

  if (!data) return null;

  function checkUserCreator() {
    return userInfo && Number(userInfo.id) === Number(data.created_by);
  }

  function hasEditRules() {
    return (
      data &&
      !data.is_deleted &&
      data.project_status !== "COMPLETED" &&
      (data.project_status === "DRAFT" ||
        data.project_status === "REVISED" ||
        data.project_status === "ONGOING" ||
        data.project_status === "CONDITIONALLY_APPROVED") &&
      (checkUserCreator() || checkPermissions("full_access")) && //TODO chage to role
      lastDetailId &&
      data.phase_id === lastDetailId.phase_id &&
      checkPermissions(["edit_project"])
      //TODO chage to role
    );
  }

  /** Show Edit (project details) beside Submit when user can edit and we have a detail to link to. */
  function showEditBesideSubmit() {
    return (
      data &&
      !data.is_deleted &&
      data.project_status !== "COMPLETED" &&
      lastDetailId?.id &&
      data.phase_id === lastDetailId.phase_id &&
      checkPermissions(["edit_project"])
    );
  }

  function hasExportRules() {
    return (
      data &&
      checkUserCreator() &&
      checkPermissions("edit_project") &&
      checkPermissions("export_word") //TODO remove after check
    );
  }

  function hasRevertRules() {
    return (
      data &&
      !data.is_deleted &&
      data.phase_id <= 5 &&
      data.project_status !== "REVISED" &&
      data.project_status !== "DRAFT" &&
      data.project_status !== "COMPLETED" &&
      checkPermissions("revert_project")
    );
  }

  function hasWorkflowRules() {
    return (
      data &&
      !data.is_deleted &&
      data.project_status !== "REJECTED" &&
      data.project_status !== "COMPLETED" &&
      (checkPermissions("approve_project") ||
        checkPermissions("submit_project") ||
        checkPermissions("reject_project") ||
        checkPermissions("assign_project") ||
        checkPermissions("revise_project") ||
        checkPermissions("approve_log_frame"))
    );
  }

  function hasMERules() {
    return (
      data &&
      !data.is_deleted &&
      !hasEditLogFrameRules() &&
      // data.project_status !== "COMPLETED" &&
      checkFeature("project_actions_create_me_form", currentTabId) &&
      lastDetailId &&
      checkPermissions("create_me_report")
    );
  }

  function hasCompletionRules() {
    return (
      checkFeature("has_implementation_reports") &&
      checkFeature("has_completion_report_show", currentTabId) &&
      data &&
      lastDetailId
    );
  }

  function hasProjectManagemantRules() {
    return (
      data &&
      !data.is_deleted &&
      data.workflow &&
      data.workflow.additional_data &&
      !data.workflow.additional_data.is_logical_framework_editable &&
      checkFeature("project_actions_edit_project_management", data.phase_id) &&
      checkPermissions("edit_project_management")
    );
  }

  function hasCommentsRules() {
    return (
      data &&
      checkFeature("project_actions_comments", data.phase_id) &&
      checkPermissions("list_comments")
    );
  }

  function hasDeleteRules() {
    const pimisRules =
      data &&
      checkPermissions("delete_project") &&
      !data.is_deleted &&
      checkUserCreator() &&
      (data.phase_id === 1 || data.phase_id === 2) &&
      data.project_status === "DRAFT";

    const otherRules =
      data &&
      checkPermissions("delete_project") &&
      !data.is_deleted &&
      (checkPermissions("full_access") ||
        (checkUserCreator() &&
          data.phase_id === 1 &&
          data.current_step === 1 &&
          data.project_status === "DRAFT"));

    return checkFeature("has_pimis_fields") ? pimisRules : otherRules;
  }

  function hasRestoreRules() {
    return (
      data && checkPermissions("access_deleted_project") && data.is_deleted
    );
  }

  function hasBudgetAllocationRules() {
    return (
      data &&
      !data.is_deleted &&
      checkFeature("project_has_budget_allocation", data.phase_id) &&
      checkPermissions("edit_budget_allocation")
    );
  }

  // function hasBudgetMYCRules() {
  //   return (
  //     data &&
  //     checkFeature("project_has_myc_data_entry", data.phase_id) &&
  //     checkPermissions("edit_myc_data")
  //   );
  // }

  function hasEditLogFrameRules() {
    return (
      lastDetailId,
      data &&
        data.workflow &&
        data.workflow.additional_data &&
        data.workflow.additional_data.is_logical_framework_editable &&
        checkFeature("project_has_log_frame_data_edit", data.phase_id) &&
        checkPermissions("edit_log_frame")
    );
  }

  // function hasIndicatorsEditRules() {
  //   return (
  //     lastDetailId,
  //     data &&
  //       data.workflow &&
  //       data.workflow.additional_data &&
  //       data.workflow.additional_data.is_logical_framework_editable && // TODO add same for indicators
  //       checkFeature("project_indicators_edit", data.phase_id) &&
  //       checkPermissions("edit_indicator")
  //   );
  // }

  function getMeReportProjectDetail(field) {
    const mePhase = lodash.find(projectDetails, (item) =>
      checkFeature("project_actions_create_me_form", item.phase_id)
    );

    return mePhase ? mePhase[field] : lastDetailId[field];
  }

  function hasAmpDataRules() {
    return (
      data &&
      data.budget_code &&
      checkFeature("project_has_amp_data", data.phase_id)
      // checkPermissions("view_app_data") //todo: set correct permissions
    );
  }

  // function hasBpmsDataRules() {
  //   return (
  //     data &&
  //     data.budget_code &&
  //     checkFeature("project_has_bpms_data", data.phase_id)
  //     // checkPermissions("list_bpms_data") //todo: set correct permissions
  //   );
  // }

  function hasGfmsDataRules() {
    return (
      data &&
      data.budget_code &&
      checkFeature("project_has_gfms_data", data.phase_id) &&
      checkPermissions("list_gfms_data")
    );
  }

  if (checkFeature("has_pimis_fields")) {
    return (
      <TopToolbar
        style={{
          paddingTop: 0,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ paddingTop: 0, display: "flex" }}>
          {checkFeature("project_actions_export") && (
            <CustomPrintButton
              printId="docx"
              record={data}
              isEditUser={hasExportRules()}
              phase={currentTabId}
            />
          )}

          {checkFeature("project_actions_timeline") && (
            <Button
              onClick={() => {
                dispatch(setRigtPanelVisibility(true));
                dispatch(setRigtPanelContent({ type: "TIMELINE", data: data }));
              }}
              label={translate("buttons.timeline")}
            >
              <TimelineIcon />
            </Button>
          )}

          {hasCommentsRules() && (
            <Button
              onClick={() => {
                dispatch(setRigtPanelVisibility(true));
                dispatch(setRigtPanelContent({ type: "COMMENTS", data: data }));
              }}
              label={translate("buttons.notes")}
            >
              <CommentOutlined />
            </Button>
          )}
          {/* {hasBpmsDataRules() && (
            <BpmsDataButton
              data={data}
              style={{
                color: "#3f50b5",
              }}
            />
          )} */}
          {hasGfmsDataRules() && (
            <GfmsDataButton
              data={data}
              style={{
                color: "#3f50b5",
              }}
            />
          )}
        </div>

        <div style={{ paddingTop: 0, display: "flex" }}>
          {hasDeleteRules() && (
            <DeleteButton
              {...props}
              record={data}
              basePath="/projects"
              resource="/projects"
              undoable
            />
          )}
          {hasRestoreRules() && (
            <CustomRestoreButton
              id={data.id}
              basePath="/projects"
              resource="/projects"
              undoable
              style={{ position: "absolute", left: 75 }}
            />
          )}
          {hasEditRules() && (
            <CustomEditButton
              basePath="/project-details"
              lastDetailId={lastDetailId.id}
            />
          )}
          {hasWorkflowRules() && (
            <WorkFlowActions
              {...props}
              record={data}
              details={lastDetailId}
              showEditButtonBeforeSubmit={showEditBesideSubmit()}
            />
          )}
          {hasRevertRules() && (
            <RevertButton record={data} details={lastDetailId} {...props} />
          )}
          {hasProjectManagemantRules() && (
            <Button
              onClick={() => {
                redirect(
                  "/project-management/" +
                    (data.project_management ? data.project_management.id : 1)
                );
              }}
              label={translate("buttons.project_management")}
            >
              <AssessmentIcon />
            </Button>
          )}
          {hasBudgetAllocationRules() && (
            <CustomEditButton
              basePath="/projects"
              lastDetailId={data.id}
              id={data.id}
              label={translate("buttons.budget_allocation")}
              icon={<AssessmentIcon />}
            />
          )}
          {hasEditLogFrameRules() && (
            <CustomEditButton
              basePath="/project-details"
              lastDetailId={lastDetailId?.id}
              label="Log Frame"
            />
          )}
        </div>
      </TopToolbar>
    );
  }

  return (
    <TopToolbar style={{ paddingTop: 0 }}>
      {!checkFeature("has_pimis_fields") && (
        <ListButton
          basePath="/projects"
          style={{ position: "absolute", left: 0 }}
        />
      )}
      {hasDeleteRules() && (
        <DeleteButton
          {...props}
          record={data}
          basePath="/projects"
          resource="/projects"
          undoable
          style={{
            position: "absolute",
            left: checkFeature("has_pimis_fields") ? 0 : 75,
          }}
        />
      )}
      {hasRestoreRules() && (
        <CustomRestoreButton
          id={data.id}
          basePath="/projects"
          resource="/projects"
          undoable
          style={{ position: "absolute", left: 75 }}
        />
      )}
      {hasMERules() && (
        <ReportsShowButton
          {...props}
          project_detail_id={getMeReportProjectDetail("id")}
          disabled={moment(getMeReportProjectDetail("start_date")).isAfter()}
          style={{
            position: "absolute",
            bottom: 5,
            left: hasDeleteRules() || hasRestoreRules ? 180 : 75,
            color: !moment(getMeReportProjectDetail("start_date")).isAfter()
              ? "#3f50b5"
              : "inherit",
          }}
        />
      )}
      {hasAmpDataRules() && (
        <AmpDataButton
          data={data}
          style={{
            position: "absolute",
            bottom: 5,
            color: "#3f50b5",
            left:
              hasDeleteRules() || hasRestoreRules || hasMERules() ? 320 : 75,
          }}
        />
      )}

      {hasEditRules() && (
        <CustomEditButton
          basePath="/project-details"
          lastDetailId={lastDetailId.id}
        />
      )}
      {hasWorkflowRules() && (
        <WorkFlowActions
          {...props}
          record={data}
          details={lastDetailId}
          showEditButtonBeforeSubmit={showEditBesideSubmit()}
        />
      )}
      {hasRevertRules() && (
        <RevertButton record={data} details={lastDetailId} {...props} />
      )}
      {checkFeature("project_actions_export") && (
        <CustomPrintButton
          printId="docx"
          record={data}
          isEditUser={hasExportRules()}
          phase={currentTabId}
        />
      )}

      {checkFeature("project_actions_timeline") && (
        <Button
          onClick={() => {
            dispatch(setRigtPanelVisibility(true));
            dispatch(setRigtPanelContent({ type: "TIMELINE", data: data }));
          }}
          label={translate("buttons.timeline")}
        >
          <TimelineIcon />
        </Button>
      )}

      {hasCommentsRules() && (
        <Button
          onClick={() => {
            dispatch(setRigtPanelVisibility(true));
            dispatch(setRigtPanelContent({ type: "COMMENTS", data: data }));
          }}
          label={translate("buttons.notes")}
        >
          <CommentOutlined />
        </Button>
      )}

      {hasProjectManagemantRules() && (
        <Button
          onClick={() => {
            redirect(
              "/project-management/" +
                (data.project_management ? data.project_management.id : 1)
            );
          }}
          label={translate("buttons.project_management")}
        >
          <AssessmentIcon />
        </Button>
      )}

      {hasBudgetAllocationRules() && (
        <CustomEditButton
          basePath="/projects"
          lastDetailId={data.id}
          id={data.id}
          label={translate("buttons.budget_allocation")}
          icon={<AssessmentIcon />}
        />
      )}

      {/* {hasBudgetMYCRules() && (
        <CustomLinkButton
          basePathLink={`/project/${id}/myc`}
          label="MYC"
          icon={<AssessmentIcon />}
        />
      )} */}

      {hasEditLogFrameRules() && (
        <CustomEditButton
          basePath="/project-details"
          lastDetailId={lastDetailId?.id}
          label="Log Frame"
        />
      )}
    </TopToolbar>
  );
};

export default ShowActions;

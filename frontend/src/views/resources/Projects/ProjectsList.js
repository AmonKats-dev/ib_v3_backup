import {
  CreateButton,
  Datagrid,
  FunctionField,
  List,
  ReferenceField,
  ShowButton,
  SimpleList,
  TextField,
  TextInput,
  useDataProvider,
  usePermissions,
  useRedirect,
  useTranslate,
} from "react-admin";
import React, { useEffect, useState } from "react";
import {
  checkFeature,
  checkPermission,
} from "../../../helpers/checkPermission";

import Box from "@material-ui/core/Box";
import CustomShowButton from "./Actions/Buttons/CustomShowButton";
import ProjectsActions from "./Actions/List";
import ProjectsFilters from "./Filters";
import Typography from "@material-ui/core/Typography";
import { dateFormatter } from "../../../helpers";
import { exporter, WorkflowStatusMessage } from "../../modules/Reports/helpers";
import lodash from "lodash";
import { useMediaQuery } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { setBreadCrumps } from "../../../actions/ui";

const ProjectsList = (props) => {
  const [programs, setPrograms] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const redirect = useRedirect();
  const { permissions } = usePermissions();
  const organizationsResources = useSelector(
    (state) => state.admin.resources.organizations
  );
  const { userInfo } = useSelector((state) => state.user);

  const programsResources = useSelector(
    (state) => state.admin.resources.programs
  );

  const dispatch = useDispatch();

  const Empty = (props) => {
    const { loading, loaded, total } = props;
    const { permissions } = usePermissions();
    if (total === 0 && !loading && loaded) {
      return (
        <Box textAlign="center" m={1}>
          <Typography variant="h4" paragraph>
            There are no projects in the system
            <br />
            <br />
            {checkPermission(props.permissions, "create_project") && (
              <CreateButton
                basePath="/projects"
                permissions={props.permissions}
              />
            )}
          </Typography>
        </Box>
      );
    }

    return <div></div>;
  };

  useEffect(() => {
    const getTitle = () => {
      switch (true) {
        case props.showWorkPlan:
          return "Projected Cash Flow";
        case props.showWorkPlanApproved:
          return "Approved Cash Flow";
        case props.showWorkPlanAdjusted:
          return "Adjusted Cash Flow";
        case props.showWorkPlanMonthly:
          return "Warrant Request"
        case props.showExpenditures:
          return "Expenditures"
        default:
          break;
      }
    };

    if (props.showPM) {
      dispatch(setBreadCrumps([{ to: "", title: "Gantt Chart" }]));
    } else {
      if (!props.defaultBreadcrumbs) {
        dispatch(setBreadCrumps([{ to: "", title: getTitle() }]));
      }
    }

    return () => {
      dispatch(setBreadCrumps([]));
    };
  }, []);

  useEffect(() => {
    if (
      !organizationsResources ||
      (organizationsResources && lodash.isEmpty(organizationsResources.data))
    ) {
      dataProvider
        .getList("organizations", {
          pagination: { page: 1, perPage: -1 },
          sort: { sort_field: "id", sort_order: "asc" },
          filter: {
            is_hidden: false,
          },
        })
        .then((response) => {
          setOrganizations(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const organizationsData = lodash
        .keys(organizationsResources.data)
        .map((key) => organizationsResources.data[key]);
      setOrganizations(organizationsData);
    }
  }, []);

  useEffect(() => {
    if (
      !programsResources ||
      (programsResources && lodash.isEmpty(programsResources.data))
    ) {
      dataProvider
        .getList("programs", {
          pagination: { page: 1, perPage: -1 },
          sort: { sort_field: "id", sort_order: "asc" },
          filter: {
            is_hidden: false,
          },
        })
        .then((response) => {
          setPrograms(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const programsData = lodash
        .keys(programsResources.data)
        .map((key) => programsResources.data[key]);
      setPrograms(programsData);
    }
  }, []);

  const getRowClick = (id, record) => {
    if (props.showAppeals) {
      return redirect("appeals/" + record.current_project_detail.id + "/list");
    }
    if (props.showIndicators) {
      return redirect("project-indicators/" + id);
    }
    if (props.showPM)
      return redirect(
        "edit",
        "/project-management",
        record?.project_management?.id
      );
    if (props.showWorkPlan)
      return redirect("cost-plans-projected/" + id + "/show");
    if (props.showWorkPlanApproved)
      return redirect("cost-plans-approved/" + id + "/show");
    if (props.showWorkPlanAdjusted)
      return redirect("cost-plans-adjusted/" + id + "/show");
    if (props.showWorkPlanMonthly)
      return redirect("cost-plans-monthly/" + id + "/show");
    if (props.showGfmsData)
      return redirect("gfms_data/" + id + "/show");
    if (props.showExpenditures)
      return redirect("expenditures/" + id + "/show");
    return "show";
  };

  return (
    <List
      sort={{ field: "id", order: "DESC" }}
      filter={{ is_deleted: false }}
      filters={
        checkFeature("has_pimis_fields") ? (
          false
        ) : (
          <ProjectsFilters
            organizations={organizations}
            programs={programs}
            disablePhaseFilter={props.disablePhaseFilter}
          />
        )
      }
      actions={
        <ProjectsActions
          {...props}
          disablePhaseFilter={props.disablePhaseFilter}
        />
      }
      bulkActionButtons={false}
      empty={<Empty {...props} />}
      exporter={exporter}
      perPage={25}
      {...props}
    >
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => `${record.code}`}
          tertiaryText={(record) => record.phase_id}
        />
      ) : (
        <Datagrid
          {...(function () {
            const rc = checkFeature("has_pimis_fields")
              ? props.showExpenditures ||
                  props.showGfmsData ||
                  props.showPM ||
                  props.showWorkPlan ||
                  props.showWorkPlanApproved ||
                  props.showWorkPlanAdjusted ||
                  props.showWorkPlanMonthly ||
                  props.showIndicators ||
                  props.showAppeals
                ? (row, resource, record) => getRowClick(row, record)
                : "show"
              : null;
            return rc != null ? { rowClick: rc } : {};
          })()}
          rowStyle={(record) => {
            if (
              checkFeature("has_pimis_fields") &&
              record?.workflow?.role_id === userInfo?.current_role?.role_id &&
              record.project_status !== "DRAFT" &&
              record.project_status !== "REJECTED" &&
              !props.showGfmsData &&
              !props.showWorkPlan &&
              !props.showWorkPlanApproved &&
              !props.showWorkPlanAdjusted && !props.showWorkPlanMonthly && !props.showExpenditures
            ) {
              return { backgroundColor: "#f4b5b5" };
            }

            if (record?.approved_appeals?.length > 0) {
              return { borderLeft: "5px solid orange" };
            }

            return null;
          }}
        >
          {/* {checkFeature("has_pimis_fields") && (
            <FunctionField
              source="code"
              render={(record) => record && (record.budget_code || record.code)}
            />} */}
          {!checkFeature("has_pimis_fields") && <TextField source="code" />}
          {checkFeature("has_pimis_fields") ? (
            <FunctionField
              source="code"
              render={(record) => record && (record.budget_code || record.code)}
            />
          ) : (
            <FunctionField
              source="code"
              render={(record) => record && record.code}
            />
          )}

          <TextField source="name" />

          {checkFeature("has_pimis_fields") && (
            <FunctionField
              source="created_on"
              label={"Primary executing agency"}
              render={(record) =>
                record ? record.project_organization?.name : null
              }
            />
          )}

          <FunctionField
            source="created_on"
            label={translate(`resources.projects.fields.created_at`)}
            render={(record) =>
              record ? dateFormatter(record.submission_date) : null
            }
          />
          {!checkFeature("has_pimis_fields") && (
            <FunctionField
              source="created_on"
              label={translate(`resources.projects.fields.created_by`)}
              render={(record) =>
                record ? record.user && record.user.full_name : null
              }
            />
          )}
          {!checkFeature("has_pimis_fields") && (
            <FunctionField
              source="status"
              label={translate(`resources.projects.fields.status`)}
              render={(record) =>
                record
                  ? translate(`timeline.${record.project_status.toLowerCase()}`)
                  : null
              }
            />
          )}

          <FunctionField
            source="phase"
            label={`resources.projects.fields.phase_id`}
            render={(record) =>
              record && record.phase ? record.phase.name : null
            }
          />
          <FunctionField
            source="workflow_id"
            label={
              checkFeature("has_pimis_fields") ? "Status" : "Workflow Status"
            }
            render={(record) => {
              return record && <WorkflowStatusMessage record={record} />;
            }}
          />

          <FunctionField
            render={(record) => {
              if (props.showAppeals) {
                return (
                  <CustomShowButton
                    link={
                      "appeals/" + record?.current_project_detail?.id + "/list"
                    }
                  />
                );
              }
              return (
                !checkFeature("has_pimis_fields") && (
                  <CustomShowButton {...props} record={record} />
                )
              );
            }}
          />
        </Datagrid>
      )}
    </List>
  );
};

export default ProjectsList;

import {
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { groupBy, maxBy } from "lodash";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Button, useDataProvider, useNotify, useRefresh } from "react-admin";
import {
  getFeatureValue,
  useCheckPermissions,
} from "../../../helpers/checkPermission";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";
import AnnualContent from "./AnnualContent";
import WorkPlansEditForms from "./WorkPlansEditForms";
import WorkPlansView from "./WorkPlansView";

import EditIcon from "@material-ui/icons/Edit";
import HistoryIcon from "@material-ui/icons/History";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import AddIcon from "@material-ui/icons/Add";
import { setBreadCrumps } from "../../../actions/ui";
import { useDispatch } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const WorkPlanShowEdit = ({ item, details, project, refresh, ...props }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isShownHistory, setIsShownHistory] = useState(false);
  const isCompleted = project?.project_status === "COMPLETED";
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const refreshData = useRefresh();
  const checkPermissions = useCheckPermissions();

  if (!project || !details || !item) return null;

  const handleCreateAdjustment = () => {
    dataProvider
      .create("cost-plans", {
        data: {
          ...item,
          cost_plan_items: item.cost_plan_items.map((it) => {
            const newItem = { ...it };
            delete newItem.id;
            delete newItem.cost_plan_id;

            return newItem;
          }),
          cost_plan_status: "DRAFT",
          cost_plan_type: "ADJUSTED",
        },
      })
      .then((result) => {
        refreshData();
        refresh(project.id);
      })
      .catch((result) => {
        showNotification("Cash flow was not submitted!");
      });
  };

  const handleConfirm = () => {
    dataProvider
      .update("cost-plans", {
        id: item.id,
        data: { cost_plan_status: "SUBMITTED" },
      })
      .then((result) => {
        refreshData();
        refresh(project.id);
      })
      .catch((result) => {
        showNotification("Cash flow was not submitted!");
      });
  };

  const renderContent = () =>
    isEdit ? (
      <WorkPlansEditForms
        {...props}
        basePath="/cost-plans"
        resource="cost-plans"
        id={item.id}
        record={item}
        projectDetails={details}
        year={item.year}
        onSave={() => {
          setIsEdit(false);
          refresh(project.id);
        }}
        onClose={() => setIsEdit(false)}
      />
    ) : (
      <WorkPlansView
        {...props}
        basePath="/cost-plans"
        id={item.id}
        resource="cost-plans"
        record={item}
        projectDetails={details}
      />
    );

  const isPublishAllowed =
    checkPermissions("publish_adjusted_cash_flow") &&
    item.cost_plan_status === "DRAFT" &&
    !isCompleted &&
    !isEdit;

  const isCreateAllowed =
    checkPermissions("add_adjusted_cash_flow") &&
    item.cost_plan_status === "SUBMITTED" &&
    !isEdit;

  const isViewEditAllowed =
    ((!isEdit && checkPermissions("update_adjusted_cash_flow")) ||
      (isEdit && checkPermissions("view_adjusted_cash_flow"))) &&
    item.cost_plan_status === "DRAFT" &&
    !isCompleted &&
    !isEdit;

  return (
    <div style={{ position: "relative" }}>
      {!props.showWorkPlanAdjusted && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
            gap: 15,
          }}
        >
          {!isEdit && (
            <Button
              href={`/#/cost-plans-history/${item.project_detail_id}/${item.year}`}
              label={"History"}
              color="primary"
              variant="text"
              startIcon={<HistoryIcon />}
            />
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 15,
            }}
          >
            {isCreateAllowed && (
              <Button
                onClick={handleCreateAdjustment}
                label={"Create"}
                color="primary"
                variant="contained"
                startIcon={<AddIcon />}
              />
            )}
            {isPublishAllowed && (
              <Button
                onClick={handleConfirm}
                label={"Publish"}
                color="primary"
                variant="contained"
                startIcon={<PlaylistAddCheckIcon />}
              />
            )}
            {isViewEditAllowed && (
              <Button
                onClick={() => {
                  setIsEdit((prev) => !prev);
                }}
                label={isEdit ? "Show" : "Edit"}
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
              />
            )}
          </div>
        </div>
      )}

      <div>{renderContent()}</div>
    </div>
  );
};

const WorkPlansShowAdjusted = ({ filter = {}, ...props }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [costPlans, setCostPlans] = useState([]);
  const [costPlansAdjusted, setCostPlansAdjusted] = useState([]);
  const [costPlansTabs, setCostPlansTabs] = useState([]);
  const [project, setProject] = React.useState(null);
  const [projectDetails, setProjectDetails] = React.useState(null);
  const dataProvider = useDataProvider();
  const [value, setValue] = React.useState(0);
  const showNotification = useNotify();
  const refresh = useRefresh();
  const dispatch = useDispatch();

  const duration = useMemo(() => {
    return (
      (projectDetails &&
        moment(projectDetails.end_date, "YYYY-MM-DD").diff(
          moment(projectDetails.start_date, "YYYY-MM-DD"),
          "years"
        ) + 1) ||
      0
    );
  }, [projectDetails]);

  const refreshTabs = (id) => {
    const projectId = props.id || props.match?.params?.id;

    dataProvider.getOne("projects", { id: projectId }).then((response) => {
      if (response && response.data) {
        setProject(response.data);

        dataProvider
          .getOne("project-details", {
            id: response.data.current_project_detail.id,
          })
          .then((resp) => {
            if (resp && resp.data) {
              setProjectDetails(formatValuesToQuery({ ...resp.data }));

              dataProvider
                .getListOfAll("cost-plans", {
                  sort_field: "id",
                  filter: {
                    project_detail_id: resp.data.id,
                    cost_plan_type: "APPROVED",
                    cost_plan_status: "SUBMITTED",
                  },
                })
                .then((resApproved) => {
                  if (resApproved?.data) {
                    setCostPlans(resApproved.data);

                    dataProvider
                      .getListOfAll("cost-plans", {
                        sort_field: "id",
                        filter: {
                          project_detail_id: resp.data.id,
                          cost_plan_type: "ADJUSTED",
                        },
                      })
                      .then((resAdjusted) => {
                        if (resAdjusted?.data) {
                          setCostPlansAdjusted(resAdjusted.data);

                          const lastCostApproved =
                            resAdjusted.data[resAdjusted.data.length - 1];

                          const details = formatValuesToQuery({
                            ...resp.data,
                          });
                          const proj = response.data;

                          const grYears = groupBy(resAdjusted.data, "year");

                          const tabs = resApproved.data.map((item) => {
                            const maxRecord = maxBy(grYears[item.year], "id");

                            if (maxRecord) {
                              return {
                                id: item.year,
                                content: (
                                  <WorkPlanShowEdit
                                    {...props}
                                    basePath="/cost-plans"
                                    resource="cost-plans"
                                    item={maxRecord}
                                    details={details}
                                    project={proj}
                                    refresh={() => refreshTabs(proj.id)}
                                  />
                                ),
                              };
                            }

                            return {
                              id: item.year,
                              content: (
                                <Button
                                  startIcon={<AddIcon />}
                                  variant="contained"
                                  label="Create"
                                  onClick={() => {
                                    if (lastCostApproved) {
                                      handleCreate({
                                        ...lastCostApproved,
                                        cost_plan_items:
                                          lastCostApproved.cost_plan_items.map(
                                            (it) => {
                                              const newIt = { ...it };
                                              delete newIt.id;
                                              delete newIt.cost_plan_id;

                                              return newIt;
                                            }
                                          ),
                                        cost_plan_status: "DRAFT",
                                        cost_plan_type: "ADJUSTED",
                                      });
                                    } else
                                      handleCreate({
                                        ...item,
                                        cost_plan_items:
                                          item.cost_plan_items.map((it) => {
                                            const newIt = { ...it };
                                            delete newIt.id;
                                            delete newIt.cost_plan_id;

                                            return newIt;
                                          }),
                                        cost_plan_status: "DRAFT",
                                        cost_plan_type: "ADJUSTED",
                                      });
                                  }}
                                />
                              ),
                            };
                          });

                          setCostPlans(resAdjusted.data);
                          setCostPlansTabs([
                            {
                              id: "annual",
                              content: (
                                <AnnualContent
                                  projectDetails={formatValuesToQuery({
                                    ...resp.data,
                                  })}
                                />
                              ),
                            },
                            ...tabs,
                          ]);
                        }
                      });
                  }
                });
            }
          });
      }
    });
  };

  useEffect(() => {
    const getLinks = () => {
      switch (true) {
        case props.showWorkPlan:
          return { to: "/work_plan", title: "Projected Cash Flow" };
        case props.showWorkPlanApproved:
          return { to: "/work_plan_approved", title: "Approved Cash Flow" };
        case props.showWorkPlanAdjusted:
          return { to: "/work_plan_adjusted", title: "Adjusted Cash Flow" };

        default:
          break;
      }
    };

    if (!props.defaultBreadcrumbs) {
      dispatch(
        setBreadCrumps([{ ...getLinks() }, { to: "", title: "Details" }])
      );
    }

    // return () => {
    //   dispatch(setBreadCrumps([]));
    // };
  }, []);

  useEffect(() => {
    const projectId = props.id || props.match?.params?.id;

    dataProvider.getOne("projects", { id: projectId }).then((response) => {
      if (response && response.data) {
        setProject(response.data);

        dataProvider
          .getOne("project-details", {
            id: response.data.current_project_detail.id,
          })
          .then((resp) => {
            if (resp && resp.data) {
              setProjectDetails(formatValuesToQuery({ ...resp.data }));

              dataProvider
                .getListOfAll("cost-plans", {
                  sort_field: "id",
                  filter: {
                    project_detail_id: resp.data.id,
                    cost_plan_type: "APPROVED",
                    cost_plan_status: "SUBMITTED",
                  },
                })
                .then((resApproved) => {
                  if (resApproved?.data) {
                    setCostPlans(resApproved.data);

                    dataProvider
                      .getListOfAll("cost-plans", {
                        sort_field: "id",
                        filter: {
                          project_detail_id: resp.data.id,
                          cost_plan_type: "ADJUSTED",
                        },
                      })
                      .then((resAdjusted) => {
                        if (resAdjusted?.data) {
                          setCostPlansAdjusted(resAdjusted.data);

                          const lastCostApproved =
                            resAdjusted.data[resAdjusted.data.length - 1];

                          const details = formatValuesToQuery({
                            ...resp.data,
                          });
                          const proj = response.data;

                          const grYears = groupBy(resAdjusted.data, "year");

                          const tabs = resApproved.data.map((item) => {
                            const maxRecord = maxBy(grYears[item.year], "id");

                            if (maxRecord) {
                              return {
                                id: item.year,
                                content: (
                                  <WorkPlanShowEdit
                                    {...props}
                                    basePath="/cost-plans"
                                    resource="cost-plans"
                                    item={maxRecord}
                                    details={details}
                                    project={proj}
                                    refresh={() => refreshTabs()}
                                  />
                                ),
                              };
                            }

                            return {
                              id: item.year,
                              content: (
                                <Button
                                  startIcon={<AddIcon />}
                                  variant="contained"
                                  label="Create"
                                  onClick={() => {
                                    handleCreate({
                                      ...item,
                                      cost_plan_items: item.cost_plan_items.map(
                                        (it) => {
                                          const newIt = { ...it };
                                          delete newIt.id;
                                          delete newIt.cost_plan_id;

                                          return newIt;
                                        }
                                      ),
                                      cost_plan_status: "DRAFT",
                                      cost_plan_type: "ADJUSTED",
                                    });
                                  }}
                                />
                              ),
                            };
                          });

                          setCostPlans(resAdjusted.data);
                          setCostPlansTabs([
                            {
                              id: "annual",
                              content: (
                                <AnnualContent
                                  {...props}
                                  projectDetails={formatValuesToQuery({
                                    ...resp.data,
                                  })}
                                />
                              ),
                            },
                            ...tabs,
                          ]);
                        }
                      });
                  }
                });
            }
          });
      }
    });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getCurrentYearValue = () => {
    return Number(moment().format("YYYY"));
  };

  const handleConfirm = () => {
    const lastOne = costPlans[costPlans.length - 1];

    dataProvider
      .update("cost-plans", {
        id: lastOne.id,
        data: { cost_plan_status: "SUBMITTED" },
      })
      .then((result) => {
        setIsConfirmed(true);
        showNotification("Cash flow submitted!");

        if (costPlans?.length < duration) {
          handleCreate({
            cost_plan_items: [],
            project_detail_id: projectDetails.id,
            year: Number(lastOne.year) + 1,
          });
        }

        refreshTabs(project.id);
      })
      .catch((result) => {
        showNotification("Cash flow was not submitted!");
      });
    setShowConfirm(false);
  };

  const handleCreate = (params) => {
    delete params.id;

    dataProvider
      .create("cost-plans", {
        data: { ...params },
      })
      .then((result) => {
        showNotification("Cash flow created!");
        refresh();
        refreshTabs();
      })
      .catch((result) => {
        showNotification("Cash flow was not created!");
      });
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const inWorkPlanPeriod = () => {
    const workPlanPeriod = getFeatureValue("workplans_create_period");
    const period = workPlanPeriod.split("-");

    const startDate = moment(
      `${period[0]}/${moment().format("YYYY")}`,
      "DD/MM/YYYY"
    );
    const endDate = moment(
      `${period[1]}/${moment().format("YYYY")}`,
      "DD/MM/YYYY"
    );
    return moment().isBetween(startDate, endDate); //false in this case
  };

  const getInitialYear = () => {
    const fiscalStartDate = getFeatureValue("fiscal_year_start_date");
    const startYear = project && moment(project.signed_date).format("YYYY");
    const startFiscalYear = moment(
      `${fiscalStartDate}/${startYear}`,
      "DD/MM/YYYY"
    );

    if (!project) return null;

    return project && moment(project.signed_date).isSameOrAfter(startFiscalYear)
      ? Number(startYear)
      : Number(startYear) - 1;
  };

  return (
    <Card>
      <Tabs value={value} onChange={handleChange} variant="scrollable">
        {costPlansTabs?.map((item) => (
          <Tab
            label={
              item.id === "annual"
                ? "Annual"
                : getFiscalYearValueFromYear(item.id).name
            }
            key={item.id}
          />
        ))}
        {costPlans?.length < duration &&
          costPlans[costPlans.length - 1]?.cost_plan_type === "PROJECTED" && (
            <Button
              disabled={
                costPlans[costPlans.length - 1]?.cost_plan_status === "DRAFT"
              }
              label="Add +"
              onClick={() => {
                const isDraftLast =
                  costPlans[costPlans.length - 1]?.cost_plan_status === "DRAFT";

                if (isDraftLast) {
                  setShowConfirm(true);
                } else {
                  const initialYear =
                    costPlans.length === 0
                      ? getInitialYear() || getCurrentYearValue()
                      : Number(costPlans[costPlans.length - 1].year) + 1;

                  handleCreate({
                    cost_plan_items: [],
                    project_detail_id: projectDetails.id,
                    year: initialYear,
                  });
                }
              }}
            />
          )}
      </Tabs>
      {costPlansTabs.map((item, idx) => (
        <TabPanel value={value} index={idx} key={item.id}>
          {item.content}
        </TabPanel>
      ))}

      <Dialog open={showConfirm} onClose={handleCloseConfirm}>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h5">
              The cash flow data for the past years will be locked.
            </Typography>
            <Typography variant="h5">
              Are you sure you want to continue?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            label={"Cancel"}
            onClick={handleCloseConfirm}
            startIcon={<ClearIcon />}
          />
          <Button
            label={"Confirm"}
            onClick={handleConfirm}
            startIcon={<CheckIcon />}
            variant="contained"
          />
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default WorkPlansShowAdjusted;

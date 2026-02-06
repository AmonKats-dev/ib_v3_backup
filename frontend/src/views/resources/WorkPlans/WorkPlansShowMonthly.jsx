import {
  Box,
  Card,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@material-ui/core";
import { find, groupBy, maxBy } from "lodash";
import moment from "moment";
import React, { useMemo, useCallback, useEffect, useState } from "react";
import { Button, useDataProvider, useNotify, useRefresh } from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadCrumps } from "../../../actions/ui";
import { costSumFormatter } from "../../../helpers";
import {
  getFeatureValue,
  useCheckPermissions,
} from "../../../helpers/checkPermission";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";
import Preloader from "../../components/Preloader";
import { months } from "./constants";
import WorkPlansEditFormsMonthly from "./WorkPlansEditFormsMonthly";
import WorkPlansViewMonthly from "./WorkPlansViewMonthly";
import EditIcon from "@material-ui/icons/Edit";
import ShowIcon from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";

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
  const [isEdited, setIsEdited] = useState();
  const [isShown, setIsShown] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [costPlans, setCostPlans] = useState([]);
  const isCompleted = project?.project_status === "COMPLETED";
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const refreshData = useRefresh();
  const dispatch = useDispatch();
  const checkPermissions = useCheckPermissions();

  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    if (!props.defaultBreadcrumbs) {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: `${project?.name}`,
        },
      });
    }

    return () => {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: "",
        },
      });
    };
  }, [dispatch, project.name, props.defaultBreadcrumbs]);

  const refreshMonthsData = useCallback(() => {
    setIsLoading(true);
    dataProvider
      .getListOfAll("cost-plans", {
        sort_field: "id",
        filter: {
          project_detail_id: details?.id,
          cost_plan_type: "MONTHLY",
          year: item.year,
        },
      })
      .then((res) => {
        if (res?.data) {
          setCostPlans(res?.data);
          setIsLoading(false);
        }
      });
  }, [dataProvider, details.id, item.year]);

  useEffect(() => {
    refreshMonthsData();
  }, [refreshMonthsData]);

  const fiscalStartDate = getFeatureValue("fiscal_year_start_date");

  const submittedData = useMemo(() => {
    const resultSubmitted = {};

    if (isEdited) {
      costPlans
        .filter((item) => item.month < isEdited.month)
        .forEach((item) => {
          resultSubmitted[item.month] = {};

          item.cost_plan_items.forEach((it) => {
            if (!resultSubmitted[item.month][it?.fund?.code]) {
              resultSubmitted[item.month][it?.fund?.code] = {};
            }

            Object.keys(it.cash_flow).forEach((key) => {
              if (resultSubmitted[item.month][it?.fund?.code][key]) {
                resultSubmitted[item.month][it?.fund?.code][key] += parseFloat(
                  it.cash_flow[key] || 0
                );
              } else {
                resultSubmitted[item.month][it?.fund?.code][key] = parseFloat(
                  it.cash_flow[key] || 0
                );
              }
            });
          });
        });

      const resObjects = {};
      console.log(resultSubmitted, "resultSubmitted");

      Object.keys(resultSubmitted).forEach((month) => {
        Object.keys(resultSubmitted[month]).forEach((fundCode) => {
          resObjects[fundCode] = {};

          Object.keys(resultSubmitted[month][fundCode]).forEach(
            (costObject) => {
              if (resObjects[fundCode][costObject]) {
                resObjects[fundCode][costObject] += parseFloat(
                  resultSubmitted[month][fundCode][costObject]
                );
              } else {
                resObjects[fundCode][costObject] = parseFloat(
                  resultSubmitted[month][fundCode][costObject]
                );
              }
            }
          );
        });
      });

      console.log(resObjects, "resObjects");
      return resObjects;
    }

    return resultSubmitted;
  }, [costPlans, isEdited]);

  if (!project || !details || !item) return null;

  const handleCreateMonthly = (month) => {
    dataProvider
      .create("cost-plans", {
        data: {
          ...item,
          month: Number(month),
          cost_plan_items: [],
          cost_plan_status: "DRAFT",
          cost_plan_type: "MONTHLY",
        },
      })
      .then((result) => {
        refreshData();
        refresh(project.id);
        refreshMonthsData();
      })
      .catch((result) => {
        showNotification("Cash flow was not submitted!");
      });
  };

  const handleConfirm = (id) => {
    dataProvider
      .update("cost-plans", {
        id,
        data: { cost_plan_status: "SUBMITTED" },
      })
      .then(() => {
        refreshData();
        refresh(project.id);
        refreshMonthsData();
      })
      .catch(() => {
        showNotification("Cash flow was not submitted!");
      });
  };

  let totalAll = 0;

  const getApprovedTotal = () => {
    let total = 0;
    item.cost_plan_items.forEach((it) => {
      Object.keys(it.cash_flow).forEach((key) => {
        total += parseFloat(it.cash_flow[key] || 0);
      });
    });

    return costSumFormatter(total);
  };

  const getMonthsTotal = () => {
    let total = 0;
    costPlans.forEach((item) => {
      item.cost_plan_items.forEach((it) => {
        Object.keys(it.cash_flow).forEach((key) => {
          total += parseFloat(it.cash_flow[key] || 0);
        });
      });
    });

    return costSumFormatter(total);
  };

  if (isLoading) return <Preloader />;

  return (
    <div style={{ position: "relative" }}>
      {!isEdited && !isShown && (
        <TableContainer style={{ overflow: "auto", marginTop: "25px" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: 150 }}>Month</TableCell>
                <TableCell style={{ width: 150 }} align="right">
                  Total Submitted
                </TableCell>
                <TableCell style={{ width: 200 }} align="right">
                  Approved Budget
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {months.map((monthItem) => {
                const monthLabel = moment(monthItem, "MM")
                  .format("MMMM")
                  .toLowerCase();

                let total = 0;
                let totalApproved = 0;

                const currentPlan = find(
                  costPlans,
                  (it) => it.month === Number(monthItem)
                );
                const previousPlan = find(
                  costPlans,
                  (it) => it.month === Number(monthItem) - 1
                );

                const startMonth = fiscalStartDate.split("/")[1];
                const isPreviousSubmitted =
                  (startMonth && monthItem === startMonth) ||
                  (previousPlan &&
                    previousPlan.cost_plan_status === "SUBMITTED");

                if (currentPlan) {
                  currentPlan.cost_plan_items.forEach((it) => {
                    Object.keys(it.cash_flow).forEach((key) => {
                      total += parseFloat(it.cash_flow[key] || 0);
                    });
                  });

                  totalAll += total;
                }

                item.cost_plan_items.forEach((it) => {
                  totalApproved += parseFloat(it.cash_flow[monthLabel] || 0);
                });

                return (
                  <TableRow key={monthItem}>
                    <TableCell
                      style={{ width: 150, textTransform: "capitalize" }}
                    >
                      {monthLabel}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        width: 100,
                        color: total > totalApproved ? "red" : "black",
                        verticalAlign: "middle",
                      }}
                    >
                      {costSumFormatter(total)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ width: 100, verticalAlign: "middle" }}
                    >
                      {costSumFormatter(totalApproved)}
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 15,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 15,
                          }}
                        >
                          {currentPlan &&
                            currentPlan.cost_plan_status !== "SUBMITTED" &&
                            checkPermissions("update_warrant_request") && (
                              <IconButton
                                onClick={() => {
                                  setIsEdited(currentPlan);
                                }}
                              >
                                <EditIcon color="primary" />
                              </IconButton>
                            )}
                          {currentPlan &&
                            checkPermissions("view_warrant_request") && (
                              <IconButton
                                onClick={() => {
                                  setIsShown(currentPlan);
                                }}
                              >
                                <ShowIcon color="primary" />
                              </IconButton>
                            )}
                          {!currentPlan &&
                            isPreviousSubmitted &&
                            checkPermissions("add_warrant_request") && (
                              <IconButton
                                onClick={() => {
                                  handleCreateMonthly(Number(monthItem));
                                }}
                              >
                                <AddIcon color="primary" />
                              </IconButton>
                            )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell variant="head">Total</TableCell>
                <TableCell variant="head" align="right">
                  {getMonthsTotal() || "-"}
                </TableCell>
                <TableCell variant="head" align="right">
                  {getApprovedTotal() || "-"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isEdited && !isShown && (
        <WorkPlansEditFormsMonthly
          {...props}
          basePath="/cost-plans"
          resource="cost-plans"
          id={isEdited.id}
          record={isEdited}
          projectDetails={details}
          projectCode={project.budget_code}
          year={isEdited.year}
          onSave={() => {
            setIsEdited(false);
            refresh(project.id);
            refreshMonthsData();
          }}
          onClose={() => setIsEdited(false)}
          totalItem={item}
          previousSubmittedSum={submittedData}
        />
      )}
      {isShown && (
        <WorkPlansViewMonthly
          basePath="/cost-plans"
          id={isShown.id}
          resource="cost-plans"
          record={isShown}
          projectDetails={details}
          projectCode={project.budget_code}
          totalItem={item}
          onClose={() => setIsShown(false)}
          onApprove={() => handleConfirm(isShown.id)}
          defaultBreadcrumbs
        />
      )}
    </div>
  );
};

const WorkPlansShowMonthly = ({ filter = {}, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  // const [costPlans, setCostPlans] = useState([]);
  // const [costPlansAdjusted, setCostPlansAdjusted] = useState([]);
  const [costPlansTabs, setCostPlansTabs] = useState([]);
  const [project, setProject] = React.useState(null);
  const [projectDetails, setProjectDetails] = React.useState(null);
  const dataProvider = useDataProvider();
  const [value, setValue] = React.useState(0);
  const showNotification = useNotify();
  const refresh = useRefresh();
  const dispatch = useDispatch();

  const [costPlansApproved, setCostPlansApproved] = useState();
  const [costPlansAdjustedApproved, setCostPlansAdjustedApproved] = useState();

  const refreshTabs = (id) => {
    const projectId = props.id || props.match?.params?.id;
    setIsLoading(true);

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
                    cost_plan_type: "ADJUSTED",
                    cost_plan_status: "SUBMITTED",
                  },
                })
                .then((resAdjusted) => {
                  setCostPlansAdjustedApproved(resAdjusted.data);
                });

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
                  setCostPlansApproved(resApproved.data);
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
        case props.showWorkPlanMonthly:
          return { to: "/work_plan_monthly", title: "Warrant Request" };
        default:
          break;
      }
    };

    if (!props.defaultBreadcrumbs) {
      dispatch(
        setBreadCrumps([{ ...getLinks() }, { to: "", title: "Details" }])
      );
    }
  }, []);

  useEffect(() => {
    const projectId = props.id || props.match?.params?.id;
    setIsLoading(true);
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
                    cost_plan_type: "ADJUSTED",
                    cost_plan_status: "SUBMITTED",
                  },
                })
                .then((resAdjusted) => {
                  setCostPlansAdjustedApproved(resAdjusted.data);
                });

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
                  setCostPlansApproved(resApproved.data);
                });
            }
          });
      }
    });
  }, []);

  useEffect(() => {
    if (costPlansApproved && costPlansAdjustedApproved) {
      const grYearsApproved = groupBy(costPlansApproved, "year");
      const grYearsAdjusted = groupBy(costPlansAdjustedApproved, "year");

      const tabs = Object.keys(grYearsApproved).map((year) => {
        const resultGroup = {};

        resultGroup[year] = grYearsAdjusted[year] || grYearsApproved[year];
        const maxRecord = maxBy(resultGroup[year], "id");

        return {
          id: year,
          content: (
            <WorkPlanShowEdit
              {...props}
              basePath="/cost-plans"
              resource="cost-plans"
              item={maxRecord}
              details={projectDetails}
              project={project}
              refresh={() => refreshTabs()}
            />
          ),
        };
      });

      setCostPlansTabs([...tabs]);
      setIsLoading(false);
    }
  }, [costPlansApproved, costPlansAdjustedApproved]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (isLoading) {
    return null;
  }

  if (costPlansApproved?.length === 0) {
    return (
      <Card style={{ padding: "35px" }}>
        <Typography variant="h3" style={{ marginTop: 30 }}>
          No approved budget
        </Typography>
      </Card>
    );
  }

  return (
    <Card>
      <Tabs value={value} onChange={handleChange} variant="scrollable">
        {costPlansTabs?.length > 0 &&
          costPlansTabs?.map((item) => (
            <Tab
              label={item && getFiscalYearValueFromYear(item?.id).name}
              key={item?.id}
            />
          ))}
      </Tabs>
      {costPlansTabs?.length > 0 &&
        costPlansTabs.map((item, idx) => (
          <TabPanel value={value} index={idx} key={item?.id}>
            {item?.content}
          </TabPanel>
        ))}
    </Card>
  );
};

export default WorkPlansShowMonthly;

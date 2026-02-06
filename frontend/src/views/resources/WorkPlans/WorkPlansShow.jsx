import {
  Box,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
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
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useDispatch } from "react-redux";
import { setBreadCrumps } from "../../../actions/ui";
import { groupBy, isEmpty, keys, sumBy } from "lodash";
import BpmsPopup from "./BpmsPopup";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";

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
  const isCompleted = project?.project_status === "COMPLETED";
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const dispatch = useDispatch();
  const [isShownBudget, setIsShownBudget] = useState(false);
  const [bpmsData, setBpmsData] = useState([]);
  const [fundsData, setFundsData] = useState({});
  const checkPermissions = useCheckPermissions();

  useEffect(() => {
    if (project?.budget_code && checkPermissions("list_bpms_data")) {
      dataProvider
        .getIntegrationData("integrations/bpms", {
          filter: {
            project_coa_code: project.budget_code,
            fiscal_year: `${item.year}/${String(item.year + 1).slice(-2)}`,
          },
        })
        .then((res) => {
          if (res?.data) {
            const groupedAmount = {};
            const groupedByFund = groupBy(
              res?.data?.filter((it) => it.costing),
              (it) => it.fund_source_code
            );

            Object.keys(groupedByFund).forEach((fundCode) => {
              groupedAmount[fundCode] = sumBy(
                groupedByFund[fundCode],
                "amount"
              );
            });

            setFundsData(groupedAmount);
            setBpmsData(res?.data);
          }
        });
    }
  }, [checkPermissions, dataProvider, item.year, project.budget_code]);

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

    return () => {
      dispatch(setBreadCrumps([]));
    };
  }, []);

  if (!project || !details || !item) return null;

  const handleShowBudget = () => {
    setIsShownBudget((prev) => !prev);
  };

  const handleConfirm = () => {
    dataProvider
      .update("cost-plans", {
        id: item.id,
        data: { cost_plan_status: "SUBMITTED" },
      })
      .then((result) => {
        refresh();
        showNotification("Cash flow was published!", "success");

        if (item.cost_plan_type === "PROJECTED") {
          const newItem = { ...item };
          delete newItem.id;

          handleCreate({
            ...newItem,
            cost_plan_items: newItem.cost_plan_items.map((it) => {
              const newIt = { ...it };
              delete newIt.id;
              delete newIt.cost_plan_id;

              return newIt;
            }),
            cost_plan_status: "DRAFT",
            cost_plan_type: "APPROVED",
          });
        }
      })
      .catch((result) => {
        console.log(result, "result");
        showNotification("Cash flow was not published!", "error");
      });
  };

  const handleCreate = (params) => {
    dataProvider
      .create("cost-plans", {
        data: { ...params },
      })
      .then((result) => {
        // showNotification("Cash flow created!");
        refresh();
      })
      .catch((result) => {
        showNotification("Cash flow was not created!", "error");
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
          refresh();
        }}
        onClose={() => setIsEdit(false)}
        bpmsData={fundsData}
      />
    ) : (
      <WorkPlansView
        {...props}
        basePath="/cost-plans"
        id={item.id}
        resource="cost-plans"
        record={item}
        projectDetails={details}
        bpmsData={fundsData}
      />
    );

  const isPublishDisabled = () => {
    if (item.cost_plan_items?.length === 0) return true;
    const emptyData = item.cost_plan_items.filter((it) =>
      isEmpty(it.cash_flow)
    );

    const grFunds = groupBy(item.cost_plan_items, (it) => it.fund.code);
    const totalFunds = {};
    let totalFundsSum = 0;
    keys(grFunds).forEach((fund) => {
      // total += parseFloat(data[year] || 0);
      totalFunds[fund] = 0;

      grFunds[fund].forEach((act) => {
        const fundCashFlow = act.cash_flow;
        keys(fundCashFlow).forEach((month) => {
          totalFunds[fund] += parseFloat(fundCashFlow[month] || 0);
        });
      });

      totalFundsSum += totalFunds[fund];
    });

    // bpmsData[fundCode]
    let totalBpms = 0;
    keys(fundsData).forEach((fund) => {
      totalBpms += parseFloat(fundsData[fund] || 0);
    });

    return (
      emptyData.length === item.cost_plan_items?.length ||
      totalBpms !== totalFundsSum
    );
  };

  const publishPermission = props.showWorkPlanApproved
    ? checkPermissions("publish_approved_cash_flow")
    : checkPermissions("publish_projected_cash_flow");

  const editPermission = props.showWorkPlanApproved
    ? checkPermissions("update_approved_cash_flow")
    : checkPermissions("update_projected_cash_flow");

  const viewPermission = props.showWorkPlanApproved
    ? checkPermissions("view_approved_cash_flow")
    : checkPermissions("view_projected_cash_flow");

  const isPublishAllowed =
    publishPermission &&
    item.cost_plan_status === "DRAFT" &&
    !isCompleted &&
    !isEdit;

  const isViewEditAllowed =
    ((!isEdit && editPermission) || (isEdit && viewPermission)) &&
    item.cost_plan_status === "DRAFT" &&
    !isCompleted &&
    !isEdit;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          marginBottom: 5,
          gap: 15,
        }}
      >
        {checkPermissions("list_bpms_data") && (
          <Button
            onClick={handleShowBudget}
            label={"Budget"}
            color="primary"
            variant="text"
            startIcon={<AccountBalanceIcon />}
            disabled={bpmsData.length === 0}
          />
        )}
        {isPublishAllowed && (
          <Button
            onClick={handleConfirm}
            label={"Publish"}
            color="primary"
            variant="contained"
            startIcon={<PlaylistAddCheckIcon />}
            disabled={isPublishDisabled()}
          />
        )}
        {isViewEditAllowed && (
          <Button
            onClick={() => {
              setIsEdit((prev) => !prev);
            }}
            label={isEdit ? "Show" : "Edit"}
            color="primary"
            variant="contained"
            startIcon={isEdit ? <VisibilityIcon /> : <EditIcon />}
          />
        )}
      </div>

      <div>{renderContent()}</div>
      {isShownBudget && bpmsData.length > 0 && (
        <BpmsPopup
          fiscalYear={`${item.year}/${String(item.year + 1).slice(-2)}`}
          projectCode={project.budget_code}
          onClose={handleShowBudget}
          bpmsData={bpmsData}
        />
      )}
    </div>
  );
};

const WorkPlansShow = ({ filter = {}, ...props }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [costPlans, setCostPlans] = useState([]);
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
                    ...filter,
                  },
                })
                .then((res) => {
                  if (res?.data) {
                    const tabs = res.data.map((item) => ({
                      id: item.year,
                      content: (
                        <WorkPlanShowEdit
                          {...props}
                          basePath="/cost-plans"
                          resource="cost-plans"
                          item={item}
                          details={formatValuesToQuery({ ...resp.data })}
                          project={response.data}
                          refresh={() => refreshTabs(projectId)}
                        />
                      ),
                    }));
                    setCostPlans(res.data);
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
  };

  useEffect(() => {
    const getLinks = () => {
      switch (true) {
        case props.showWorkPlan:
          return { to: "/#/work_plan", title: "Projected Cash Flow" };
        case props.showWorkPlanApproved:
          return { to: "/#/work_plan_approved", title: "Approved Cash Flow" };
        case props.showWorkPlanAdjusted:
          return { to: "/#/work_plan_adjusted", title: "Adjusted Cash Flow" };

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
                    ...filter,
                  },
                })
                .then((res) => {
                  if (res?.data) {
                    const tabs = res.data.map((item) => ({
                      id: item.year,
                      content: (
                        <WorkPlanShowEdit
                          {...props}
                          basePath="/cost-plans"
                          resource="cost-plans"
                          item={item}
                          details={formatValuesToQuery({ ...resp.data })}
                          project={response.data}
                          refresh={() => refreshTabs(projectId)}
                        />
                      ),
                    }));
                    setCostPlans(res.data);
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
        refreshTabs(project.id);

        if (costPlans?.length < duration) {
          handleCreate({
            cost_plan_items: [],
            project_detail_id: projectDetails.id,
            year: Number(lastOne.year) + 1,
          });
        }
      })
      .catch((result) => {
        console.log(result, "err");
        showNotification("Cash flow was not submitted!");
      });
    setShowConfirm(false);
  };

  const handleCreate = (params) => {
    dataProvider
      .create("cost-plans", {
        data: { ...params },
      })
      .then((result) => {
        showNotification("Cash flow created!");
        refresh();
        refreshTabs(project.id);
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
    if (!project) return null;

    const fiscalStartDate = getFeatureValue("fiscal_year_start_date");
    const startYear = project && moment(project.signed_date).format("YYYY");
    const startFiscalYear = moment(
      `${fiscalStartDate}/${startYear}`,
      "DD/MM/YYYY"
    );

    return moment(project.signed_date).isSameOrAfter(startFiscalYear)
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
        {costPlans?.length < duration && props.showWorkPlan && (
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

export default WorkPlansShow;

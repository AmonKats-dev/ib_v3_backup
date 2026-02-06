import { Box, Card, Tab, Tabs } from "@material-ui/core";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Button, useDataProvider, useNotify, useRefresh } from "react-admin";
import { useDispatch } from "react-redux";
import { setBreadCrumps } from "../../../actions/ui";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";
import AnnualContent from "./AnnualContent";
import ExpendituresPopup from "./ExpendituresPopup";
import WorkPlansViewExpenditures from "./WorkPlansViewExpenditures";

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

const WorkPlanShowEdit = ({
  item,
  details,
  project,
  refresh,
  costPlans,
  ...props
}) => {
  const dataProvider = useDataProvider();
  const dispatch = useDispatch();
  const [isShownBudget, setIsShownBudget] = useState(false);
  const [expendituresData, setExpendituresData] = useState([]);
  const checkPermissions = useCheckPermissions();

  useEffect(() => {
    if (checkPermissions("list_expenditures_data")) {
      dataProvider
        .getIntegrationData("integrations/expenditures", {
          filter: {
            project_id: project.id,
            fiscal_year: `${item.year}/${String(item.year + 1).slice(-2)}`,
          },
        })
        .then((res) => {
          if (res?.data) {
            setExpendituresData(res?.data);
          }
        });
    }
  }, [checkPermissions, dataProvider, item.year, project.id]);

  useEffect(() => {
    const getLinks = () => {
      switch (true) {
        case props.showWorkPlan:
          return { to: "/work_plan", title: "Projected Cash Flow" };
        case props.showWorkPlanApproved:
          return { to: "/work_plan_approved", title: "Approved Cash Flow" };
        case props.showWorkPlanAdjusted:
          return { to: "/work_plan_adjusted", title: "Adjusted Cash Flow" };
        case props.showExpenditures:
          return { to: "/expenditures", title: "Expenditures" };
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

  const handleRefresh = (data) => {
    setExpendituresData(data);
    // setIsShownBudget((prev) => !prev);
  };

  const renderContent = () => (
    <WorkPlansViewExpenditures
      {...props}
      basePath="/cost-plans"
      id={item.id}
      resource="cost-plans"
      record={item}
      projectDetails={details}
      expendituresData={expendituresData}
      costPlans={costPlans}
    />
  );

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
        {checkPermissions("sync_expenditures_data") && (
          <Button
            onClick={handleShowBudget}
            label={"Upload"}
            color="primary"
            variant="text"
            startIcon={<AccountBalanceIcon />}
          />
        )}
      </div>
      <div>{renderContent()}</div>
      {isShownBudget && (
        <ExpendituresPopup
          fiscalYear={`${item.year}/${String(item.year + 1).slice(-2)}`}
          onClose={handleShowBudget}
          project={project}
          costPlans={costPlans}
          onRefresh={handleRefresh}
          record={item}
        />
      )}
    </div>
  );
};

const WorkPlansExpenditures = ({ filter = {}, ...props }) => {
  const [costPlansTabs, setCostPlansTabs] = useState([]);
  const [projectDetails, setProjectDetails] = React.useState(null);
  const dataProvider = useDataProvider();
  const [value, setValue] = React.useState(0);
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
                          costPlans={res.data}
                        />
                      ),
                    }));
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
        case props.showExpenditures:
          return { to: "/#/expenditures", title: "Expenditures" };

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
                          costPlans={res.data}
                        />
                      ),
                    }));
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
      </Tabs>
      {costPlansTabs.map((item, idx) => (
        <TabPanel value={value} index={idx} key={item.id}>
          {item.content}
        </TabPanel>
      ))}
    </Card>
  );
};

export default WorkPlansExpenditures;

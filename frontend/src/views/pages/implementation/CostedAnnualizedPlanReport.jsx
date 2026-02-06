// in src/Dashboard.js
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CancelIcon from "@material-ui/icons/Cancel";
import LocalAtmOutlinedIcon from "@material-ui/icons/LocalAtmOutlined";
import SaveIcon from "@material-ui/icons/Save";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import moment from "moment";
import * as React from "react";
import {
  useCreate,
  useDataProvider,
  useNotify,
  useRedirect,
  useTranslate,
} from "react-admin";
import { useHistory } from "react-router-dom";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import AccessibilityIcon from "@material-ui/icons/Accessibility";
import GavelIcon from "@material-ui/icons/Gavel";
import WarningIcon from "@material-ui/icons/Warning";
import PeopleIcon from "@material-ui/icons/People";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { orderBy } from "lodash";
import axios from "axios";
import { API_URL } from "../../../constants/config";
import { TOKEN } from "../../../constants/auth";

// SessionStorage key used by ImplementationModule table when navigating here (exact project/code from table)
const IMPLEMENTATION_SELECTED_PROJECT_KEY = "implementation_module_selected_project";

const CARD_ACCENTS = {
  "cost-plans": { bg: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)", icon: "#1565c0" },
  "project-management": { bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", icon: "#2e7d32" },
  "myc": { bg: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)", icon: "#e65100" },
  "appeals": { bg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)", icon: "#c2185b" },
  "risk-assessments": { bg: "linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)", icon: "#f9a825" },
  "stakeholder-engagements": { bg: "linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)", icon: "#0288d1" },
  "human-resources": { bg: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)", icon: "#7b1fa2" },
};

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  pageCard: {
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  pageTitle: {
    fontWeight: 600,
    fontSize: "1.35rem",
    color: theme.palette.grey[800],
    margin: theme.spacing(3, 4, 0),
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
  },
  cardsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(3),
    padding: theme.spacing(3, 4, 4),
    justifyContent: "flex-start",
  },
  card: {
    position: "relative",
    width: 200,
    minHeight: 220,
    borderRadius: 12,
    overflow: "hidden",
    border: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.common.white,
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
      borderColor: theme.palette.grey[300],
      backgroundColor: "rgba(255,255,255,0.35)",
    },
    "&:hover $cardIconStrip": {
      opacity: 0.5,
    },
    "&:hover $cardContent": {
      opacity: 0.5,
    },
    "&:hover $cardActions": {
      opacity: 1,
      visibility: "visible",
    },
  },
  cardIconStrip: {
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "opacity 0.2s ease",
  },
  cardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2, 2, 1),
    transition: "opacity 0.2s ease",
  },
  cardTitle: {
    textAlign: "center",
    fontSize: "0.95rem",
    lineHeight: 1.35,
    fontWeight: 600,
    color: theme.palette.grey[800],
  },
  cardActions: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
    backgroundColor: "transparent",
    opacity: 0,
    visibility: "hidden",
    transition: "opacity 0.2s ease, visibility 0.2s ease",
  },
  actionBtn: {
    width: "100%",
    textTransform: "none",
    fontWeight: 600,
    borderRadius: 8,
  },
}));

function CostedAnnualizedPlanReport(props) {
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const [resources, setResources] = React.useState([]);
  // const [costPlans, setCostPlans] = React.useState([]);
  const [showYearSelector, setShowYearSelector] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(null);
  const [details, setDetails] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const [projectFromTable, setProjectFromTable] = React.useState(null); // exact project/code from implementation-module table
  const [currentRes, setCurrentRes] = React.useState(null);
  const [projectDetailId, setProjectDetailId] = React.useState(null);
  const [resolveError, setResolveError] = React.useState(null);
  const [resolving, setResolving] = React.useState(true);

  const [createCostPlans] = useCreate("cost-plans");
  const [createRiskAssessments] = useCreate("risk-assessments");
  const [createStakeholders] = useCreate("stakeholder-engagements");
  const [createHumanResources] = useCreate("human-resources");

  const history = useHistory();
  const redirectTo = useRedirect();
  const notify = useNotify();
  const idParam = props.match?.params?.id;

  // Capture / keep track of exact project and code from implementation-module table (from navigation state or sessionStorage)
  React.useEffect(() => {
    const fromState = props.location?.state?.projectData;
    if (fromState && fromState.code) {
      setProjectFromTable(fromState);
      try {
        sessionStorage.setItem(IMPLEMENTATION_SELECTED_PROJECT_KEY, JSON.stringify(fromState));
      } catch (e) {
        // ignore
      }
      return;
    }
    try {
      const stored = sessionStorage.getItem(IMPLEMENTATION_SELECTED_PROJECT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.code && String(parsed.code) === String(idParam)) {
          setProjectFromTable(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [idParam, props.location?.state?.projectData]);

  // Resolve URL id (project code from PBS or numeric project_detail_id) to project_detail_id
  React.useEffect(() => {
    setResolveError(null);
    if (!idParam) {
      setResolveError("Missing project identifier");
      setResolving(false);
      return;
    }
    const numericId = parseInt(idParam, 10);
    if (!isNaN(numericId) && String(numericId) === String(idParam)) {
      setProjectDetailId(numericId);
      setResolving(false);
      return;
    }
    if (props.location?.state?.projectData?.id) {
      setProjectDetailId(Number(props.location.state.projectData.id));
      setResolving(false);
      return;
    }
    const token = localStorage.getItem(TOKEN);
    const tryLookup = (filterKey) =>
      axios.get(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          per_page: 1,
          filter: JSON.stringify({ [filterKey]: idParam }),
        },
      });

    const getProjectRow = (res) => {
      const data = res?.data?.data ?? res?.data ?? [];
      const list = Array.isArray(data) ? data : [];
      return list[0];
    };

    tryLookup("code")
      .then((res) => {
        const projectRow = getProjectRow(res);
        if (projectRow?.id) return projectRow;
        return tryLookup("budget_code").then(getProjectRow);
      })
      .then((projectRow) => {
        if (!projectRow?.id) {
          setResolveError("Project not found in IBP. This project may only exist in PBS.");
          return;
        }
        return axios.get(`${API_URL}/project-details`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            per_page: 1,
            filter: JSON.stringify({ project_id: projectRow.id }),
          },
        });
      })
      .then((detailRes) => {
        if (!detailRes) return;
        const detailData = detailRes?.data?.data ?? detailRes?.data ?? [];
        const detailList = Array.isArray(detailData) ? detailData : [];
        const pd = detailList[0];
        if (pd?.id) {
          setProjectDetailId(pd.id);
        } else {
          setResolveError("Project not found in IBP. This project may only exist in PBS.");
        }
      })
      .catch(() => {
        setResolveError("Project not found in IBP. This project may only exist in PBS.");
      })
      .finally(() => {
        setResolving(false);
      });
  }, [idParam, props.location?.state?.projectData?.id]);

  React.useEffect(() => {
    if (projectDetailId == null || resolving) return;

    const token = localStorage.getItem(TOKEN);
    const authHeaders = {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };

    const resourcesList = [
      "cost-plans",
      "risk-assessments",
      "stakeholder-engagements",
      "human-resources",
    ];

    resourcesList.forEach((resource) => {
      const filter = JSON.stringify({ project_detail_id: Number(projectDetailId) });
      const url = `${API_URL}/${resource}?page=1&per_page=-1&sort_field=id&sort_order=ASC&filter=${encodeURIComponent(filter)}`;
      axios
        .get(url, {
          headers: authHeaders,
          validateStatus: (status) => status === 200 || status === 404,
        })
        .then((res) => {
          if (res.status === 200 && res.data != null) {
            const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
            setResources((prev) => ({ ...prev, [resource]: data }));
          } else {
            setResources((prev) => ({ ...prev, [resource]: [] }));
          }
        })
        .catch(() => {
          setResources((prev) => ({ ...prev, [resource]: [] }));
        });
    });
    // missing_ok=1: backend returns 200 with { data: null } when not found (avoids 404 in console)
    axios
      .get(`${API_URL}/project-details/${Number(projectDetailId)}?missing_ok=1`, {
        headers: authHeaders,
      })
      .then((response) => {
        const detailData = response.data?.data ?? response.data;
        if (!detailData) {
          setResolveError("Project not found or you do not have access.");
          return;
        }
        setDetails(detailData);

        const projectId = Number(detailData?.project_id);
        const hasValidProjectId = !Number.isNaN(projectId) && projectId > 0;

        if (hasValidProjectId) {
          const appealsFilter = JSON.stringify({ project_id: projectId });
          const appealsUrl = `${API_URL}/appeals?page=1&per_page=-1&sort_field=id&sort_order=ASC&filter=${encodeURIComponent(appealsFilter)}`;
          axios
            .get(appealsUrl, {
              headers: authHeaders,
              validateStatus: (status) => status === 200 || status === 404,
            })
            .then((res) => {
              if (res.status === 200 && res.data != null) {
                const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
                setResources((prev) => ({ ...prev, appeals: data }));
              } else {
                setResources((prev) => ({ ...prev, appeals: [] }));
              }
            })
            .catch(() => {
              setResources((prev) => ({ ...prev, appeals: [] }));
            });
        } else {
          setResources((prev) => ({ ...prev, appeals: [] }));
        }

        if (hasValidProjectId) {
          axios
            .get(`${API_URL}/projects/${projectId}`, {
              headers: authHeaders,
              validateStatus: (status) => status === 200 || status === 404,
            })
            .then((res) => {
              if (res.status === 200 && res.data) {
                const data = res.data?.data ?? res.data;
                if (data) setProject(data);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        setResolveError("Project not found or you do not have access.");
      });

    setSelectedYear(getYearsFromCurrent()[0].id);
  }, [projectDetailId, resolving]);

  const handleCreateCostPlans = () => {
    if (projectDetailId == null) return;
    const token = localStorage.getItem(TOKEN);
    axios
      .get(`${API_URL}/project-details/${Number(projectDetailId)}?missing_ok=1`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status === 200 || status === 404,
      })
      .then((res) => {
        if (res.status !== 200) {
          notify("messages.project_detail_not_found_pbs", "warning");
          return;
        }
        const detailData = res.data?.data ?? res.data;
        if (!detailData) {
          notify("messages.project_detail_not_found_pbs", "warning");
          return;
        }
        if (!detailData || !Array.isArray(detailData.activities)) {
          notify("messages.project_detail_not_found_pbs", "warning");
          return;
        }
        const formattedActivities = detailData.activities.map((item) => {
          const { id, ...rest } = item;
          return { ...rest, activity_id: id };
        });

        createCostPlans(
          {
            payload: {
              data: {
                year: Number(selectedYear),
                project_detail_id: projectDetailId,
                cost_plan_activities: formattedActivities,
                cost_plan_items: [],
              },
            },
          },
          {
            onSuccess: ({ data: newRecord }) => {
                notify("New Report Created", {});
                redirectTo(`/cost-plans/${newRecord.id}`);
              },
          }
        );
      })
      .catch(() => {
        notify("messages.project_detail_not_found_pbs", "warning");
      });
  };

  const getLatestCostPlan = () => {
    const filtered = orderBy(resources["cost-plans"], "id").filter(
      (item) => Number(item.year) === Number(selectedYear)
    );

    return filtered.length ? filtered[0].id : null;
  };

  function renderButtons(resource) {
    if (resources[resource] && resources[resource].length > 0) {
      return [
        <Button
          className={classes.actionBtn}
          variant="contained"
          color="primary"
          onClick={() => {
            if (resource === "cost-plans") {
              setCurrentRes(resource);
              if (getLatestCostPlan()) {
                redirectTo(`/cost-plans/${getLatestCostPlan()}`);
              } else {
                handleCreateCostPlans();
              }
            } else if (resource === "risk-assessments") {
              setCurrentRes(resource);
              redirectTo(
                `/risk-assessments/${projectDetailId}/list`
              );
            } else if (resource === "stakeholder-engagements") {
              setCurrentRes(resource);
              redirectTo(
                `/stakeholder-engagements/${projectDetailId}/list`
              );
            } 
           else if (resource === "human-resources") {
            setCurrentRes(resource);
            redirectTo(
              `/human-resources/${projectDetailId}/list`
            );
          }
            else if (resource === "appeals") {
              setCurrentRes(resource);
              redirectTo(`/appeals/${projectDetailId}/list`);
            } else {
              redirectTo(
                `/${resource}/${projectDetailId}/create`
              );
            }
          }}
        >
          {resource === "risk-assessments" ||
          resource === "stakeholder-engagements" ||
          resource === "appeals" || resource === "human-resources"
            ? "Manage"
            : "Update"}
        </Button>,
          <Button
            className={classes.actionBtn}
            variant="contained"
            onClick={() => {
              if (resource === "cost-plans") {
                if (getLatestCostPlan()) {
                  redirectTo(`/cost-plans/${getLatestCostPlan()}/show`);
                }
              } else {
                redirectTo(
                  `/${resource}/${projectDetailId}/report`
                );
              }
            }}
          >
            View Report
          </Button>
      ];
    }

    return (
      <Button
        className={classes.actionBtn}
        variant="contained"
        color="primary"
        onClick={() => {
          switch (resource) {
            case "cost-plans":
              if (!getLatestCostPlan()) {
                setShowYearSelector(true);
              }

              setCurrentRes(resource);
              break;
            case "myc": {
              setCurrentRes(resource);
              const projectData =
                projectFromTable ||
                (idParam && {
                  code: idParam,
                  title:
                    details?.project?.name ??
                    project?.name ??
                    projectFromTable?.title ??
                    "Project",
                  start_date: details?.start_date ?? "N/A",
                  end_date: details?.end_date ?? "N/A",
                  status: "N/A",
                  phase: "N/A",
                });
              history.push(`/implementation-module/${idParam}/myc-form`, projectData ? { projectData } : {});
              break;
            }
            case "project-management":
              details &&
                details.project_id &&
                redirectTo(
                  `/project-management/${project.project_management?.id}`
                );
              break;
            default:
              redirectTo(
                `/${resource}/${projectDetailId}/create`
              );
              break;
          }
        }}
      >
        {resource === "myc" || resource === "project-management"
          ? "Edit"
          : "Create"}
      </Button>
    );
  }

  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleCreate = () => {
    handleCreateCostPlans();
    setShowYearSelector(false);
  };

  function getYearsFromCurrent() {
    const currentYear = moment().startOf("year");
    const nextYear = currentYear.clone().add(1, "years");

    return [
      {
        id: moment(getFiscalYearValueFromYear(currentYear).id).format("YYYY"),
        name: getFiscalYearValueFromYear(currentYear).name,
      },
      {
        id: moment(getFiscalYearValueFromYear(nextYear).id).format("YYYY"),
        name: getFiscalYearValueFromYear(nextYear).name,
      },
    ];
  }

  if (resolving) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ padding: 24, textAlign: "center" }}>
          <Typography>Loading project...</Typography>
        </Grid>
      </Grid>
    );
  }

  if (resolveError) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ padding: 24 }}>
          <Typography color="error" style={{ marginBottom: 16 }}>
            {resolveError}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() =>
              history.push("/implementation-module", {
                state: projectFromTable ? { projectData: projectFromTable } : undefined,
              })
            }
          >
            Back to Implementation Module
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Button
          onClick={() => {
            setShowYearSelector(false);
            history.push("/implementation-module", {
              state: projectFromTable ? { projectData: projectFromTable } : undefined,
            });
          }}
          label="Back"
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          style={{ margin: "10px 0px" }}
        >
          Back
        </Button>
        <Card className={classes.pageCard}>
          <Typography className={classes.pageTitle} variant="h2">
            {(() => {
              const projectCode =
                projectFromTable?.code ?? details?.project?.code ?? idParam ?? "";
              const projectName =
                projectFromTable?.title ?? details?.project?.name ?? (idParam ? `Project ${idParam}` : "Costed Annualized Plan");
              return projectCode ? `${projectCode} - ${projectName}` : projectName;
            })()}
          </Typography>
          <Box className={classes.cardsGrid}>
            {[
              { key: "cost-plans", title: "Costed Annualized Plan", Icon: LocalAtmOutlinedIcon, wrap: false },
              { key: "project-management", title: "Project management tool kit", Icon: HomeWorkIcon, wrap: false },
              { key: "myc", title: "Multi-Year Commitments (MYC)", Icon: AccountBalanceIcon, wrap: true },
              { key: "appeals", title: "Appeals / Change Request", Icon: GavelIcon, wrap: false },
              { key: "risk-assessments", title: "Risk Assessment", Icon: WarningIcon, wrap: false },
              { key: "stakeholder-engagements", title: "Stakeholder Engagement", Icon: PeopleIcon, wrap: false },
              { key: "human-resources", title: "Human Resources management", Icon: AccessibilityIcon, wrap: false },
            ].map(({ key, title, Icon, wrap }) => {
              const accent = CARD_ACCENTS[key] || { bg: "#f5f5f5", icon: "#616161" };
              return (
                <Paper
                  key={key}
                  elevation={0}
                  className={classes.card}
                  onClick={
                    wrap
                      ? () => {
                          setCurrentRes("myc");
                          const projectData =
                            projectFromTable ||
                            (idParam && {
                              code: idParam,
                              title:
                                details?.project?.name ??
                                project?.name ??
                                projectFromTable?.title ??
                                "Project",
                              start_date: details?.start_date ?? "N/A",
                              end_date: details?.end_date ?? "N/A",
                              status: "N/A",
                              phase: "N/A",
                            });
                          history.push(`/implementation-module/${idParam}/myc-form`, projectData ? { projectData } : {});
                        }
                      : undefined
                  }
                  style={{ cursor: wrap ? "pointer" : undefined }}
                >
                  <div
                    className={classes.cardIconStrip}
                    style={{ background: accent.bg }}
                  >
                    <Icon style={{ fontSize: 36, color: accent.icon }} />
                  </div>
                  <div className={classes.cardContent}>
                    <Typography className={classes.cardTitle}>{title}</Typography>
                  </div>
                  <div
                    className={classes.cardActions}
                    onClick={(e) => wrap && e.stopPropagation()}
                  >
                    {renderButtons(key)}
                  </div>
                </Paper>
              );
            })}
          </Box>
        </Card>
      </Grid>
      {showYearSelector && (
        <Dialog
          fullWidth
          maxWidth={"xs"}
          open={showYearSelector}
          onClose={() => {
            setShowYearSelector(false);
          }}
          style={{ overflow: "hidden" }}
        >
          <DialogTitle>Create</DialogTitle>
          <DialogContent>
            <InputLabel style={{ marginBottom: 5 }}>
              {"Select Fiscal Year"}
            </InputLabel>
            <Select
              fullWidth
              variant="outlined"
              value={selectedYear || ""}
              onChange={handleChange}
            >
              {getYearsFromCurrent() &&
                getYearsFromCurrent().map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowYearSelector(false);
              }}
              label="Cancel"
              variant="outlined"
              color="primary"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={!selectedYear}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Grid>
  );
}

export default CostedAnnualizedPlanReport;

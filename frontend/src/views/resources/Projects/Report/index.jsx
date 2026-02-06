import "./styles.css";

import React, { Component, Fragment } from "react";
import { ThemeProvider, makeStyles, useTheme } from "@material-ui/core/styles";

import { ActivitiesInvestments } from "./components/ActivitiesInvestments";
import { ActualReleases } from "./components/MEReport/ActualReleases";
import { AdditionalInformation } from "./components/AdditionalInformation";
import Alert from "@material-ui/lab/Alert";
import { Attacments } from "./components/Attacments";
import { EvaluationProjectImpacts } from "./components/EvaluationProjectImpacts";
import { ExPostEvaluation } from "./components/ExPostEvaluation";
import { ExPostEvaluationMethodology } from "./components/ExPostEvaluationMethodology";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { FinancialExecutionCorrectiveMeasure } from "./components/MEReport/FinancialExecutionCorrectiveMeasure";
import { FinancialMonitoring } from "./components/MEReport/FinancialMonitoring";
import { FiscalAllocationCorrectiveMeasures } from "./components/MEReport/FiscalAllocationCorrectiveMeasures";
import GantChart from "./components/GantChart";
import GanttChartView from "../../../pages/gantt/GantChart";
import { GovernmentAgencies } from "./components/GovernmentAgencies";
// import { Table } from 'reactstrap';
// import { translate, ReferenceField, FunctionField } from 'react-admin';
// import './styles.scss';
// import InvestmentList from '../Projects/InvestmentList';
import HTML2React from "html2react";
import { ImplementingAgencies } from "./components/ImplementingAgencies";
import { Introduction } from "./components/Introduction";
import { OMCosts } from "./components/OMCosts";
import { OptionsAnalysis } from "./components/OptionsAnalysis";
import { OptionsAppraisal } from "./components/OptionsAppraisal";
import { OutputInvestments } from "./components/OutputInvestments";
import { PhysicalMonitoring } from "./components/MEReport/PhysicalMonitoring";
import { PlannedReleases } from "./components/MEReport/PlannedReleases";
import { ProjectBackGround } from "./components/ProjectBackGround";
import { ProjectFinancialProgressStatus } from "./components/MEReport/ProjectFinancialProgressStatus";
import { ProjectFramework } from "./components/ProjectFramework";
import { ProjectInformation } from "./components/ProjectInformation";
import { ProjectPhysicalPCorrectiveMeasures } from "./components/MEReport/ProjectPhysicalPCorrectiveMeasures";
import { ProjectPhysicalProgressStatus } from "./components/MEReport/ProjectPhysicalProgressStatus";
// import { ProjectPhysicalProgressStatus } from "./components/MEReport/ProjectPhysicalProgressStatus";
import { ProjectTechnicalInformation } from "./components/ProjectTechnicalInformation";
import { ProposedFunding } from "./components/ProposedFunding";
import { ResultMatrix } from "./components/ResultMatrix";
import { Stakeholders } from "./components/Stakeholders";
import { SummaryPerfomance } from "./components/MEReport/SummaryPerfomance";
import { TheoryOfChange } from "./components/TheoryOfChange";
import lodash from "lodash";
import { romanize } from "../../../../helpers/formatters";
import { useEffect } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import { MEAttacments } from "./components/MEReport/MEAttacments";
import { PhysicalMonitoringFramework } from "./components/MEReport/PhysicalMonitoringFramework";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { checkFeature } from "../../../../helpers/checkPermission";
import { useDispatch } from "react-redux";

import { ConceptNote } from "./jm/templates/ConceptNote";
import { ProjectProposal } from "./jm/templates/ProjectProposal";
import { IssuesAndRecommendations } from "./jm/components/IssuesAndRecommendations";
import { BudgetAllocation } from "./jm/templates/BudgetAllocation";
import { Implementation } from "./jm/templates/Implementation";
import PageBreak from "./components/PageBreak";
import { FinancialMonitoringBudget } from "./components/MEReport/FinancialMonitoringBudget";
import { ProjectBudgetAllocation } from "./components/ProjectBudgetAllocation";
import { Behavior } from "./components/Behavior";
import AsideRankData from "./components/AsideRankData";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(8),
  },
  ganttChartTable: {
    "& th": {
      borderLeft: "3px solid #c8ced3",
    },

    "& td": {
      padding: "3px 0px !important",
      borderLeft: "1px solid #c8ced3",
    },

    "& .title": {
      paddingLeft: "15px !important",
    },

    "& .filledCell": {
      background: "blue",
      padding: "12px 0px",
    },
  },
  button: {
    marginLeft: 15,
  },
}));

function MEReportsList(props) {
  const { customRecord, customBasePath, translate } = props;
  const [reports, serReports] = React.useState([]);

  const [selectedReport, setSelectedReport] = React.useState(null);
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getListOfAll("me-reports", {
        sort_field: "id",
        filter: {
          project_detail_id: customRecord.id,
        },
      })
      .then((response) => {
        if (response && response.data) {
          serReports(response.data);
        }
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelectReport = (id) => () => {
    const report = lodash.find(
      customRecord.me_reports,
      (item) => item.id === Number(id)
    );
    setSelectedReport(report);
  };

  function renderContent() {
    switch (value) {
      case 0:
        return (
          <List>
            {reports &&
              reports
                .filter((item) => item.start_date)
                .map((item) => {
                  return (
                    <ListItem
                      key={item.id}
                      onClick={handleSelectReport(item.id)}
                    >
                      <ListItemText
                        primary={
                          item.start_date
                            ? `${item.start_date} - ${item.end_date}`
                            : `${item.year}`
                        }
                        secondary={item.report_status}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Approve
                      </Button>
                    </ListItem>
                  );
                })}
          </List>
        );
      case 1:
        return (
          <List>
            {reports &&
              reports
                .filter((item) => !item.start_date)
                .map((item) => {
                  return (
                    <ListItem
                      key={item.id}
                      onClick={handleSelectReport(item.id)}
                    >
                      <ListItemText
                        primary={
                          item.start_date
                            ? `${item.start_date} - ${item.end_date}`
                            : `${item.year}`
                        }
                        secondary={item.report_status}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                      >
                        Approve
                      </Button>
                    </ListItem>
                  );
                })}
          </List>
        );
      default:
        break;
    }
  }

  return (
    <div className={classes.reportContainer}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
      >
        <Tab label="Periodical" />
        <Tab label="Yearly" />
      </Tabs>
      {renderContent()}

      {selectedReport && (
        <>
          <PhysicalMonitoringFramework {...props} meReport={selectedReport} />
          <PageBreak />

          <PhysicalMonitoring {...props} meReport={selectedReport} />
          <PageBreak />

          <ProjectPhysicalProgressStatus {...props} meReport={selectedReport} />
          <PageBreak />

          <ProjectPhysicalPCorrectiveMeasures
            {...props}
            meReport={selectedReport}
          />
          <PageBreak />

          <FinancialMonitoringBudget {...props} meReport={selectedReport} />
          <PageBreak />

          {/* <FinancialMonitoring {...props} meReport={selectedReport} />
          <PageBreak /> */}

          {/* <PlannedReleases {...props} meReport={selectedReport} />
          <PageBreak />

          <ActualReleases {...props} meReport={selectedReport} />
          <PageBreak /> */}

          <ProjectFinancialProgressStatus
            {...props}
            meReport={selectedReport}
          />
          <PageBreak />

          <FiscalAllocationCorrectiveMeasures
            {...props}
            meReport={selectedReport}
          />
          <PageBreak />

          <FinancialExecutionCorrectiveMeasure
            {...props}
            meReport={selectedReport}
          />
          <PageBreak />

          <SummaryPerfomance {...props} meReport={selectedReport} />
          <PageBreak />

          <MEAttacments {...props} meReport={selectedReport} />
        </>
      )}
    </div>
  );
}

function ProjectReport(props) {
  const [sectors, setSectors] = React.useState([]);
  const [showMap, setShowMap] = useState(false);
  const translate = useTranslate();
  const hasPimisFields = checkFeature("has_pimis_fields");
  const hasSectors = checkFeature("project_has_sectors");
  const [selectedMeReport, setSelectedMeReport] = React.useState(null);
  const [showReport, setShowReport] = React.useState(false);
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (hasSectors) {
      dataProvider
        .getListOfAll("sectors", {
          sort_field: "id",
        })
        .then((response) => {
          if (response && response.data) {
            setSectors(response.data);
          }
        });
    }
  }, []);

  useEffect(() => {
    const { customRecord, customBasePath, translate } = props;
    const meReport = lodash.maxBy(customRecord.me_reports, (item) => item.year);
    if (meReport) {
      setSelectedMeReport(meReport.id);
    }
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    checkFeature("has_pimis_fields") &&
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: `${props.customRecord?.project?.name}`,
        },
      });

    return () => {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: "",
        },
      });
    };
  }, []);

  const handleShowMap = () => {
    setShowMap(!showMap);
  };

  function renderPCN() {
    if (hasPimisFields) {
      return <ConceptNote {...props} />;
    }
    return (
      <div>
        <PageBreak />
        <ProjectBackGround
          counter="1"
          showMap={showMap}
          onShowMap={handleShowMap}
          {...props}
        />
        <PageBreak />
        <ProjectFramework counter="2" {...props} />
        <PageBreak />
        <GovernmentAgencies counter="2.4" {...props} />
        <PageBreak />
        <OutputInvestments counter="3" {...props} />
        <PageBreak />
        <ImplementingAgencies counter="3.1" {...props} />
        <PageBreak />
        <AdditionalInformation counter="4" {...props} />
        <PageBreak />
        <Attacments counter="5" {...props} />
      </div>
    );
  }

  function renderPP() {
    if (hasPimisFields) {
      return <ProjectProposal {...props} />;
    }

    return (
      <div>
        <PageBreak />
        <ProjectBackGround
          counter="1"
          showMap={showMap}
          onShowMap={handleShowMap}
          {...props}
        />
        <PageBreak />
        <ProjectFramework counter="2" {...props} />
        <PageBreak />
        <ResultMatrix counter="3" {...props} />
        <PageBreak />
        <GantChart counter="3.1" record={props.customRecord} />
        <PageBreak />
        <GovernmentAgencies counter="3.2" {...props} />
        <PageBreak />
        <ActivitiesInvestments counter="4" {...props} />
        <PageBreak />
        <ImplementingAgencies counter="4.1" {...props} />
        <PageBreak />
        <AdditionalInformation counter="5" {...props} />
        <PageBreak />
        <Attacments counter="6" {...props} />
      </div>
    );
  }

  function renderPFS() {
    const { customRecord, customBasePath, translate } = props;
    if (hasPimisFields) {
      return <BudgetAllocation {...props} />;
    }
    return (
      <div>
        <PageBreak />
        <ExecutiveSummary counter="1" {...props} />
        <PageBreak />
        <Introduction counter="2" {...props} />
        <PageBreak />
        <ProjectBackGround
          counter="3"
          showMap={showMap}
          onShowMap={handleShowMap}
          {...props}
        />
        <PageBreak />
        <OptionsAnalysis counter="4" {...props} />
        <PageBreak />
        <ResultMatrix counter="10" {...props} />
        <PageBreak />
        <GantChart counter="10.1" record={props.customRecord} />
        <PageBreak />
        <GovernmentAgencies counter="10.2" {...props} />
        <PageBreak />
        <ActivitiesInvestments counter="11" {...props} />
        <PageBreak />
        <ImplementingAgencies counter="11.1" {...props} />
        <PageBreak />
        <ProposedFunding counter="12" {...props} />
        <PageBreak />
        <AdditionalInformation counter="13" {...props} />
        <PageBreak />
        <Attacments counter="14" {...props} />
      </div>
    );
  }

  function renderFS() {
    const { customRecord, customBasePath, translate } = props;
    if (hasPimisFields) {
      return <Implementation {...props} />;
    }

    return (
      <div>
        <PageBreak />
        <ExecutiveSummary counter="1" {...props} />
        <PageBreak />
        <Introduction counter="2" {...props} />
        <PageBreak />
        <ProjectBackGround
          counter="3"
          showMap={showMap}
          onShowMap={handleShowMap}
          {...props}
        />
        <PageBreak />
        <ResultMatrix counter="4" {...props} />
        <PageBreak />
        <GantChart counter="4.1" record={props.customRecord} />
        <PageBreak />
        <OptionsAppraisal counter="5" {...props} record={props.customRecord} />
        <PageBreak />
        <ActivitiesInvestments counter="14" {...props} />
        <PageBreak />
        <OMCosts counter="14.1" {...props} />
        <PageBreak />
        <ImplementingAgencies counter="14.2" {...props} />
        <PageBreak />
        <ProposedFunding counter="15" {...props} />
        <PageBreak />
        <AdditionalInformation counter="16" {...props} />
        <PageBreak />
        <Attacments counter="17" {...props} />
      </div>
    );
  }

  function renderDS() {
    const { customRecord, customBasePath, translate } = props;
    return (
      <div>
        <ExecutiveSummary counter="1" {...props} />
        <PageBreak />

        <ProjectBackGround
          counter="2"
          showMap={showMap}
          onShowMap={handleShowMap}
          {...props}
        />
        <PageBreak />

        <GovernmentAgencies counter="2.4" {...props} />
        <PageBreak />

        <Stakeholders counter="3" {...props} />
        <PageBreak />

        <ResultMatrix counter="4" {...props} />
        <PageBreak />

        <GantChart counter="4.1" record={props.customRecord} />
        <PageBreak />

        <ProjectTechnicalInformation counter="5" record={props.customRecord} />
        <PageBreak />

        <ActivitiesInvestments counter="6" {...props} />
        <PageBreak />

        <OMCosts counter="6.1" {...props} />
        <PageBreak />

        <ImplementingAgencies counter="6.2" {...props} />
        <PageBreak />

        <ProposedFunding counter="7" {...props} />
        <PageBreak />

        <AdditionalInformation counter="8" {...props} />
        <PageBreak />

        <Attacments counter="9" {...props} />
      </div>
    );
  }

  function renderPC() {
    const { customRecord, customBasePath, translate } = props;

    if (
      customRecord?.project?.classification === "RETOOLING" ||
      customRecord?.project?.classification === "STUDIES"
    ) {
      return (
        <div>
          <ExecutiveSummary counter="1" {...props} />
          <PageBreak />

          <ProjectBackGround
            counter="2"
            showMap={showMap}
            onShowMap={handleShowMap}
            {...props}
          />
          <PageBreak />

          <ResultMatrix counter="3" {...props} />
          <PageBreak />

          <GantChart counter="3.1" record={props.customRecord} />
          <PageBreak />

          <ActivitiesInvestments counter="3.2" {...props} />
          <PageBreak />

          <ProposedFunding counter="3.3" {...props} />
          <PageBreak />

          <AdditionalInformation counter="4" {...props} />
          <PageBreak />

          <Attacments counter="5" {...props} />
        </div>
      );
    }

    return (
      <div>
        <ExecutiveSummary counter="1" {...props} />
        <PageBreak />

        <Introduction counter="2" {...props} />
        <PageBreak />

        <GovernmentAgencies counter="2.4" {...props} />
        <PageBreak />

        <Behavior counter="2.5" {...props} />
        <PageBreak />

        <ProjectBackGround
          counter="3"
          showMap={showMap}
          onShowMap={handleShowMap}
          {...props}
        />
        <PageBreak />

        <ResultMatrix counter="4" {...props} />
        <PageBreak />

        <GantChart counter="4.1" record={props.customRecord} />
        <PageBreak />

        <OptionsAppraisal counter="5" {...props} />
        <PageBreak />

        <ActivitiesInvestments counter="14" {...props} />
        <PageBreak />

        <OMCosts counter="14.1" {...props} />
        <PageBreak />

        <ImplementingAgencies counter="14.2" {...props} />
        <PageBreak />

        <ProposedFunding counter="15" {...props} />
        <PageBreak />

        <AsideRankData counter="16" {...props} />
        <PageBreak />

        <AdditionalInformation counter="17" {...props} />
        <PageBreak />

        <Attacments counter="18" {...props} />
      </div>
    );
  }

  function renderBudgetAllocation() {
    return (
      <div>
        <ProjectBudgetAllocation counter="1" {...props} />
        <PageBreak />

        <ExecutiveSummary counter="2" {...props} />
        <PageBreak />

        <Introduction counter="3" {...props} />
        <PageBreak />

        <GovernmentAgencies counter="3.4" {...props} />
        <PageBreak />

        <ProjectBackGround
          counter="4"
          showMap={showMap}
          onShowMap={handleShowMap}
          {...props}
        />
        <PageBreak />

        <ResultMatrix counter="5" {...props} />
        <PageBreak />

        <GantChart counter="5.1" record={props.customRecord} />
        <PageBreak />

        <OptionsAppraisal counter="6" {...props} />
        <PageBreak />

        <ActivitiesInvestments counter="15" {...props} />
        <PageBreak />

        <OMCosts counter="15.1" {...props} />
        <PageBreak />

        <ImplementingAgencies counter="15.2" {...props} />
        <PageBreak />

        <ProposedFunding counter="16" {...props} />
        <PageBreak />

        <AdditionalInformation counter="17" {...props} />
        <PageBreak />

        <Attacments counter="18" {...props} />
      </div>
    );
  }

  function renderMEReport(showReport) {
    const { customRecord, customBasePath, translate } = props;
    const meReport = lodash.maxBy(customRecord.me_reports, (item) => item.year);
    // const selectedReport = lodash.find(
    //   customRecord.me_reports,
    //   (item) => item.id === Number(selectedMeReport)
    // );
    if (lodash.isEmpty(meReport) || !showReport)
      return (
        <div>
          <ResultMatrix {...props} counter={"2"} />
          <PageBreak />

          <GantChart counter="3" record={props.customRecord} />
          <PageBreak />

          <ActivitiesInvestments {...props} counter={"4"} />
          <PageBreak />

          <ImplementingAgencies counter="5" {...props} />
          <PageBreak />

          <ProposedFunding counter="6" {...props} />
          <PageBreak />

          <AdditionalInformation counter="7" {...props} />
          <PageBreak />

          <Attacments counter="8" {...props} />
        </div>
      );

    return (
      <div>
        <MEReportsList {...props} />
      </div>
    );
  }

  function renderExPost() {
    const { customRecord, customBasePath, translate } = props;

    return (
      <div>
        <ResultMatrix {...props} counter={"2"} />
        <PageBreak />

        <GantChart counter="3" record={props.customRecord} />
        <PageBreak />

        <ActivitiesInvestments {...props} counter={"4"} />
        <PageBreak />

        <ImplementingAgencies counter="5" {...props} />
        <PageBreak />

        <ProposedFunding counter="6" {...props} />
        <PageBreak />

        <AdditionalInformation counter="7" {...props} />
        <PageBreak />

        <Attacments counter="8" {...props} />
        {/* <h4>{romanize("1")}. Project Description</h4>
        <p>{HTML2React(props.customRecord.summary)}</p>
        <PageBreak />

        <ExPostEvaluation counter={2} record={props.customRecord} />
        <PageBreak />

        <ExPostEvaluationMethodology counter={3} record={props.customRecord} />
        <PageBreak />

        <TheoryOfChange counter="4" {...props} /> */}
      </div>
    );
  }

  function renderContentByPhase(showReport) {
    const { customRecord, customBasePath, translate } = props;

    if (!customRecord) return null;

    switch (customRecord.phase_id) {
      case 1:
        return renderPCN();
      case 2:
        return renderPP();
      case 3:
        return renderPFS();
      case 4:
        return renderFS();
      case 5:
        return renderPC();
      case 6:
        return renderBudgetAllocation();
      case 7:
        return renderMEReport(showReport);
      case 8:
        return renderExPost();
      default:
        return null;
    }
  }

  return (
    <div>
      <div id="docx" className="export_container Section2">
        {checkFeature("project_show_high_risk_alert") &&
          !lodash.isEmpty(props.customRecord) &&
          props.customRecord.is_high_risk && (
            <Alert
              severity="error"
              style={{ position: "absolute", top: "65px", right: "45%" }}
            >
              {translate("messages.high_risk_project")}
            </Alert>
          )}
        {!showReport && <ProjectInformation {...props} sectors={sectors} />}
        {renderContentByPhase(showReport)}
      </div>
    </div>
  );
}

export default ProjectReport;

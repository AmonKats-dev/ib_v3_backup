import React from "react";
import { useTranslate, ReferenceField, FunctionField } from "react-admin";
import { useSelector } from "react-redux";
import lodash from "lodash";
import HTML2React from "html2react";
import { NdpResult } from "../components/NdpResult";
import { OptionsAnalysis } from "../components/OptionsAnalysis";
import { ResultMatrix } from "../components/ResultMatrix";
import { ActivitiesInvestments } from "../components/ActivitiesInvestments";
import { IssuesAndRecommendations } from "../components/IssuesAndRecommendations";
import { Attacments } from "../../components/Attacments";
import { AdditionalInformation } from "../../components/AdditionalInformation";
import { ImplementingAgencies } from "../components/ImplementingAgencies";
import { ProjectInformation } from "../components/ProjectInformation";
import GanttChartView from "../../../../../pages/gantt/GantChart";
import { RiskAssessment } from "../components/RiskAssessment";
import { ClimateRiskMatrix } from "../components/ClimateRiskMatrix";
import { ProcurementModality } from "../components/ProcurementModality";
import { Stakeholders } from "../components/Stakeholders";
import { ProjectFinancing } from "../components/ProjectFinancing";
import { OMCosts } from "../components/OMCosts";
import { ProjectBudgetAllocation } from "../components/ProjectBudgetAllocation";
import PageBreak from "../../components/PageBreak";
import { ExecutingAgencies } from "../components/ExecutingAgencies";
import { CostEstimates } from "../components/CostEstimates";

export const Implementation = (props) => {
  const translate = useTranslate();
  const { customRecord, customBasePath } = props;
  const record = customRecord;
  const basePath = customBasePath;

  if (!record) {
    return null;
  }

  return (
    <div className="Section2">
      <div className="content-area">
        <ProjectBudgetAllocation counter="1" {...props} />
        <PageBreak />

        <ImplementingAgencies counter="2" {...props} />
        <PageBreak />

        <ExecutingAgencies counter="2.1" {...props} />
        <PageBreak />

        <ProjectInformation counter="3" {...props} />
        <PageBreak />

        <ProjectFinancing counter="4" {...props} />
        <PageBreak />

        <ProcurementModality counter="5" {...props} />
        <PageBreak />

        <ClimateRiskMatrix counter="6" {...props} />
        <PageBreak />

        <RiskAssessment counter="7" {...props} />
        <PageBreak />

        <Stakeholders counter="8" {...props} />
        <PageBreak />

        <GanttChartView counter="9.1" record={props.customRecord} />
        <PageBreak />

        <NdpResult counter="10" {...props} />
        <PageBreak />

        <OptionsAnalysis counter="11" {...props} />
        <PageBreak />

        <ResultMatrix counter="12" {...props} />
        <PageBreak />

        <ActivitiesInvestments counter="13" {...props} />
        <PageBreak />

        <CostEstimates counter="14" {...props} />
        <PageBreak />

        <OMCosts counter="15" {...props} />
        <PageBreak />

        <AdditionalInformation counter="16" {...props} />
        <PageBreak />

        <Attacments counter="17" {...props} />
        <PageBreak />

        <IssuesAndRecommendations counter="18" {...props} />
      </div>
    </div>
  );
};

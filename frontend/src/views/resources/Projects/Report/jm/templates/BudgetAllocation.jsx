import React from "react";
import { useTranslate } from "react-admin";
import GanttChartView from "../../../../../pages/gantt/GantChart";
import { AdditionalInformation } from "../../components/AdditionalInformation";
import { Attacments } from "../../components/Attacments";
import PageBreak from "../../components/PageBreak";
import { ClimateRiskMatrix } from "../components/ClimateRiskMatrix";
import { CostEstimates } from "../components/CostEstimates";
import { ExecutingAgencies } from "../components/ExecutingAgencies";
import { ImplementingAgencies } from "../components/ImplementingAgencies";
import { IssuesAndRecommendations } from "../components/IssuesAndRecommendations";
import { NdpResult } from "../components/NdpResult";
import { OMCosts } from "../components/OMCosts";
import { OptionsAnalysis } from "../components/OptionsAnalysis";
import { ProcurementModality } from "../components/ProcurementModality";
import { ProjectBudgetAllocation } from "../components/ProjectBudgetAllocation";
import { ProjectFinancing } from "../components/ProjectFinancing";
import { ProjectInformation } from "../components/ProjectInformation";
import { ResultMatrix } from "../components/ResultMatrix";
import { RiskAssessment } from "../components/RiskAssessment";
import { Stakeholders } from "../components/Stakeholders";

export const BudgetAllocation = (props) => {
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

        <CostEstimates counter="13" {...props} />
        <PageBreak />

        <OMCosts counter="14" {...props} />
        <PageBreak />

        <AdditionalInformation counter="15" {...props} />
        <PageBreak />

        <Attacments counter="16" {...props} />
        <PageBreak />

        <IssuesAndRecommendations counter="17" {...props} />
      </div>
    </div>
  );
};

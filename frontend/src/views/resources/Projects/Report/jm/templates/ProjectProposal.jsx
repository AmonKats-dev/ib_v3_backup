import React from "react";
import { useTranslate } from "react-admin";
import { AdditionalInformation } from "../../components/AdditionalInformation";
import { Attacments } from "../../components/Attacments";
import { ComponentsInvestments } from "../../components/ComponentsInvestments";
import { OutputInvestments } from "../../components/OutputInvestments";
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
import { ProjectFinancing } from "../components/ProjectFinancing";
import { ProjectInformation } from "../components/ProjectInformation";
import { ResultMatrix } from "../components/ResultMatrix";
import { RiskAssessment } from "../components/RiskAssessment";
import { Stakeholders } from "../components/Stakeholders";

export const ProjectProposal = (props) => {
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
        <ImplementingAgencies counter="1" {...props} />
        <PageBreak />

        <ExecutingAgencies counter="1.1" {...props} />
        <PageBreak />

        <ProjectInformation counter="2" {...props} />
        <PageBreak />

        <ProjectFinancing counter="3" {...props} />
        <PageBreak />

        <ProcurementModality counter="4" {...props} />
        <PageBreak />

        <ClimateRiskMatrix counter="5" {...props} />
        <PageBreak />

        <RiskAssessment counter="6" {...props} />
        <PageBreak />

        <Stakeholders counter="7" {...props} />
        <PageBreak />

        <NdpResult counter="8" {...props} />
        <PageBreak />

        <OptionsAnalysis counter="9" {...props} />
        <PageBreak />

        <CostEstimates counter="10" {...props} />
        <PageBreak />

        <ResultMatrix counter="11" {...props} />
        <PageBreak />

        <ComponentsInvestments counter="12" {...props} />
        <PageBreak />

        <OMCosts counter="13" {...props} />
        <PageBreak />

        <AdditionalInformation counter="14" {...props} />
        <PageBreak />

        <Attacments counter="15" {...props} />
        <PageBreak />

        <IssuesAndRecommendations counter="16" {...props} />
      </div>
    </div>
  );
};

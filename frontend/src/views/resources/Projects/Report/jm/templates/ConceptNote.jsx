import React from "react";
import { useTranslate } from "react-admin";
import { AdditionalInformation } from "../../components/AdditionalInformation";
import { Attacments } from "../../components/Attacments";
import PageBreak from "../../components/PageBreak";
import { CostEstimates } from "../components/CostEstimates";
import { ExecutingAgencies } from "../components/ExecutingAgencies";
import { ImplementingAgencies } from "../components/ImplementingAgencies";
import { IssuesAndRecommendations } from "../components/IssuesAndRecommendations";
import { NdpResult } from "../components/NdpResult";
import { OptionsAnalysis } from "../components/OptionsAnalysis";
import { ProcurementModality } from "../components/ProcurementModality";
import { ProjectFinancing } from "../components/ProjectFinancing";
import { ProjectInformation } from "../components/ProjectInformation";

export const ConceptNote = (props) => {
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

        <NdpResult counter="4" {...props} />
        <PageBreak />

        <OptionsAnalysis counter="5" {...props} />
        <PageBreak />

        <CostEstimates counter="6" {...props} />
        <PageBreak />

        <ProcurementModality counter="7" {...props} />
        <PageBreak />

        <AdditionalInformation counter="8" {...props} />
        <PageBreak />

        <Attacments counter="9" {...props} />
        <PageBreak />

        <IssuesAndRecommendations counter="10" {...props} />
      </div>
    </div>
  );
};

import HTML2React from "html2react";
import lodash, { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { romanize } from "../../../../../helpers/formatters";
import { costSumFormatter } from "../helpers";

const RANKING_SCORE = {
  5: "High",
  3: "Medium",
  1: "Low",
  0: "Not Available",
};

function AsideRankData({ counter, customRecord, ...props }) {
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  useEffect(() => {
    if (customRecord && customRecord.project_id && !data) {
      dataProvider
        .getOne("projects", {
          id: customRecord.project_id,
        })
        .then((response) => {
          setData(response.data);
          setIsFetching(false);
        });
    }
  }, []);

  if (!data?.ranking_data) {
    return (
      <div className="Section2">
        <div className="content-area">
          <h2>
            {romanize(counter)}.{" "}
            {translate("printForm.project_info.ranking_data")}
          </h2>
          <h4>There is no ranking data</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.project_info.ranking_data")}
        </h2>

        {!isFetching && !lodash.isEmpty(customRecord) && (
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      width: "100%",
                    }}
                  >
                    Project Problem Statement
                  </Typography>
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.problem_statement)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      width: "100%",
                    }}
                  >
                    Project Goal
                  </Typography>
                </TableCell>
                <TableCell>{customRecord.goal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      width: "100%",
                    }}
                  >
                    Project Outcomes
                  </Typography>
                </TableCell>
                <TableCell>
                  {customRecord.outcomes &&
                    customRecord.outcomes.map((item) => item.name).join(",")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      width: "100%",
                    }}
                  >
                    Project Outputs
                  </Typography>
                </TableCell>
                <TableCell>
                  {customRecord.outputs &&
                    customRecord.outputs.map((item) => item.name).join(",")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      width: "100%",
                    }}
                  >
                    Project FNPV
                  </Typography>
                </TableCell>
                <TableCell>
                  {customRecord.project_options &&
                    costSumFormatter(
                      customRecord.project_options
                        .filter((item) => item.is_preferred)
                        .map((item) =>
                          parseFloat(item.financial_evaluation.fnpv)
                        )
                        .join("")
                    )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      width: "100%",
                    }}
                  >
                    Project FIRR
                  </Typography>
                </TableCell>
                <TableCell>
                  {customRecord.project_options &&
                    customRecord.project_options
                      .filter((item) => item.is_preferred)
                      .map((item) => item.financial_evaluation.irr)
                      .join("")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      width: "100%",
                    }}
                  >
                    Project ENPV
                  </Typography>
                </TableCell>
                <TableCell>
                  {customRecord.project_options &&
                    costSumFormatter(
                      customRecord.project_options
                        .filter((item) => item.is_preferred)
                        .map((item) =>
                          parseFloat(item.economic_evaluation.enpv)
                        )
                        .join("")
                    )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="body2"
                    style={{
                      width: "100%",
                    }}
                  >
                    Project EIRR
                  </Typography>
                </TableCell>
                <TableCell>
                  {customRecord.project_options &&
                    customRecord.project_options
                      .filter((item) => item.is_preferred)
                      .map((item) => item.economic_evaluation.err)
                      .join("")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
        {!isFetching && data && data.ranking_data && (
          <>
            <Typography
              variant="body1"
              style={{
                marginLeft: 15,
                marginBottom: 10,
                marginTop: 20,
                width: "100%",
                fontWeight: "bold",
              }}
            >
              Strategic alignment to NDP and Vision 2040{" "}
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    variant="head"
                    style={{ width: "550px" }}
                  >
                    <Typography variant="body2">
                      Criteria Description
                    </Typography>
                  </TableCell>
                  <TableCell variant="head" style={{ width: "150px" }}>
                    <Typography variant="body2">Score</Typography>
                  </TableCell>
                  <TableCell variant="head">
                    <Typography variant="body2" style={{ width: "350px" }}>
                      Comments
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "350px" }}>
                    <Typography variant="body2">
                      Alignment to the National Development Plan (strategic fit)
                      NDP III has categorised projects according to their
                      prioritisation.
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.strategic_fit &&
                      RANKING_SCORE[data.ranking_data.strategic_fit.score]}
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.strategic_fit &&
                      data.ranking_data.strategic_fit.score}
                  </TableCell>
                  <TableCell>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.strategic_fit &&
                      data.ranking_data.strategic_fit.comments}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">
                      Regional Balance: Interventions that directly target
                      growth in key highly poverty hit regions as identified in
                      the NDP III.
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.inclusive_growth &&
                      RANKING_SCORE[data.ranking_data.inclusive_growth.score]}
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.inclusive_growth &&
                      data.ranking_data.inclusive_growth.score}
                  </TableCell>
                  <TableCell>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.inclusive_growth &&
                      data.ranking_data.inclusive_growth.comments}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">
                      Economic impact to the Country: Demonstrate good use of
                      public resources from a macroeconomic point of view.
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.economic &&
                      RANKING_SCORE[data.ranking_data.economic.score]}
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.economic &&
                      data.ranking_data.economic.score}
                  </TableCell>
                  <TableCell>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.economic &&
                      data.ranking_data.economic.comments}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} variant="head">
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      Total
                    </Typography>
                  </TableCell>
                  <TableCell variant="head">
                    {data.ranking_data &&
                      (data.ranking_data.strategic_fit
                        ? parseFloat(data.ranking_data.strategic_fit.score)
                        : 0) +
                        (data.ranking_data.inclusive_growth
                          ? parseFloat(data.ranking_data.inclusive_growth.score)
                          : 0) +
                        (data.ranking_data.economic
                          ? parseFloat(data.ranking_data.economic.score)
                          : 0)}
                  </TableCell>
                  <TableCell variant="head"></TableCell>
                </TableRow>
              </TableHead>
            </Table>

            <Typography
              variant="body1"
              style={{
                marginLeft: 15,
                marginBottom: 10,
                marginTop: 20,
                width: "100%",
                fontWeight: "bold",
              }}
            >
              Implementation Readiness: This looks at variables which relate to
              land acquisition and right of way, legal requirements,
              availability of required equipment, human resource, clearance from
              various stakeholders among others{" "}
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    variant="head"
                    style={{ width: "550px" }}
                  >
                    <Typography variant="body2">
                      Criteria Description
                    </Typography>
                  </TableCell>
                  <TableCell variant="head" style={{ width: "150px" }}>
                    <Typography variant="body2">Score</Typography>
                  </TableCell>
                  <TableCell variant="head">
                    <Typography variant="body2" style={{ width: "350px" }}>
                      Comments
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "350px" }}>
                    <Typography variant="body2">
                      Land acquisition and Right of way: Highly impacts project
                      costs and duration{" "}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.land_acquisition &&
                      RANKING_SCORE[data.ranking_data.land_acquisition.score]}
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.land_acquisition && [
                        data.ranking_data.land_acquisition.score,
                      ]}
                  </TableCell>
                  <TableCell>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.land_acquisition &&
                      data.ranking_data.land_acquisition.comments}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">
                      Developed and Quality work, procurement and implementation
                      plan
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.procurement &&
                      RANKING_SCORE[data.ranking_data.procurement.score]}
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.procurement && [
                        data.ranking_data.procurement.score,
                      ]}
                  </TableCell>
                  <TableCell>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.procurement &&
                      data.ranking_data.procurement.comments}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} variant="head">
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      Total
                    </Typography>
                  </TableCell>
                  <TableCell variant="head">
                    {data.ranking_data &&
                      (data.ranking_data.land_acquisition
                        ? parseFloat(data.ranking_data.land_acquisition.score)
                        : 0) +
                        (data.ranking_data.procurement
                          ? parseFloat(data.ranking_data.procurement.score)
                          : 0)}
                  </TableCell>
                  <TableCell variant="head"></TableCell>
                </TableRow>
              </TableHead>
            </Table>

            <Typography
              variant="body1"
              style={{
                marginLeft: 15,
                marginBottom: 10,
                marginTop: 20,
                width: "100%",
                fontWeight: "bold",
              }}
            >
              Budgeting readiness and Overall MTEF requirement: This relates to
              parameters that influence inclusion into the resource envelope{" "}
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    variant="head"
                    style={{ width: "550px" }}
                  >
                    <Typography variant="body2">
                      Criteria Description
                    </Typography>
                  </TableCell>
                  <TableCell variant="head" style={{ width: "150px" }}>
                    <Typography variant="body2">Score</Typography>
                  </TableCell>
                  <TableCell variant="head">
                    <Typography variant="body2" style={{ width: "350px" }}>
                      Comments
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell style={{ width: "350px" }}>
                    <Typography variant="body2">
                      Disbursement readiness : Ascertain disbursement readiness
                      for projects targeting external financing.
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.loan_negotiation &&
                      RANKING_SCORE[data.ranking_data.loan_negotiation.score]}
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.loan_negotiation && [
                        data.ranking_data.loan_negotiation.score,
                      ]}
                  </TableCell>
                  <TableCell>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.loan_negotiation &&
                      data.ranking_data.loan_negotiation.comments}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">
                      Multiyear project requirements including counterpart
                      requirement vs available fiscal space in the MTEF.{" "}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.fiscal_space &&
                      RANKING_SCORE[data.ranking_data.fiscal_space.score]}
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.fiscal_space && [
                        data.ranking_data.fiscal_space.score,
                      ]}
                  </TableCell>
                  <TableCell>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.fiscal_space &&
                      data.ranking_data.fiscal_space.comments}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2">
                      Interlinkages within the programme: Need to maximise
                      coordination of projects within the programme to leverage
                      time, money, and resources.{" "}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.interlinkages &&
                      RANKING_SCORE[data.ranking_data.interlinkages.score]}
                  </TableCell>
                  <TableCell style={{ width: "150px" }}>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.interlinkages && [
                        data.ranking_data.interlinkages.score,
                      ]}
                  </TableCell>
                  <TableCell>
                    {data &&
                      data.ranking_data &&
                      data.ranking_data.interlinkages &&
                      data.ranking_data.interlinkages.comments}
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} variant="head">
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      Total
                    </Typography>
                  </TableCell>
                  <TableCell variant="head">
                    {data.ranking_data &&
                      (data.ranking_data.loan_negotiation
                        ? parseFloat(data.ranking_data.loan_negotiation.score)
                        : 0) +
                        (data.ranking_data.fiscal_space
                          ? parseFloat(data.ranking_data.fiscal_space.score)
                          : 0) +
                        (data.ranking_data.interlinkages
                          ? parseFloat(data.ranking_data.interlinkages.score)
                          : 0)}
                  </TableCell>
                  <TableCell variant="head"></TableCell>
                </TableRow>
              </TableHead>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} variant="head">
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      Grand Total Score
                    </Typography>
                  </TableCell>
                  <TableCell variant="head">
                    {data && data.ranking_score}
                  </TableCell>
                  <TableCell variant="head"></TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </>
        )}
      </div>
    </div>
  );
}
// }

export default AsideRankData;

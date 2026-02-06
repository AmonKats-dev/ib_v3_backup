import React, { Component, useEffect, useState } from "react";
import lodash from "lodash";
import {
  billionsFormatter,
  costSumFormatter,
} from "../../resources/Projects/Report/helpers";
import { useDataProvider, useTranslate } from "react-admin";
import { PROJECT_PHASES } from "../../../constants/common";
import { calculateCost } from "./helpers";
import HTML2React from "html2react";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";

const RANKING_SCORE = {
  5: "High",
  3: "Medium",
  1: "Low",
  0: "Not Available",
};

function AsideRankData({ record, ...props }) {
  const [data, setData] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  useEffect(() => {
    if (record && record.id) {
      dataProvider
        .getListOfAll("project-details", {
          sort_field: "id",
          filter: { project_id: record.id, phase_id: 7 },
        })
        .then((response) => {
          setData(response.data[0]);
          setIsFetching(false);
        });
    }
  }, [record]);

  return (
    <div
      style={{
        width: "100%",
        minWidth: "960px",
      }}
    >
      {isFetching ? (
        <Typography variant="h5">Data is loading, please wait...</Typography>
      ) : (
        !lodash.isEmpty(data) && (
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
                <TableCell>{HTML2React(data.problem_statement)}</TableCell>
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
                <TableCell>{data.goal}</TableCell>
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
                  {data.outcomes &&
                    data.outcomes.map((item) => item.name).join(",")}
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
                  {data.outputs &&
                    data.outputs.map((item) => item.name).join(",")}
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
                  {data.project_options &&
                    costSumFormatter(
                      data.project_options
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
                  {data.project_options &&
                    data.project_options
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
                  {data.project_options &&
                    costSumFormatter(
                      data.project_options
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
                  {data.project_options &&
                    data.project_options
                      .filter((item) => item.is_preferred)
                      .map((item) => item.economic_evaluation.err)
                      .join("")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )
      )}
      {!isFetching && record && record.ranking_data && (
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
                  <Typography variant="body2">Criteria Description</Typography>
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
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.strategic_fit &&
                    RANKING_SCORE[record.ranking_data.strategic_fit.score]}
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.strategic_fit &&
                    record.ranking_data.strategic_fit.score}
                </TableCell>
                <TableCell>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.strategic_fit &&
                    record.ranking_data.strategic_fit.comments}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">
                    Regional Balance: Interventions that directly target growth
                    in key highly poverty hit regions as identified in the NDP
                    III.
                  </Typography>
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.inclusive_growth &&
                    RANKING_SCORE[record.ranking_data.inclusive_growth.score]}
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.inclusive_growth &&
                    record.ranking_data.inclusive_growth.score}
                </TableCell>
                <TableCell>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.inclusive_growth &&
                    record.ranking_data.inclusive_growth.comments}
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
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.economic &&
                    RANKING_SCORE[record.ranking_data.economic.score]}
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.economic &&
                    record.ranking_data.economic.score}
                </TableCell>
                <TableCell>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.economic &&
                    record.ranking_data.economic.comments}
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
                  {record.ranking_data &&
                    (record.ranking_data.strategic_fit
                      ? parseFloat(record.ranking_data.strategic_fit.score)
                      : 0) +
                      (record.ranking_data.inclusive_growth
                        ? parseFloat(record.ranking_data.inclusive_growth.score)
                        : 0) +
                      (record.ranking_data.economic
                        ? parseFloat(record.ranking_data.economic.score)
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
            land acquisition and right of way, legal requirements, availability
            of required equipment, human resource, clearance from various
            stakeholders among others{" "}
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={2}
                  variant="head"
                  style={{ width: "550px" }}
                >
                  <Typography variant="body2">Criteria Description</Typography>
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
                  Land acquisition and Right of way:  Highly impacts project costs and duration                    </Typography>
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.land_acquisition &&
                    RANKING_SCORE[record.ranking_data.land_acquisition.score]}
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.land_acquisition && [
                      record.ranking_data.land_acquisition.score,
                    ]}
                </TableCell>
                <TableCell>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.land_acquisition &&
                    record.ranking_data.land_acquisition.comments}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">
                  Developed and Quality work, procurement and implementation plan
                  </Typography>
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.procurement &&
                    RANKING_SCORE[record.ranking_data.procurement.score]}
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.procurement && [
                      record.ranking_data.procurement.score,
                    ]}
                </TableCell>
                <TableCell>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.procurement &&
                    record.ranking_data.procurement.comments}
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
                  {record.ranking_data &&
                    (record.ranking_data.land_acquisition
                      ? parseFloat(record.ranking_data.land_acquisition.score)
                      : 0) +
                      (record.ranking_data.procurement
                        ? parseFloat(record.ranking_data.procurement.score)
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
Budgeting readiness and Overall MTEF requirement: This relates to parameters that influence inclusion into the resource envelope           </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={2}
                  variant="head"
                  style={{ width: "550px" }}
                >
                  <Typography variant="body2">Criteria Description</Typography>
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
                  Disbursement readiness :  Ascertain disbursement readiness for projects targeting external financing.
                  </Typography>
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.loan_negotiation &&
                    RANKING_SCORE[record.ranking_data.loan_negotiation.score]}
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.loan_negotiation && [
                      record.ranking_data.loan_negotiation.score,
                    ]}
                </TableCell>
                <TableCell>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.loan_negotiation &&
                    record.ranking_data.loan_negotiation.comments}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">
                  Multiyear project requirements including counterpart requirement vs available fiscal space in the MTEF.                  </Typography>
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.fiscal_space &&
                    RANKING_SCORE[record.ranking_data.fiscal_space.score]}
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.fiscal_space && [
                      record.ranking_data.fiscal_space.score,
                    ]}
                </TableCell>
                <TableCell>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.fiscal_space &&
                    record.ranking_data.fiscal_space.comments}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="body2">
                  Interlinkages within the programme:  Need to maximise coordination of projects within the programme to leverage time, money, and resources.                   </Typography>
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.interlinkages &&
                    RANKING_SCORE[record.ranking_data.interlinkages.score]}
                </TableCell>
                <TableCell style={{ width: "150px" }}>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.interlinkages && [
                      record.ranking_data.interlinkages.score,
                    ]}
                </TableCell>
                <TableCell>
                  {record &&
                    record.ranking_data &&
                    record.ranking_data.interlinkages &&
                    record.ranking_data.interlinkages.comments}
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
                  {record.ranking_data &&
                    (record.ranking_data.loan_negotiation
                      ? parseFloat(record.ranking_data.loan_negotiation.score)
                      : 0) +
                      (record.ranking_data.fiscal_space
                        ? parseFloat(record.ranking_data.fiscal_space.score)
                        : 0) +
                      (record.ranking_data.interlinkages
                        ? parseFloat(record.ranking_data.interlinkages.score)
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
                  {record && record.ranking_score}
                </TableCell>
                <TableCell variant="head"></TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </>
      )}
    </div>
  );
}
// }

export default AsideRankData;

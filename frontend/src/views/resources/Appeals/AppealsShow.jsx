import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { CloseOutlined } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import clsx from "clsx";
import lodash, { isNaN } from "lodash";
import moment from "moment";
import React from "react";
import { useState } from "react";
import {
  Button,
  EditButton,
  ListButton,
  Show,
  SimpleShowLayout,
  TopToolbar,
  useDataProvider,
  useRedirect,
  useShowController,
} from "react-admin";
import { useHistory } from "react-router-dom";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import {
  getFiscalYearsRangeForIntervals,
  getFiscalYearValue,
} from "../../../helpers/formatters";
import { FIN_VALUES } from "./constants";
import HTML2React from "html2react";
import { costSumFormatter, dateFormatter } from "../../../helpers";
import WorkflowActions from "./WorkflowActions";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  bordered: {
    border: `1px solid ${theme.palette.border}`,
    "& td": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
    "& th": {
      padding: "0.75rem",
      verticalAlign: "top",
      border: "1px solid #c8ced3",
    },
  },
  filledRow: {
    backgroundColor: theme.palette.action.hover,
    fontWeight: "bold",
  },
}));

const Actions = (props) => {
  const redirect = useRedirect();

  return (
    <TopToolbar
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Button
        onClick={() => {
          redirect(`${props.basePath}/${Number(props?.projectDetailId)}/list`);
        }}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
        style={{ justifySelf: "flex-start" }}
      />
      <div>
        {props.data.appeal_status === "DRAFT" && (
          <EditButton {...props} record={props.data} />
        )}
        {props.data.appeal_status !== "COMPLETED" && (
          <WorkflowActions {...props} />
        )}
      </div>
    </TopToolbar>
  );
};

const AppealsShow = (props) => {
  const [details, setDetails] = useState();
  const [project, setProject] = useState();

  const classes = useStyles();
  const { record } = useShowController(props);
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    if (record)
      dataProvider
        .getOne("projects", {
          id: record?.project_id,
        })
        .then((resp) => {
          if (resp && resp.data) {
            setProject(resp.data);

            dataProvider
              .getOne("project-details", {
                id: resp.data.current_project_detail.id,
              })
              .then((res) => {
                if (res && res.data) {
                  setDetails(res.data);
                }
              });
          }
        });
  }, [record]);

  if (!record || !details || !project) return null;

  const targetYears = getFiscalYearsRangeForIntervals(
    moment(),
    record.proposed_extension_date
  );

  const renderReason = (record) => {
    return `${record.is_time ? "Time" : ""} ${record.is_scope ? "Scope" : ""} ${
      record.is_cost ? "Cost" : ""
    }`;
  };

  return (
    <Show
      {...props}
      actions={<Actions {...props} projectDetailId={details?.id} />}
    >
      <SimpleShowLayout>
        <div className="Section2">
          <div className="content-area">
            <Typography
              variant="h4"
              style={{ marginLeft: 15, marginBottom: 15 }}
            >
              {details &&
                `${details?.project?.code} - ${details?.project?.name}`}
            </Typography>
            <TableContainer>
              <Table
                size="medium"
                className={clsx("bordered", classes.bordered, classes.table)}
              >
                <TableBody>
                  <TableRow>
                    <TableCell>Implementing Agency:</TableCell>
                    <TableCell>
                      {details?.implementing_agencies &&
                        lodash
                          .uniqBy(
                            details?.implementing_agencies,
                            "organization_id"
                          )
                          .map((item) =>
                            item.organization ? (
                              <p>{`${item.organization.code} - ${item.organization.name}`}</p>
                            ) : null
                          )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Programme:</TableCell>
                    <TableCell>
                      {" "}
                      {project?.program?.code}-{project?.program?.name}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Original Project Cost:</TableCell>
                    <TableCell>
                      {" "}
                      {costSumFormatter(details?.investment_stats?.total_cost)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Original start date:</TableCell>
                    <TableCell> {dateFormatter(details?.start_date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Original end Date:</TableCell>
                    <TableCell> {dateFormatter(details?.end_date)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      What problem is the project addressing?
                    </TableCell>
                    <TableCell>
                      {details && HTML2React(details?.summary)}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Project Goal:</TableCell>
                    <TableCell>{details?.goal}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>What are project interventions?</TableCell>
                    <TableCell>{record.interventions}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2}>Summary Request:</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Proposed extension date:</TableCell>
                    <TableCell>{record.proposed_extension_date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Principal Reason for appeal:</TableCell>
                    <TableCell>{renderReason(record)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <div></div>
            <div>
              <Typography
                variant="h4"
                style={{ margin: "35px 0px", textTransform: "capitalize" }}
              >
                Project Financial Performance
              </Typography>

              <TableContainer>
                <Table
                  size="medium"
                  className={clsx("bordered", classes.bordered, classes.table)}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      {targetYears?.map((year) => {
                        return <TableCell colSpan={2}>{year.name}</TableCell>;
                      })}
                      <TableCell>Total</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      {targetYears?.map((year) => {
                        return (
                          <>
                            <TableCell>GoU</TableCell>
                            <TableCell>Donor</TableCell>
                          </>
                        );
                      })}
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {FIN_VALUES.map((item, idx) => {
                      let totalRow = 0;
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>

                          {targetYears?.map((year) => {
                            const gouValue =
                              record?.financial_performance &&
                              record.financial_performance[`fv${item.id}`][
                                `${year.id}y`
                              ].gou;
                            const donorValue =
                              record?.financial_performance &&
                              record.financial_performance[`fv${item.id}`][
                                `${year.id}y`
                              ].donor;

                            totalRow +=
                              parseFloat(gouValue) + parseFloat(donorValue);

                            return (
                              <>
                                <TableCell>{gouValue}</TableCell>
                                <TableCell>{donorValue}</TableCell>
                              </>
                            );
                          })}

                          <TableCell>
                            {!isNaN(totalRow)
                              ? costSumFormatter(totalRow)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div>
              <Typography
                variant="h4"
                style={{ margin: "15px 0px", textTransform: "capitalize" }}
              >
                Project Physical Performance
              </Typography>
              <TableContainer>
                <Table
                  size="medium"
                  className={clsx("bordered", classes.bordered, classes.table)}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell rowSpan={2}>
                        Outcome / Output / Indicator
                      </TableCell>
                      <TableCell rowSpan={2}>Original Baseline </TableCell>
                      <TableCell rowSpan={2}>Original Target</TableCell>
                      <TableCell colSpan={5}>
                        Assessment of cumulative physical performance
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      {targetYears?.map((year) => {
                        return <TableCell>{year.name}</TableCell>;
                      })}
                      <TableCell>Outstanding physical performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details?.outcomes?.map((outcome, idx) => {
                      const outcomeRender = (
                        <TableRow>
                          <TableCell colSpan={4 + targetYears.length}>
                            {outcome.name}
                          </TableCell>
                        </TableRow>
                      );

                      const outcomeIndicators = outcome?.indicators?.map(
                        (indicator, idx) => {
                          const years = Object.keys(indicator.targets);
                          const targetValue =
                            indicator.targets[years[years.length - 1]];

                          return (
                            <TableRow key={indicator.id}>
                              <TableCell>{indicator.name}</TableCell>
                              <TableCell>{indicator.baseline}</TableCell>
                              <TableCell>{targetValue}</TableCell>
                              {targetYears?.map((year) => {
                                const value =
                                  record.physical_performance &&
                                  record.physical_performance[
                                    `ind${indicator.id}`
                                  ][`${year.id}y`];

                                return <TableCell>{value}</TableCell>;
                              })}
                              <TableCell>
                                {record.physical_performance &&
                                  record.physical_performance[
                                    `ind${indicator.id}`
                                  ].performance}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      );

                      return (
                        <>
                          {outcomeRender}
                          {outcomeIndicators}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div>
              <Typography
                variant="h4"
                style={{ margin: "15px 0px", textTransform: "capitalize" }}
              >
                Financial Requirements of Project Outputs to be Achieved During
                the Proposed Extension
              </Typography>
              <TableContainer>
                <Table
                  size="medium"
                  className={clsx("bordered", classes.bordered, classes.table)}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>Output</TableCell>
                      {targetYears?.map((year) => {
                        return <TableCell>{year.name}</TableCell>;
                      })}
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details?.outputs?.map((output, idx) => {
                      let totalRow = 0;

                      return (
                        <TableRow key={output.id}>
                          <TableCell style={{ width: "50px" }}>{`1. ${
                            idx + 1
                          }`}</TableCell>
                          <TableCell>{output.name}</TableCell>
                          {targetYears?.map((year) => {
                            const value =
                              record.financial_requirements &&
                              record.financial_requirements[`otp${output.id}`][
                                `${year.id}y`
                              ];
                            totalRow += parseFloat(value);
                            return <TableCell>{value}</TableCell>;
                          })}
                          <TableCell>
                            {!isNaN(totalRow)
                              ? costSumFormatter(totalRow)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography
                variant="h4"
                style={{ margin: "15px 0px", textTransform: "capitalize" }}
              >
                Implementation Plan
              </Typography>
              <TableContainer>
                <Table
                  size="medium"
                  className={clsx("bordered", classes.bordered, classes.table)}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Outputs</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details?.outputs?.map((output, idx) => {
                      const startDate =
                        record.implementation_plan &&
                        record.implementation_plan[`otp${output.id}`]
                          .start_date;

                      const endDate =
                        record.implementation_plan &&
                        record.implementation_plan[`otp${output.id}`].end_date;

                      return (
                        <TableRow key={output.id}>
                          <TableCell>{`Output ${idx + 1}: ${
                            output.name
                          }`}</TableCell>
                          <TableCell>{startDate}</TableCell>
                          <TableCell>{endDate}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div>
              <Typography
                variant="h4"
                style={{ margin: "15px 0px", textTransform: "capitalize" }}
              >
                Major project implementation challenges
              </Typography>
              <p>{record.challenges}</p>
            </div>

            <div>
              <Typography
                variant="h4"
                style={{ margin: "15px 0px", textTransform: "capitalize" }}
              >
                Recommendations for project implementation challenges
              </Typography>
              <p>{record.recommendations}</p>
            </div>

            <div>
              <Typography
                variant="h4"
                style={{ margin: "15px 0px", textTransform: "capitalize" }}
              >
                Additional Information
              </Typography>
              <p>{record.additional_info}</p>
            </div>

            <div>
              <Typography
                variant="h4"
                style={{ margin: "15px 0px", textTransform: "capitalize" }}
              >
                Attachments
              </Typography>
              {record.files?.map((item) => {
                return (
                  <a href={item.link} id={item.id}>
                    {item.title}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </SimpleShowLayout>
    </Show>
  );
};

export default AppealsShow;

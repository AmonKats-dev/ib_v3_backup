import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import React from "react";
import { Button, LoadingIndicator, useDataProvider, useRedirect } from "react-admin";
import lodash, { concat } from "lodash";
import { getFiscalYearValue } from "../../../helpers/formatters";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import ExportActions from "../../pages/reports/ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
    backgroundColor: "#fff",
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
  actions: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
}));

const RiskAssessmentsReport = (props) => {
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [details, setDetails] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(true);
  const [isFetchingDetails, setIsFetchingDetails] = React.useState(true);
  const dataProvider = useDataProvider();
  const history = useHistory();
  const redirect = useRedirect();

  React.useEffect(() => {
    dataProvider
      .getListOfAll("risk-assessments", {
        sort_field: "id",
        filter: { project_detail_id: Number(props.match?.params?.id) },
      })
      .then((resp) => {
        if (resp && resp.data) {
          const sorted = lodash.sortBy(
            resp.data,
            ["reporting_date", "reporting_quarter"],
            ["asc", "asc"]
          );
          setIsFetching(false);
          setData(sorted);
        }
      });

    dataProvider
      .getOne("project-details", {
        id: Number(props.match?.params?.id),
      })
      .then((resp) => {
        if (resp && resp.data) {
          setIsFetchingDetails(false);
          setDetails(resp.data);
        }
      });
  }, []);

  const getRiskAssessments = () => {
    if (details) {
      const { project_options } = details;
      const risks = concat(
        ...project_options.map((item) => item.risk_evaluations)
      );

      return risks;
    }

    return [];
  };

  if (isFetching || isFetchingDetails) return <LoadingIndicator />;

  const occuredRisks = data?.filter((item) => item.has_risk_occurred);
  const notOccuredRisks = data?.filter((item) => !item.has_risk_occurred);

  return (
    <div className="Section2">
      <div className={classes.actions}>
        <Button
          onClick={() => {
            redirect(
              `/implementation-module/${Number(
                props.match?.params?.id
              )}/costed-annualized-plan`
            );
          }}
          label="Back"
          color="primary"
          startIcon={<ArrowBackIcon />}
          style={{ marginBottom: 15 }}
        />
        <ExportActions
          reportId="report-container"
          title="Risk Assessments Report"
          exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
        />
      </div>

      <div className="content-area" id="report-container">
        <Typography variant="h3" style={{ marginLeft: 15, marginBottom: 15 }}>
          Risk Assessments Report (Pre-Investment)
        </Typography>
        {getRiskAssessments() && getRiskAssessments().length > 0 && (
          <TableContainer>
            <Table
              size="medium"
              className={clsx("bordered", classes.bordered, classes.table)}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Risk Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getRiskAssessments() &&
                  getRiskAssessments().map((record) => (
                    <TableRow>
                      <TableCell>{record.description}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <br />
        <Typography variant="h3" style={{ marginLeft: 15, marginBottom: 15 }}>
          Risk has occured
        </Typography>
        {occuredRisks && occuredRisks.length > 0 ? (
          <TableContainer>
            <Table
              size="medium"
              className={clsx("bordered", classes.bordered, classes.table)}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Risk Description</TableCell>
                  <TableCell>Effects</TableCell>
                  <TableCell>Mitigation Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {occuredRisks &&
                  occuredRisks.map((record) => (
                    <TableRow>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.effects || "-"}</TableCell>
                      <TableCell>{record.mitigation_response || "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No occured risks</p>
        )}
        <br />
        <Typography variant="h3" style={{ marginLeft: 15, marginBottom: 15 }}>
          Additional risks
        </Typography>
        {notOccuredRisks && notOccuredRisks.length > 0 ? (
          <TableContainer>
            <Table
              size="medium"
              className={clsx("bordered", classes.bordered, classes.table)}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Risk Description</TableCell>
                  <TableCell>Effects</TableCell>
                  <TableCell>Mitigation Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notOccuredRisks &&
                  notOccuredRisks.map((record) => (
                    <TableRow>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.effects || "-"}</TableCell>
                      <TableCell>{record.mitigation_response || "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No additional risks</p>
        )}
      </div>
    </div>
  );
};

export default RiskAssessmentsReport;

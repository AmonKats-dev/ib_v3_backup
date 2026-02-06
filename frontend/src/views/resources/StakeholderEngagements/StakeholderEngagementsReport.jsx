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
import { Button, Loading, LoadingIndicator, useDataProvider, useRedirect } from "react-admin";
import lodash from "lodash";
import { getFiscalYearValue } from "../../../helpers/formatters";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import ExportActions from "../../pages/reports/ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";
import HTML2React from "html2react";

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

const StakeholderEngagementsReport = (props) => {
  const classes = useStyles();
  const [isFetching, setIsFetching] = React.useState(true);
  const [isFetchingDetails, setIsFetchingDetails] = React.useState(true);
  const [data, setData] = React.useState([]);
  const dataProvider = useDataProvider();
  const [details, setDetails] = React.useState(null);
  const history = useHistory();
  const redirect = useRedirect();

  React.useEffect(() => {
    dataProvider
      .getListOfAll("stakeholder-engagements", {
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
          setData(sorted);
          setIsFetching(false);
        }
      });

    dataProvider
      .getOne("project-details", {
        id: Number(props.match?.params?.id),
      })
      .then((resp) => {
        if (resp && resp.data) {
          setDetails(resp.data);
          setIsFetchingDetails(false);
        }
      });
  }, []);

  if (isFetching || isFetchingDetails) return <LoadingIndicator />;

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
          title="Stakeholder Engagements Report"
          exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
        />
      </div>
      <div className="content-area" id="report-container">
        <Typography variant="h2" style={{ marginBottom: 15 }}>
          Stakeholder Engagements Report (Pre-Investment)
        </Typography>
        {details && details.stakeholders?.length > 0 && (
          <div>
            {details &&
              details.stakeholders?.map((record, idx) => (
                <div>
                  <Typography variant="h5">{`${idx + 1}) Name: ${
                    record.name
                  }`}</Typography>
                  <Typography variant="h5">Responsibilities:</Typography>
                  <Typography variant="p">
                    {HTML2React(record.responsibilities)}
                  </Typography>
                </div>
              ))}
          </div>
        )}

        <Typography variant="h2" style={{ marginBottom: 15 }}>
          Stakeholder Engagements
        </Typography>
        {data && data.length > 0 && (
          <TableContainer>
            <Table
              size="medium"
              className={clsx("bordered", classes.bordered, classes.table)}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Reporting Date</TableCell>
                  <TableCell>Reporting Quarter</TableCell>
                  <TableCell>Stakeholder Name</TableCell>
                  <TableCell>Interest Level</TableCell>
                  <TableCell>Level of Influence</TableCell>
                  <TableCell>Status of Engagement</TableCell>
                  <TableCell>Level of engagement</TableCell>
                  <TableCell>Engagement frequency</TableCell>
                  <TableCell>Communication Channel</TableCell>
                  <TableCell>Issues</TableCell>
                  <TableCell>Mitigation Measures</TableCell>
                  <TableCell>Responsible Entity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  data.map((record) => (
                    <TableRow>
                      <TableCell>
                        {record &&
                          getFiscalYearValue(record.reporting_date) &&
                          getFiscalYearValue(record.reporting_date).name}
                      </TableCell>{" "}
                      <TableCell>{record.reporting_quarter}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.interest_level}</TableCell>
                      <TableCell>{record.influence_level}</TableCell>
                      <TableCell>{record.engagement_status}</TableCell>
                      <TableCell>{record.engagement_level}</TableCell>
                      <TableCell>{record.engagement_frequency}</TableCell>
                      <TableCell>{record.communication_channel}</TableCell>
                      <TableCell>{record.issues}</TableCell>
                      <TableCell>{record.mitigation_plan}</TableCell>
                      <TableCell>{record.responsible_entity}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default StakeholderEngagementsReport;

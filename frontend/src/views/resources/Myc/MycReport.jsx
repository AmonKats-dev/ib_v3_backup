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
import { Button, useDataProvider, useRedirect } from "react-admin";
import lodash from "lodash";
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

const MycReport = (props) => {
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const dataProvider = useDataProvider();
  const history = useHistory();
  const redirect = useRedirect();

  React.useEffect(() => {
    dataProvider
      .getListOfAll("human-resources", {
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
        }
      });
  }, []);

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
          title="Human Resources Report"
          exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
        />
      </div>
      <div className="content-area" id="report-container">
        <Typography variant="h2" style={{ marginLeft: 15, marginBottom: 15 }}>
          Human Resources Report
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
                  <TableCell>Position</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact Details</TableCell>
                  <TableCell>Responsible Entity</TableCell>
                  <TableCell>Involvement Level</TableCell>
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
                      <TableCell>{record.position}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.contact_details}</TableCell>
                      <TableCell>{record.responsible_entity}</TableCell>
                      <TableCell>{record.involvement_level}</TableCell>
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

export default MycReport;

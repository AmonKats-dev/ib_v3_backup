import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import { EXPORT_TYPES } from "../../../constants/common";
import { costSumFormatter } from "../../../helpers";
import { getFiscalYearsRange } from "../../../helpers/formatters";
import { WorkflowStatusMessage } from "../../modules/Reports/helpers";
import ExportActions from "./ExportActions";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    fontWeight: "bold",
    margin: "10px 10px 20px 10px",
  },
  subtitle: {
    margin: "10px auto",
  },
  buttonsContainer: {
    width: "155px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "10px 25px",
    float: "right",
  },
  buttons: {
    width: "100px",
    fontSize: "16px",
    display: "flex",
    justifyContent: "space-around",
  },
  titleColumn: {
    width: "25%",
  },
  select: {
    margin: "0px 15px 15px 0px",
  },
}));

function ReportDC({ record, ...props }) {
  const translate = useTranslate();
  const [data, setData] = useState([]);
  const dataProvider = useDataProvider();
  const classes = useStyles();

  useEffect(() => {
    dataProvider
      .getListOfAllProjects("reports/projects-min-report", {
        sort_field: "id",
        filter: { phase_id: 5 },
      })
      .then((response) => {
        if (response && response.data) {
          const filtered = response.data.filter((project) =>
            moment(project.end_date).isAfter(moment().startOf("year"))
          );
          setData(filtered);
        }
      });
  }, []);

  const targetYears = getFiscalYearsRange(moment(), moment().add(4, "years"));

  return (
    <>
      <ExportActions
        reportId="report-container"
        title="Fiscal Load"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <Card id="report-container" style={{ overflow: "auto" }}>
        <Table>
          <TableHead>
            <TableRow className={classes.filledRow}>
              <TableCell width="120px">Project ID</TableCell>

              <TableCell align="center">
                {translate(`printForm.reports.vote_id`)}
              </TableCell>
              <TableCell className={classes.titleColumn}>
                {translate("printForm.reports.title")}
              </TableCell>

              <TableCell align="center">
                {translate("printForm.reports.status")}
              </TableCell>

              <TableCell align="center">
                {translate("printForm.reports.total_cost")}
              </TableCell>
              {targetYears &&
                targetYears.map((year) => (
                  <TableCell align="center">{year.name}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((project) => {
              project.totalRow = 0;
              return (
                <TableRow>
                  <TableCell>{project.code}</TableCell>
                  <TableCell align="center">
                    {project.phase &&
                      project.project_organization?.parent &&
                      `${project.project_organization?.parent?.code} - ${project.project_organization?.parent?.name}`}
                  </TableCell>
                  <TableCell>{project.name}</TableCell>

                  <TableCell align="center">
                  {project.workflow && (
                        <WorkflowStatusMessage record={project} />
                      )}
                  </TableCell>

                  <TableCell align="center">
                    {costSumFormatter(project.total_costs)}
                  </TableCell>
                  {targetYears &&
                    project &&
                    project.costs &&
                    targetYears.map((year) => {
                      const yearFormatted = moment(year.id).format("YYYY");
                      if (project.costs[yearFormatted]) {
                        project.totalRow += Number(
                          project.costs[yearFormatted]
                        );
                      }
                      return (
                        <TableCell align="center">
                          {costSumFormatter(project.costs[yearFormatted])}
                        </TableCell>
                      );
                    })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

export default ReportDC;

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import React from "react";
import { DeleteButton, useRedirect } from "react-admin";
import IndicatorsButton from "./IndicatorsButton";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import { isNaN } from "lodash";
import { costFormatterCeil } from "../../../helpers";
import { useCheckPermissions } from "../../../helpers/checkPermission";

const useStyles = makeStyles((theme) => ({
  row: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f1f6ff",
    },
    "& td": {
      verticalAlign: "middle",
    },
  },
}));

export const IndicatorList = ({ indicators, ...props }) => {
  const checkPermissions = useCheckPermissions();
  const classes = useStyles();

  const lastYear =
    props.targetYears && props.targetYears[props.targetYears.length - 1];

  const referencedOptions =
    (props.record && props.record[props.reference]) || [];

  const redirect = useRedirect();

  if (indicators && indicators.length === 0) return <h3>No Indicators</h3>;

  return (
    <TableContainer style={{ overflow: "auto", marginBottom: 25 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Baseline</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Progress (%)</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indicators &&
            indicators.map((item) => {
              if (!item) return null;
              const achieved = Math.abs(
                Number(item.achieved_target?.indicator_progress) -
                  Number(item.baseline)
              );
              const target =
                item.targets &&
                Math.abs(
                  Number(item.targets[`project`]) - Number(item.baseline)
                );
              debugger;
              const progressValue =
                target > 0 && achieved > 0
                  ? ((achieved / target) * 100).toFixed(0)
                  : "-";

              return (
                <TableRow
                  className={classes.row}
                  onClick={() => redirect(`/indicators/${item.id}/show`)}
                >
                  <TableCell
                    style={{
                      borderLeft: item.is_read_only
                        ? "5px solid #d0d0d0"
                        : "5px solid green",
                    }}
                  >
                    {item.name}
                  </TableCell>
                  <TableCell style={{ width: "10%" }}>
                    {costFormatterCeil(item.baseline)}
                  </TableCell>
                  <TableCell style={{ width: "10%" }}>
                    {costFormatterCeil(item.targets[`project`])}
                  </TableCell>
                  <TableCell style={{ width: "13%" }}>
                    {costFormatterCeil(progressValue)}
                  </TableCell>
                  <TableCell style={{ width: "15%", verticalAlign: "middle" }}>
                    <div style={{ display: "flex" }}>
                      <IndicatorsButton
                        {...props}
                        record={item}
                        isEdit
                        referencedOptions={referencedOptions}
                        details={props.record}
                        isReadOly={item.is_read_only}
                      />
                      {!item.is_read_only &&
                        checkPermissions("delete_indicator") && (
                          <DeleteButton
                            label={false}
                            basePath={"/indicators"}
                            record={item}
                            resource={"indicators"}
                            redirect={false}
                            undoable={false}
                            onSuccess={props.onRefresh}
                          />
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IndicatorList;

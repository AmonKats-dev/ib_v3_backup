import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { DeleteButton } from "react-admin";
import { useCheckPermissions } from "../../../../helpers/checkPermission";
import { getFiscalYearValue } from "../../../../helpers/formatters";
import IndicatorsButton from "./IndicatorsButton";

export const IndicatorList = ({ indicators, ...props }) => {
  const checkPermissions = useCheckPermissions();
  const referencedOptions =
    (props.record && props.record[props.reference]) || [];

  if (indicators && indicators.length === 0) return <h3>No Sub-Indicators</h3>;

  return (
    <TableContainer style={{ overflow: "auto", marginBottom: 25 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {/* <TableCell>Disaggregation type</TableCell>
            <TableCell>Verification Means</TableCell>
            <TableCell>Frequency</TableCell>
            <TableCell>Format</TableCell>
            <TableCell>Unit</TableCell> */}
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
                  Number(item.targets["project"]) - Number(item.baseline)
                );

              const progressValue =
                target > 0 && achieved > 0
                  ? ((achieved / target) * 100).toFixed(0)
                  : "-";
              return (
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                  {/* <TableCell>{item.disaggregation_type?.name}</TableCell>

                  <TableCell>{item.verification_means}</TableCell>
                  <TableCell>{item.frequency?.name}</TableCell>
                  <TableCell>{item.format?.name}</TableCell>
                  <TableCell>{item.unit?.name}</TableCell> */}

                  <TableCell>{item.baseline}</TableCell>
                  <TableCell>
                    {item.targets && item.targets["project"]}
                  </TableCell>
                  <TableCell>{progressValue}</TableCell>

                  <TableCell style={{ verticalAlign: "middle" }}>
                    {!item.is_read_only && (
                      <div style={{ display: "flex" }}>
                        <IndicatorsButton
                          {...props}
                          record={item}
                          isEdit
                          referencedOptions={referencedOptions}
                          label="Edit"
                        />
                        {checkPermissions("delete_indicator") && (
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
                    )}
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

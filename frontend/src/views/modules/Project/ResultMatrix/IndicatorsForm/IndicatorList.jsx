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
import { DeleteButton } from "react-admin";
import IndicatorsButton from "./IndicatorsButton";
import { costFormatterCeil } from "../../../../../helpers";

export const IndicatorList = ({ indicators, details, ...props }) => {
  const referencedOptions =
    (props.record && props.record[props.reference]) || [];

  return (
    <TableContainer style={{ overflow: "auto", marginBottom: 25 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Baseline</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Verification Means</TableCell>
            {/* <TableCell>Frequency</TableCell> */}
            <TableCell>Format</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>KPI</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indicators &&
            indicators.map((item) =>
              !item ? null : (
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                  <TableCell style={{ width: "10%" }}>
                    {costFormatterCeil(item.baseline)}
                  </TableCell>
                  <TableCell style={{ width: "10%" }}>
                    {item.targets && costFormatterCeil(item.targets["project"])}
                  </TableCell>
                  <TableCell>{item.verification_means}</TableCell>
                  {/* <TableCell>{item.frequency?.name}</TableCell> */}
                  <TableCell>{item.format?.name}</TableCell>
                  <TableCell>{item.unit?.name}</TableCell>
                  <TableCell style={{ verticalAlign: "middle" }}>
                    {item.has_kpi && <CheckIcon />}
                  </TableCell>
                  <TableCell style={{ verticalAlign: "middle" }}>
                    <div style={{ display: "flex" }}>
                      <IndicatorsButton
                        {...props}
                        record={item}
                        isEdit
                        referencedOptions={referencedOptions}
                        details={details}
                      />
                      <DeleteButton
                        label={false}
                        basePath={"/indicators"}
                        record={item}
                        resource={"indicators"}
                        redirect={false}
                        undoable={false}
                        onSuccess={props.onRefresh}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IndicatorList;

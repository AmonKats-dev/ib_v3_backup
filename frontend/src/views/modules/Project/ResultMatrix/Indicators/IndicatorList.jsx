import React from "react";
import {
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@material-ui/core";
import lodash from "lodash";
import { getFiscalYearValue } from "../../../../../helpers/formatters";
import { checkFeature } from "../../../../../helpers/checkPermission";

export const IndicatorList = (props) => {
  if (!props.indicators || (props.indicators && props.indicators.length === 0))
    return null;

  return (
    <TableContainer
      style={{ overflow: "auto", marginBottom: 25, maxWidth: "960px" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Baseline</TableCell>
            {props.indicators &&
              lodash.first(props.indicators) &&
              lodash
                .keys(lodash.first(props.indicators).targets)
                .map((year) => (
                  <TableCell>
                    {getFiscalYearValue(year.slice(0, -1)).name}
                  </TableCell>
                ))}
            <TableCell>Verification Means</TableCell>
            {checkFeature("has_pimis_fields")
              ? [
                  <TableCell>Assumptions</TableCell>,
                  <TableCell>Risk Factors</TableCell>,
                ]
              : props.type !== "goals" && [
                  <TableCell>Assumptions</TableCell>,
                  <TableCell>Risk Factors</TableCell>,
                ]}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.indicators &&
            props.indicators.map((item) =>
              !item ? null : (
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.baseline}</TableCell>
                  {checkFeature("has_pimis_fields") ? (
                    <TableCell>{item.targets['project']}</TableCell>
                  ) : (
                    item.targets &&
                    lodash
                      .keys(item.targets)
                      .map((year) => (
                        <TableCell>{item.targets[year]}</TableCell>
                      ))
                  )}
                  {}
                  <TableCell>{item.verification_means}</TableCell>
                  {checkFeature("has_pimis_fields")
                    ? [
                        <TableCell>{item.assumptions}</TableCell>,
                        <TableCell>{item.risk_factors}</TableCell>,
                      ]
                    : props.type !== "goals" && [
                        <TableCell>{item.assumptions}</TableCell>,
                        <TableCell>{item.risk_factors}</TableCell>,
                      ]}
                </TableRow>
              )
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IndicatorList;

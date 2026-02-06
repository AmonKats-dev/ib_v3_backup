import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { find, groupBy, sumBy, uniq, uniqBy } from "lodash";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { useDataProvider } from "react-admin";
import { costSumFormatter } from "../../../helpers";

const BpmsPopup = ({
  projectCode,
  fiscalYear,
  onClose,
  bpmsData,
  ...props
}) => {
  const [columnsAmountFundsPrevious, setColumnsAmountFundsPrevious] = useState(
    {}
  );
  const [columnsTotals, setColumnsTotals] = useState({});
  const [columns, setColumns] = useState([]);
  const [funds, setFunds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (bpmsData) {
      const grouped = groupBy(
        bpmsData?.filter((it) => it.costing),
        (it) => it.object_code_only
      );
      const groupedByFund = groupBy(
        bpmsData?.filter((it) => it.costing),
        (it) => it.fund_source_code
      );

      const groupedAmount = {};
      const groupedAmountPrevious = {};
      const groupedAmountByFundPrevious = {};

      Object.keys(grouped).forEach((objectCode) => {
        groupedAmountPrevious[objectCode] =
          sumBy(grouped[objectCode], "amount") - 0;

        groupedAmount[objectCode] = sumBy(grouped[objectCode], "amount");
      });

      Object.keys(groupedByFund).forEach((fundCode) => {
        groupedAmountByFundPrevious[fundCode] = {};

        Object.keys(grouped).forEach((objectCode) => {
          const objDataFund = grouped[objectCode].filter(
            (it) => it.fund_source_code === fundCode
          );

          groupedAmountByFundPrevious[fundCode][objectCode] =
            sumBy(objDataFund, "amount") - 0; //prevSum;
        });
      });

      const fundsData = {};
      Object.keys(groupedByFund).forEach((fudId) => {
        const data = groupedByFund[fudId][0];
        fundsData[fudId] = data.fund.name;
      });

      const totalData = {};
      Object.keys(grouped).forEach((objectCode) => {
        const sum = sumBy(grouped[objectCode], "amount");
        totalData[objectCode] = sum;
      });

      setColumnsAmountFundsPrevious(groupedAmountByFundPrevious);
      setColumns(uniq(Object.keys(grouped)));
      setColumnsTotals(totalData);
      setFunds(fundsData);
    }
  }, [bpmsData]);

  const getObjectName = (code) => {
    if (bpmsData && bpmsData.length > 0) {
      const selected = find(bpmsData, (it) => it.object_code_only === code);
      console.log(selected, "selected");
      return selected ? selected?.costing?.name : "-";
    }

    return "-";
  };

  const totalAll = sumBy(bpmsData, "amount");

  return (
    <Dialog fullWidth maxWidth={"lg"} open onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6" style={{ marginLeft: 20 }}>
          Budget Information
        </Typography>
      </DialogTitle>
      <DialogContent>
        {!isLoading && columns.length === 0 ? (
          <Typography variant="h3">
            No budget data for selected period
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fund / Object</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(columnsAmountFundsPrevious).map((fundId) => {
                  let totalFund = 0;

                  const objects = Object.keys(
                    columnsAmountFundsPrevious[fundId]
                  );

                  objects.forEach((it) => {
                    totalFund += columnsAmountFundsPrevious[fundId][it]
                      ? parseFloat(columnsAmountFundsPrevious[fundId][it] || 0)
                      : 0;
                  });

                  return [
                    <TableRow key={fundId}>
                      <TableCell
                        variant="head"
                        style={{ fontWeight: "bold" }}
                      >{`${fundId} - ${funds[fundId]}`}</TableCell>
                      <TableCell align="right" variant="head">
                        {costSumFormatter(totalFund)}
                      </TableCell>
                    </TableRow>,
                    objects?.map((objectCode) => (
                      <TableRow key={objectCode}>
                        <TableCell>{`${objectCode} - ${getObjectName(
                          objectCode
                        )}`}</TableCell>
                        <TableCell key={objectCode} align="right">
                          {costSumFormatter(
                            columnsAmountFundsPrevious[fundId][objectCode]
                          )}
                        </TableCell>
                      </TableRow>
                    )),
                  ];
                })}
                <TableRow>
                  <TableCell variant="head">Total</TableCell>
                  <TableCell variant="head" align="right">
                    {costSumFormatter(totalAll)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BpmsPopup;

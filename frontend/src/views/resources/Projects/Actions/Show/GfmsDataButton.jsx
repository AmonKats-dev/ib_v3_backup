import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Assignment from "@material-ui/icons/Assignment";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { find, groupBy, sumBy, uniq } from "lodash";
import numeral from "numeral";
import * as React from "react";
import { useState } from "react";
import { useDataProvider } from "react-admin";
import { checkFeature } from "../../../../../helpers/checkPermission";
// import { costSumFormatter, dateFormatter } from "../../../../../helpers";

const costSumFormatter = (value) => {
  if (!value) {
    return "-";
  }
  return typeof value !== "undefined" && value !== 0
    ? checkFeature("has_ibp_fields")
      ? numeral(value).format("0,0")
      : numeral(value).format("0,0.00") //remove all coins
    : "-";
};

const months = [
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
];

const GfmsDataButton = (props) => {
  const [project, setProject] = useState();
  const [data, setData] = useState();
  const [columnsAmountFundsPrevious, setColumnsAmountFundsPrevious] = useState(
    {}
  );
  const [columnsTotals, setColumnsTotals] = useState({});
  const [columns, setColumns] = useState([]);
  const [funds, setFunds] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [tableData, setTableData] = useState({});
  const [warrantData, setWarrantData] = useState([]);

  const dataProvider = useDataProvider();

  React.useEffect(() => {
    dataProvider
      .getListOfAll("cost-plans", {
        sort_field: "id",
        filter: {
          project_detail_id: props.data?.current_project_detail?.id, //227
          cost_plan_type: "MONTHLY",
          year: 2023,
          cost_plan_status: "SUBMITTED",
        },
      })
      .then((res) => {
        if (res?.data) {
          setWarrantData(res?.data);
        }
      });

    dataProvider
      .getIntegrationData("integrations/gfms", {
        filter: {
          project_coa_code: props.data.budget_code,
        },
      })
      .then((res) => {
        if (res?.data) {
          setData(res?.data);
          setIsLoading(false);
        }
      });
  }, [dataProvider, props.data]);

  React.useEffect(() => {
    if (data) {
      const grouped = groupBy(
        data?.filter((it) => it.costing),
        (it) => it.object_code_only
      );
      const groupedByFund = groupBy(
        data?.filter((it) => it.costing),
        (it) => it.fund_source_code
      );

      const groupedAmount = {};
      const groupedAmountPrevious = {};
      const groupedAmountByFundPrevious = {};
      const groupedAmountByFundMonth = {};

      Object.keys(grouped).forEach((objectCode) => {
        groupedAmountPrevious[objectCode] =
          sumBy(grouped[objectCode], "amount") - 0;

        groupedAmount[objectCode] = sumBy(grouped[objectCode], "amount");
      });

      Object.keys(groupedByFund).forEach((fundCode) => {
        groupedAmountByFundPrevious[fundCode] = {};
        groupedAmountByFundMonth[fundCode] = {};

        Object.keys(grouped).forEach((objectCode) => {
          const objDataFund = grouped[objectCode].filter(
            (it) => it.fund_source_code === fundCode
          );
          //   debugger;
          groupedAmountByFundPrevious[fundCode][objectCode] =
            sumBy(objDataFund, "amount") - 0; //prevSum;

          groupedAmountByFundMonth[fundCode][objectCode] = groupBy(
            objDataFund,
            "month"
          );

          Object.keys(groupedAmountByFundMonth[fundCode][objectCode]).forEach(
            (month) => {
              const data =
                groupedAmountByFundMonth[fundCode][objectCode][month];

              groupedAmountByFundMonth[fundCode][objectCode][month] = sumBy(
                data,
                "amount"
              );
            }
          );
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

      setTableData(groupedAmountByFundMonth);

      setColumnsAmountFundsPrevious(groupedAmountByFundPrevious);
      setColumns(uniq(Object.keys(grouped)));
      setColumnsTotals(totalData);
      setFunds(fundsData);
    }
  }, [data]);

  const getObjectName = (code) => {
    if (data && data.length > 0) {
      const selected = find(data, (it) => it.object_code_only === code);
      return selected ? selected?.costing?.name : "-";
    }

    return "-";
  };

  const getWarrantData = (month, year, fund, obj) => {
    // debugger;
    const monthData = find(warrantData, (it) => it.month === month.id);
    const items =
      (monthData?.cost_plan_items &&
        monthData?.cost_plan_items
          .filter((it) => {
            return it.fund?.code === fund;
          })
          .map((ite) => ite.cash_flow)) ||
      [];
    const result = {};
    items.forEach((it) => {
      Object.keys(it).forEach((ob) => {
        result[ob] = result[ob]
          ? result[ob] + parseFloat(it[ob] || 0)
          : parseFloat(it[ob] || 0);
      });
    });

    return result[`v${obj}`];
  };

  const [showDialog, setShowDialog] = React.useState(false);

  const togglePopup = () => {
    setShowDialog((prev) => !prev);
  };

  // if (!bpmsData || bpmsData?.length === 0) return null;

  return (
    <>
      <Button {...props} onClick={togglePopup} startIcon={<Assignment />}>
        GFMS Data
      </Button>
      {showDialog && (
        <Dialog
          fullWidth
          maxWidth={"lg"}
          open={showDialog}
          onClose={togglePopup}
          style={{ overflow: "hidden" }}
        >
          <DialogTitle
            disableTypography
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>GFMS Data</h2>
            <IconButton onClick={togglePopup}>
              <CloseOutlinedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {!isLoading && columns.length === 0 ? (
              <Typography variant="h3">No GFMS data available</Typography>
            ) : (
              <TableContainer style={{ overflow: "auto", marginBottom: 25 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell rowSpan={2} style={{ width: "300px" }}>
                        Fund / Object
                      </TableCell>
                      {months.map((item) => {
                        return (
                          <TableCell align="center" key={item.id} colSpan={2}>
                            {item.name}
                          </TableCell>
                        );
                      })}
                      {/* <TableCell align="right">Total</TableCell> */}
                    </TableRow>
                    <TableRow>
                      {months.map((item) => {
                        return (
                          <>
                            <TableCell align="right" style={{ width: "100px" }}>
                              Warrant Approved
                            </TableCell>
                            <TableCell align="right" style={{ width: "100px" }}>
                              Expenditure
                            </TableCell>
                          </>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(tableData).map((fundId) => {
                      let totalFund = 0;
                      // debugger;
                      const objects = Object.keys(tableData[fundId]);

                      objects.forEach((obj) => {
                        const monthss = Object.keys(tableData[fundId][obj]);

                        monthss.forEach((mnth) => {
                          totalFund += tableData[fundId][obj][mnth]
                            ? parseFloat(tableData[fundId][obj][mnth] || 0)
                            : 0;
                        });
                      });

                      return [
                        <TableRow key={fundId}>
                          <TableCell
                            colSpan={25}
                            variant="head"
                            style={{ fontWeight: "bold" }}
                          >{`${fundId} - ${funds[fundId]}`}</TableCell>
                        </TableRow>,

                        objects?.map((objectCode) => (
                          <TableRow key={objectCode}>
                            <TableCell
                              style={{ width: "300px" }}
                            >{`${objectCode} - ${getObjectName(
                              objectCode
                            )}`}</TableCell>

                            {months.map((item) => {
                              const wData = getWarrantData(
                                item,
                                2023,
                                fundId,
                                objectCode
                              );
                              return (
                                <>
                                  <TableCell
                                    align="right"
                                    key={item.id}
                                    style={{ width: "100px" }}
                                  >
                                    {costSumFormatter(wData)}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    key={item.id}
                                    style={{ width: "100px" }}
                                  >
                                    {costSumFormatter(
                                      tableData[fundId][objectCode][item.id]
                                    )}
                                  </TableCell>
                                </>
                              );
                            })}
                          </TableRow>
                        )),
                      ];
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GfmsDataButton;

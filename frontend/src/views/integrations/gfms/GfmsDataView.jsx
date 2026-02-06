import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { concat, find, groupBy, sumBy, uniq } from "lodash";
import React, { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";
import { costSumFormatter } from "../../../helpers";
import { useDispatch } from "react-redux";

const defaultData = [
  {
    id: 1,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 210799,
    object_code_only: "21",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 5,
    amount: 147202.0,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 210000,
      name: "COMPENSATION OF\nEMPLOYEES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 2,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 240203,
    object_code_only: "24",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 5,
    amount: 10624.0,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 240000,
      name: "UTILITIES AND\nCOMMUNICATION SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 3,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 250202,
    object_code_only: "25",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 5,
    amount: 3040.86,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 250000,
      name: "USE OF GOODS AND SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 4,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 250204,
    object_code_only: "25",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 4,
    amount: 821.88,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 250000,
      name: "USE OF GOODS AND SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 5,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 250303,
    object_code_only: "25",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 4,
    amount: 1710.0,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 250000,
      name: "USE OF GOODS AND SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 6,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 250402,
    object_code_only: "25",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 2,
    amount: 9583310.0,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 250000,
      name: "USE OF GOODS AND SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 7,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 250801,
    object_code_only: "25",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 3,
    amount: 6086.25,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 250000,
      name: "USE OF GOODS AND SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 8,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 250802,
    object_code_only: "25",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 3,
    amount: 5042.0,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 250000,
      name: "USE OF GOODS AND SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 9,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 250899,
    object_code_only: "25",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 3,
    amount: 234811.0,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 250000,
      name: "USE OF GOODS AND SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 10,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 251401,
    object_code_only: "25",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 4,
    amount: 9440440.0,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 250000,
      name: "USE OF GOODS AND SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
  {
    id: 11,
    project_coa_code: 29463,
    head_code: "20",
    object_code: 252104,
    object_code_only: "25",
    fund_source_code: "100",
    financial_pattern_code: "61",
    fiscal_year: "2023/24",
    month: 4,
    amount: 698838.0,
    integration_sync_id: 32,
    organization_id: 14,
    organization: {
      id: 14,
      code: "20",
      name: "Ministry of Finance and the Public Service",
      parent_id: null,
      management_id: null,
      parent: null,
      level: 1,
      is_hidden: false,
      management: null,
      additional_data: null,
    },
    costing: {
      code: 250000,
      name: "USE OF GOODS AND SERVICES",
    },
    fund: {
      code: "100",
      name: "Government of Jamaica",
    },
  },
];

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

const GfmsDataView = (props) => {
  const [project, setProject] = useState();
  const [data, setData] = useState();
  const [columnsAmountFundsPrevious, setColumnsAmountFundsPrevious] = useState(
    {}
  );
  const [columnsTotals, setColumnsTotals] = useState({});
  const [columns, setColumns] = useState([]);
  const [funds, setFunds] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [columnsAmount, setColumnsAmount] = useState({});

  const [tableData, setTableData] = useState({});
  const [warrantData, setWarrantData] = useState([]);

  const dataProvider = useDataProvider();
  const dispatch = useDispatch();

  useEffect(() => {
    if (project) {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: `${project?.name}`,
        },
      });
    }

    return () => {
      dispatch({
        type: "SET_PROJECT_TITLE_HEADER",
        payload: {
          data: "",
        },
      });
    };
  }, [dispatch, project]);

  useEffect(() => {
    const projectId = props.id || props.match?.params?.id;

    dataProvider.getOne("projects", { id: projectId }).then((response) => {
      if (response && response.data) {
        setProject(response.data);

        dataProvider
          .getListOfAll("cost-plans", {
            sort_field: "id",
            filter: {
              project_detail_id: response.data?.current_project_detail?.id,
              cost_plan_type: "MONTHLY",
              year: 2023,
              cost_plan_status: 'SUBMITTED'
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
              project_coa_code: response.data.budget_code,
            },
          })
          .then((res) => {
            if (res?.data) {
              setData(res?.data);
              //   setData(defaultData);
            }
          });
      }
    });
  }, [dataProvider, props.id, props.match.params.id]);

  useEffect(() => {
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

      console.log(groupedAmountByFundMonth, "groupedAmountByFundMonth");
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

      console.log(groupedAmountByFundPrevious, "groupedAmountByFundPrevious");

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

  const totalAll = sumBy(data, "amount");

  return (
    <Card>
      {!isLoading && columns.length === 0 ? (
        <Typography variant="h3">No GFMS data</Typography>
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
                {/* <TableCell align="right">Total</TableCell> */}
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

                  //   totalFund += tableData[fundId][it]
                  //     ? parseFloat(sumBy(tableData[fundId][it], "amount") || 0)
                  //     : 0;
                });

                return [
                  <TableRow key={fundId}>
                    <TableCell
                      colSpan={25}
                      variant="head"
                      style={{ fontWeight: "bold" }}
                    >{`${fundId} - ${funds[fundId]}`}</TableCell>

                    {/* <TableCell align="right" variant="head">
                      {costSumFormatter(totalFund)}
                    </TableCell> */}
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

                      {/* <TableCell key={objectCode} align="right">
                        {costSumFormatter(
                          columnsAmountFundsPrevious[fundId][objectCode]
                        )}
                      </TableCell> */}
                    </TableRow>
                  )),
                ];
              })}
              {/* <TableRow>
                <TableCell variant="head" colSpan={25}>
                  Total
                </TableCell> */}
              {/* {months.map((item) => {
                  return (
                    <>
                      <TableCell align="right" key={item.id}>
                        {tableData[fundId][objectCode][item.id]}
                      </TableCell>
                      <TableCell align="right" key={item.id}>
                        {tableData[fundId][objectCode][item.id]}
                      </TableCell>
                    </>
                  );
                })} */}
              {/* <TableCell variant="head" align="right">
                  {costSumFormatter(totalAll)}
                </TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
};

export default GfmsDataView;

import moment from "moment";
import React, { useEffect } from "react";
import {
  FormDataConsumer,
  SimpleForm,
  TextInput,
  Edit,
  number,
  Toolbar,
  Button,
  SaveButton,
  useNotify,
  useRedirect,
  useDataProvider,
  TopToolbar,
} from "react-admin";
import {
  commasFormatter,
  commasParser,
  costSumFormatter,
} from "../../../helpers";
import { FUND_BODY_TYPES } from "../../../constants/common";
import CustomToolbar from "../../components/CustomToolbar";

import { concat, find, findIndex, groupBy, sumBy, uniq, uniqBy } from "lodash";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { months } from "./constants";
import { TableContainer, Typography } from "@material-ui/core";
import { checkActivityInFiscalPeriod } from "./helpers";
import { setBreadCrumps } from "../../../actions/ui";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Preloader from "../../components/Preloader";
import { useCheckPermissions } from "../../../helpers/checkPermission";

const Actions = ({ onClose, ...props }) => {
  return (
    <TopToolbar
      style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}
    >
      <Button
        onClick={onClose}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
      />
    </TopToolbar>
  );
};

const FormToolbar = ({
  onSaveSuccess,
  onClose,
  projectId,
  disabled,
  ...props
}) => {
  return (
    <Toolbar style={{ width: "100%" }}>
      <Button
        onClick={onClose}
        label="Cancel"
        style={{ marginRight: 5, padding: "7px 15px" }}
        color="primary"
        variant="contained"
      />
      <SaveButton
        {...props}
        onSuccess={onSaveSuccess}
        disabled={props.invalid}
      />
    </Toolbar>
  );
};

const WorkPlansEditFormsMonthly = ({
  projectDetails,
  projectCode,
  year,
  month,
  onSave,
  onClose,
  totalItem,
  record,
  previousSubmittedSum,
  ...props
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [bpms, setBpms] = useState([]);
  const [columnsAmountFundsPrevious, setColumnsAmountFundsPrevious] = useState(
    {}
  );

  const checkPermissions = useCheckPermissions();
  const dataProvider = useDataProvider();
  const fiscalYear = `${year}/${String(year + 1).slice(-2)}`;

  useEffect(() => {
    if (projectCode && checkPermissions("list_bpms_data")) {
      setIsLoading(true);

      dataProvider
        .getIntegrationData("integrations/bpms", {
          filter: {
            project_coa_code: projectCode,
            fiscal_year: fiscalYear,
          },
        })
        .then((res) => {
          if (res?.data) {
            setBpms(res.data);
            const grouped = groupBy(
              res?.data?.filter((it) => it.costing),
              (it) => it.object_code_only
            );
            const groupedByFund = groupBy(
              res?.data?.filter((it) => it.costing),
              (it) => it.fund_source_code
            );

            const groupedAmount = {};
            const groupedAmountPrevious = {};
            const groupedAmountByFundPrevious = {};

            Object.keys(grouped).forEach((objectCode) => {
              groupedAmountPrevious[objectCode] =
                sumBy(grouped[objectCode], "amount") -
                (previousSubmittedSum[`v${objectCode}`] || 0);

              groupedAmount[objectCode] = sumBy(grouped[objectCode], "amount");
            });

            Object.keys(groupedByFund).forEach((fundCode) => {
              groupedAmountByFundPrevious[fundCode] = {};

              Object.keys(grouped).forEach((objectCode) => {
                const prevSum =
                  (previousSubmittedSum[fundCode] &&
                    previousSubmittedSum[fundCode][`v${objectCode}`]) ||
                  0;

                const objDataFund = grouped[objectCode].filter(
                  (it) => it.fund_source_code === fundCode
                );

                groupedAmountByFundPrevious[fundCode][objectCode] =
                  sumBy(objDataFund, "amount") - prevSum;
              });
            });

            setColumnsAmountFundsPrevious(groupedAmountByFundPrevious);
            setColumns(uniq(Object.keys(grouped)));
            setIsLoading(false);
          }
        });
    }
  }, [
    checkPermissions,
    dataProvider,
    fiscalYear,
    previousSubmittedSum,
    projectCode,
  ]);

  useEffect(() => {
    const getLinks = () => {
      switch (true) {
        case props.showWorkPlan:
          return { to: "/work_plan", title: "Projected Cash Flow" };
        case props.showWorkPlanApproved:
          return { to: "/work_plan_approved", title: "Approved Cash Flow" };
        case props.showWorkPlanAdjusted:
          return { to: "/work_plan_adjusted", title: "Adjusted Cash Flow" };
        case props.showWorkPlanMonthly:
          return {
            to: `/cost-plans-monthly/${projectDetails?.project_id}/show`,
            title: "Warrant Request",
            onClick: onClose,
          };
        default:
          break;
      }
    };

    if (!props.defaultBreadcrumbs) {
      dispatch(
        setBreadCrumps([{ ...getLinks() }, { to: "", title: "Details" }])
      );
    }
  }, []);

  if (!projectDetails) return null;

  const findObjectByCode = (code) => {
    if (!bpms) return "";
    const selected = find(
      bpms,
      (it) => Number(it.object_code_only) === Number(code)
    );

    return selected?.costing?.name || "";
  };

  const innvestments = uniq(
    concat(
      ...projectDetails.activities
        .filter((activity) => {
          const { start_date, end_date } = activity;
          return checkActivityInFiscalPeriod({ start_date, end_date, year });
        })
        .map((activity) =>
          activity.investments.map((item) => {
            const outputId = activity.output_ids && activity.output_ids[0];
            const output = find(
              projectDetails.outputs,
              (it) => it.id === outputId
            );
            const component = find(
              projectDetails.components,
              (it) => it.id === output.component_id
            );

            return {
              ...item,
              activity: activity,
              component_id: component?.id,
              component: component,
              output_id: outputId,
              output: output,
              fund_body_type: String(item.fund_body_type || 3),
            };
          })
        )
    )
  );

  const grFund = groupBy(
    innvestments,
    (it) =>
      `${it.fund.name} ${
        it.fund_body_type && Number(it.fund_body_type) < 3
          ? `(${FUND_BODY_TYPES[it.fund_body_type]})`
          : ""
      } `
  );

  const monthLabel = moment(record?.month, "MM").format("MMMM").toLowerCase();

  if (isLoading) return <Preloader />;

  return (
    <Edit {...props} undoable={false} actions={<Actions onClose={onClose} />}>
      <SimpleForm
        redirect={false}
        toolbar={
          <FormToolbar
            projectId={projectDetails?.project_id}
            onSaveSuccess={onSave}
            onClose={onClose}
            disabled={props.disabled}
          />
        }
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (formData) {
              formData.year = year; //moment().format("YYYY");
              formData.project_detail_id = projectDetails?.id;

              if (
                (formData && !formData.cost_plan_items) ||
                (formData.cost_plan_items &&
                  formData.cost_plan_items.length === 0)
              ) {
                formData.cost_plan_items = innvestments?.map((it) => ({
                  activity_id: it?.activity_id,
                  fund_code: String(it?.fund?.code),
                  fund_body_type: String(it?.fund_body_type),
                  fund_id: it?.fund_id,
                  cash_flow: {},
                }));
              }
            }
            const totalByColumn = (fund, col) => {
              if (formData) {
                const filtered = formData?.cost_plan_items?.filter(
                  (it) =>
                    String(it?.fund_code) === String(fund) ||
                    String(it?.fund?.code) === String(fund)
                );

                const sumCol = sumBy(
                  filtered,
                  (it) =>
                    it?.cash_flow && parseFloat(it?.cash_flow[`v${col}`] || 0)
                );
                return parseFloat(sumCol);
              }
              return 0;
            };

            return (
              <>
                <Typography
                  variant="h3"
                  style={{
                    textTransform: "capitalize",
                    marginBottom: 15,
                  }}
                >
                  {monthLabel}
                </Typography>
                {projectCode && columns?.length === 0 && (
                  <Typography
                    variant="h3"
                    style={{ textTransform: "capitalize", marginBottom: 15 }}
                  >
                    No BPMS data for selected period
                  </Typography>
                )}
                <TableContainer style={{ overflow: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: 150 }}></TableCell>
                        {columns?.map((col) => (
                          <TableCell key={col}>{`${col} - ${findObjectByCode(
                            col
                          )}`}</TableCell>
                        ))}
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Approved</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(grFund).map((fundId) => {
                        const grComp = groupBy(
                          grFund[fundId],
                          (it) => it?.component?.name
                        );

                        const compRow = Object.keys(grComp).map(
                          (compId, idx) => {
                            const element = grComp[compId];

                            const activity = element.map((item) => {
                              const actIdx = findIndex(
                                formData.cost_plan_items,
                                (it) =>
                                  it?.activity_id === item?.activity_id &&
                                  it?.fund_id === item?.fund_id &&
                                  it?.fund_body_type === item?.fund_body_type
                              );

                              const actTotalIdx = findIndex(
                                totalItem.cost_plan_items,
                                (it) =>
                                  it?.activity_id === item?.activity_id &&
                                  it?.fund_id === item?.fund_id &&
                                  it?.fund_body_type === item?.fund_body_type
                              );

                              const monthLabel = moment()
                                .month(record?.month - 1)
                                .format("MMMM")
                                .toLowerCase();

                              const totalValue =
                                totalItem?.cost_plan_items[actTotalIdx]
                                  ?.cash_flow[monthLabel] || 0;

                              const formValues =
                                formData?.cost_plan_items[actIdx]?.cash_flow;

                              let totalRow = 0;

                              if (formValues) {
                                Object.keys(formValues).forEach((key) => {
                                  totalRow += formValues[key]
                                    ? parseFloat(formValues[key])
                                    : 0;
                                });
                              }

                              return (
                                <TableRow>
                                  <TableCell
                                    style={{
                                      maxWidth: 300,
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                    }}
                                    title={item?.activity?.name}
                                  >
                                    {item.activity.name}
                                  </TableCell>
                                  {columns?.map((col) => (
                                    <TableCell key={col}>
                                      <TextInput
                                        source={`cost_plan_items[${actIdx}].cash_flow.v${col}`}
                                        label={false}
                                        variant="outlined"
                                        margin="none"
                                        format={commasFormatter}
                                        parse={commasParser}
                                        style={{ textAlign: "right" }}
                                        validate={[number()]}
                                        fullWidth
                                      />
                                    </TableCell>
                                  ))}
                                  <TableCell
                                    align="right"
                                    style={{
                                      color:
                                        totalRow > totalValue ? "red" : "black",
                                    }}
                                  >
                                    {costSumFormatter(totalRow)}
                                  </TableCell>
                                  <TableCell align="right">
                                    {costSumFormatter(totalValue)}
                                  </TableCell>
                                </TableRow>
                              );
                            });

                            const component = (
                              <TableRow>
                                <TableCell
                                  colSpan={columns.length + 3}
                                  variant="head"
                                >
                                  {`Component: ${compId}`}
                                </TableCell>
                              </TableRow>
                            );

                            return [component, activity];
                          }
                        );

                        const fundRow = (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length + 3}
                              variant="head"
                            >
                              Fund Source: {fundId}
                            </TableCell>
                          </TableRow>
                        );

                        const fundCode =
                          grFund[fundId] &&
                          grFund[fundId][0].fund &&
                          grFund[fundId][0].fund.code;

                        const bpmsRow = [
                          <TableRow>
                            <TableCell style={{ width: 150 }}>Total</TableCell>
                            {columns?.map((col) => {
                              return (
                                <TableCell key={col} align="right">
                                  {costSumFormatter(
                                    totalByColumn(fundCode, col)
                                  )}
                                </TableCell>
                              );
                            })}
                         <TableCell colSpan={2}></TableCell>
                          </TableRow>,
                          <TableRow>
                            <TableCell style={{ width: 150 }}>Budget</TableCell>
                            {columns?.map((col) => {
                              return (
                                <TableCell key={col} align="right">
                                  {fundCode &&
                                    columnsAmountFundsPrevious[fundCode] &&
                                    costSumFormatter(
                                      columnsAmountFundsPrevious[fundCode][col]
                                    )}
                                </TableCell>
                              );
                            })}
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>,
                          <TableRow>
                            <TableCell style={{ width: 150 }}>
                              Balance
                            </TableCell>
                            {columns?.map((col) => {
                              const balance = columnsAmountFundsPrevious[
                                fundCode
                              ]
                                ? parseFloat(
                                    columnsAmountFundsPrevious[fundCode][col]
                                  ) - totalByColumn(fundCode, col)
                                : 0;

                              return (
                                <TableCell key={col} align="right">
                                  <span
                                    style={{
                                      color: balance < 0 ? "red" : "inherit",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {columnsAmountFundsPrevious[fundCode] &&
                                      costSumFormatter(
                                        parseFloat(
                                          columnsAmountFundsPrevious[fundCode][
                                            col
                                          ]
                                        ) - totalByColumn(fundCode, col)
                                      )}
                                  </span>
                                </TableCell>
                              );
                            })}
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>,
                        ];

                        return [fundRow, compRow, bpmsRow];
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};

export default WorkPlansEditFormsMonthly;

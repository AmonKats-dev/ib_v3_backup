import { concat, find, findIndex, groupBy, uniq } from "lodash";
import React from "react";
import {
  Create,
  FormDataConsumer,
  number,
  required,
  SimpleForm,
  TextInput,
} from "react-admin";
import { commasFormatter, commasParser } from "../../../helpers";
import { FUND_BODY_TYPES } from "../../../constants/common";
import CustomToolbar from "../../components/CustomToolbar";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import { months } from "./constants";
import { TableContainer } from "@material-ui/core";

const WorkPlansCreate = ({ projectDetails, year, ...props }) => {
  if (!projectDetails) return null;

  const innvestments = uniq(
    concat(
      ...projectDetails.activities.map((activity) =>
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

  const yearss = uniq(
    concat(...innvestments.map((it) => Object.keys(it.costs || {})))
  );

  return (
    <Create {...props} undoable={false}>
      <SimpleForm
        redirect={() => '/cost-plans/96/show'}
        toolbar={<CustomToolbar projectDetailId={projectDetails?.id} />}
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
                  activity_id: it.activity_id,
                  fund_body_type: String(it.fund_body_type),
                  fund_id: it.fund_id,
                  cash_flow: {},
                }));
              }
            }

            return (
              <TableContainer style={{ overflow: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "200px" }}>
                        !Fund Source / Component / Activity
                      </TableCell>
                      {months.map((month) => {
                        const monthLabel = moment(month, "MM")
                          .format("MMMM")
                          .toLowerCase();

                        return (
                          <TableCell style={{ textTransform: "capitalize" }}>
                            {monthLabel}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(grFund).map((fundId) => {
                      const grComp = groupBy(
                        grFund[fundId],
                        (it) => it.component?.name
                      );
                      const fundTotal = {};

                      const compRow = Object.keys(grComp).map((compId, idx) => {
                        const element = grComp[compId];
                        const componentTotal = {};

                        const activity = element.map((item) => {
                          const actIdx = findIndex(
                            formData.cost_plan_items,
                            (it) =>
                              it.activity_id === item.activity_id &&
                              it.fund_id === item.fund_id &&
                              it.fund_body_type === item.fund_body_type
                          );

                          return (
                            <TableRow>
                              <TableCell> {item.activity.name}</TableCell>
                              {months.map((month) => {
                                const monthLabel = moment(month, "MM")
                                  .format("MMMM")
                                  .toLowerCase();

                                return (
                                  <TableCell>
                                    <TextInput
                                      source={`cost_plan_items[${actIdx}].cash_flow.${monthLabel}`}
                                      label={false}
                                      variant="outlined"
                                      margin="none"
                                      format={commasFormatter}
                                      parse={commasParser}
                                      style={{ width: 120 }}
                                      validate={[required(), number()]}
                                    />
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        });

                        const component = (
                          <TableRow>
                            <TableCell colSpan={months.length - 1}>
                              {`Component: ${compId}`}
                            </TableCell>
                            {yearss.map((year) => {
                              return (
                                <TableCell>{componentTotal[year]}</TableCell>
                              );
                            })}
                          </TableRow>
                        );

                        return [component, activity];
                      });

                      const fundRow = (
                        <TableRow>
                          <TableCell colSpan={months.length - 1}>
                            Fund Source: {fundId}
                          </TableCell>
                          {yearss.map((year) => {
                            return <TableCell>{fundTotal[year]}</TableCell>;
                          })}
                        </TableRow>
                      );

                      return [fundRow, compRow];
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
};

export default WorkPlansCreate;

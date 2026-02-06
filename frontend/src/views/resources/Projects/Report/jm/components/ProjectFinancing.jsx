import { ReferenceField, useDataProvider, useTranslate } from "react-admin";
import HTML2React from "html2react";
import React, { useEffect, useState } from "react";
import { romanize } from "../../../../../../helpers/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import lodash, { find, isArray } from "lodash";
import { checkFeature } from "../../../../../../helpers/checkPermission";
import { FUND_BODY_TYPES } from "../../../../../../constants/common";

export const ProjectFinancing = (props) => {
  const [funds, setFunds] = useState([]);
  const translate = useTranslate();
  const { customRecord, customBasePath, counter } = props;

  const dataProvider = useDataProvider();

  useEffect(() => {
    const filterIds =
      isArray(customRecord.proposed_funding_source) &&
      customRecord.proposed_funding_source.map((it) => it && Number(it.fund_id));
    if (filterIds)
      dataProvider
        .getListOfAll("funds", { filter: { ids: [...filterIds] } })
        .then((response) => {
          if (response && response.data) {
            setFunds(response.data);
          }
        });
  }, []);

  if (!customRecord) return null;

  function renderArray() {
    if (!customRecord.revenue_source) return null;

    if (lodash.isArray(customRecord.revenue_source)) {
      return customRecord.revenue_source
        .map((item) =>
          item && item === "other"
            ? customRecord.revenue_source_other + " (other)"
            : item
        )
        .join(", ");
    }

    return [customRecord.revenue_source]
      .map((item) =>
        item && item === "other"
          ? customRecord.revenue_source + " (other)"
          : item
      )
      .join(", ");
  }
  function renderSingle() {
    if (!customRecord.revenue_source) return null;

    return customRecord.revenue_source === "other"
      ? HTML2React(customRecord.revenue_source_other) + " (other)"
      : HTML2React(customRecord.revenue_source);
  }

  const getFund = (id) => {
    const selected = find(funds, (it) => Number(it.id) === Number(id));

    return selected ? selected.name : "-";
  };

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>
          {romanize(counter)}.{" "}
          {translate("printForm.project_info.project_financing")}
        </h2>

        <TableContainer>
          <Table size="small">
            <TableBody>
              {!customRecord.revenue_source ||
              customRecord.revenue_source.length === 0 ? null : (
                <TableRow>
                  <TableCell>
                    {translate("printForm.project_info.revenue_source")}
                  </TableCell>
                  {checkFeature("project_has_array_revenue_source") ? (
                    <TableCell>{renderArray()}</TableCell>
                  ) : null}
                  {checkFeature("project_has_revenue_source") ? (
                    <TableCell>{renderSingle()}</TableCell>
                  ) : null}
                </TableRow>
              )}

              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.procurement_modality")}
                </TableCell>
                <TableCell>
                  {customRecord.procurement_modality
                    ? customRecord.procurement_modality.join(", ")
                    : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.proposed_fund_source")}
                </TableCell>
                <TableCell>
                  {customRecord.proposed_funding_source &&
                  lodash.isArray(customRecord.proposed_funding_source)
                    ? customRecord.proposed_funding_source
                        .filter((it) => it)
                        .map(
                          (it) =>
                            it &&
                            `${getFund(it.fund_id)}(${
                              FUND_BODY_TYPES[it.fund_body_type]
                            })`
                        )
                        .join(", ")
                    : "Source of funding has not been identified"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.me_strategies")}
                </TableCell>
                <TableCell>{HTML2React(customRecord.me_strategies)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  {translate("printForm.project_info.governance")}
                </TableCell>
                <TableCell>{HTML2React(customRecord.governance)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

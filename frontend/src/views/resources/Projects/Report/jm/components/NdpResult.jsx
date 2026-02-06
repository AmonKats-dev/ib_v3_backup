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
import lodash from "lodash";

export const NdpResult = (props) => {
  const [goals, setGoals] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [sdgs, setSdgs] = useState([]);
  const [mtfs, setMtfs] = useState([]);
  const { customRecord } = props;
  const translate = useTranslate();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getListOfAll("ndp-goals", {}).then((response) => {
      if (response && response.data) {
        setGoals(response.data);
      }
    });
    dataProvider.getListOfAll("ndp-outcomes", {}).then((response) => {
      if (response && response.data) {
        setOutcomes(response.data);
      }
    });
    dataProvider.getListOfAll("ndp-strategies", {}).then((response) => {
      if (response && response.data) {
        setStrategies(response.data);
      }
    });
    dataProvider.getListOfAll("ndp-sdgs", {}).then((response) => {
      if (response && response.data) {
        setSdgs(response.data);
      }
    });
    dataProvider.getListOfAll("ndp-mtfs", {}).then((response) => {
      if (response && response.data) {
        setMtfs(response.data);
      }
    });
  }, []);

  const getDataResource = (type, id) => {
    const selected =
      type && lodash.find(type, (it) => Number(it.id) === Number(id));

    return selected ? selected.name : "-";
  };

  const getArrayDataResource = (type, ids) => {
    const filtered = lodash.filter(type, (item) => ids?.includes(item.id));
    return filtered ? filtered.map((item) => item?.name) : ["-"];
  };

  const counter = props.counter || 1;

  if (!customRecord) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{romanize(counter)}. Strategic Objectives</h2>
        <br />
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow className="filled-row">
                <TableCell>{translate("printForm.ndp.ndp_goal")}</TableCell>
                <TableCell>{translate("printForm.ndp.ndp_outcome")}</TableCell>
                <TableCell>{translate("printForm.ndp.ndp_sdg")}</TableCell>
                <TableCell>{translate("printForm.ndp.ndp_strategy")}</TableCell>
                <TableCell>{translate("printForm.ndp.ndp_mtf")}</TableCell>
              </TableRow>
              {customRecord.ndp_strategies &&
                customRecord.ndp_strategies.length !== 0 &&
                customRecord.ndp_strategies.map(
                  (item) =>
                    item && (
                      <TableRow>
                        <TableCell style={{ width: "30%" }}>
                          {getDataResource(goals, item.ndp_goal_id)}
                        </TableCell>
                        <TableCell style={{ width: "30%" }}>
                          {getDataResource(outcomes, item.ndp_outcome_id)}
                        </TableCell>
                        <TableCell style={{ width: "30%" }}>
                          {getArrayDataResource(sdgs, item.ndp_sdgs_ids).map(
                            (item) => (
                              <p style={{ marginTop: 0 }}>{item}</p>
                            )
                          )}
                        </TableCell>
                        <TableCell style={{ width: "30%" }}>
                          {getArrayDataResource(strategies, item.ndp_strategy_ids)}
                        </TableCell>
                        <TableCell style={{ width: "30%" }}>
                          {getArrayDataResource(mtfs, item.ndp_mtfs_ids).map(
                            (item) => (
                              <p style={{ marginTop: 0 }}>{item}</p>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    )
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <TableContainer>
          <Table size="small">
            <TableBody>
              {/* <TableRow>
                <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                  {translate("printForm.ndp.ndp_sustainable_goals")}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.ndp_sustainable_goals)}
                </TableCell>
              </TableRow> */}
              <TableRow>
                <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                  {translate("printForm.ndp.ndp_policy_alignment")}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.ndp_policy_alignment)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                  {translate("printForm.ndp.ndp_compliance")}
                </TableCell>
                <TableCell>{HTML2React(customRecord.ndp_compliance)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

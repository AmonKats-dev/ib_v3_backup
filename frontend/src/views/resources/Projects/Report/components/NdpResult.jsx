import { ReferenceField, useDataProvider, useTranslate } from "react-admin";
import HTML2React from "html2react";
import React, { useEffect, useState } from "react";
import { romanize } from "../../../../../helpers/formatters";
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
  }, []);

  const getDataResource = (type, id) => {
    const selected =
      type && lodash.find(type, (it) => Number(it.id) === Number(id));

    return selected ? selected.name : null;
  };

  const counter = props.counter || 1;

  if (!customRecord) return null;

  return (
    <div className="Section2">
      <div className="content-area">
        <h2>{romanize(counter)}. Strategic Objectives</h2>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell style={{ width: "30%", fontWeight: "bold" }}>
                  {translate("printForm.ndp.ndp_sustainable_goals")}
                </TableCell>
                <TableCell>
                  {HTML2React(customRecord.ndp_sustainable_goals)}
                </TableCell>
              </TableRow>
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
        <br />
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Goal</TableCell>
                <TableCell>Outcome</TableCell>
                <TableCell>Strategy</TableCell>
              </TableRow>
              {customRecord.ndp_strategies &&
                customRecord.ndp_strategies.length !== 0 &&
                customRecord.ndp_strategies.map((item) => (
                  <TableRow>
                    <TableCell style={{ width: "30%" }}>
                      {getDataResource(goals, item.ndp_goal_id)}
                    </TableCell>
                    <TableCell style={{ width: "30%" }}>
                      {getDataResource(outcomes, item.ndp_outcome_id)}
                    </TableCell>
                    <TableCell style={{ width: "30%" }}>
                      {getDataResource(strategies, item.ndp_strategy_id)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

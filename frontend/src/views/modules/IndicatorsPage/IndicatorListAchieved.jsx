import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import HistoryIcon from "@material-ui/icons/History";
import moment from "moment";
import React, { useState } from "react";
import { Button, useDataProvider } from "react-admin";

import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import { costFormatterCeil } from "../../../helpers";

const useStyles = makeStyles((theme) => ({
  row: {
    "& td": {
      verticalAlign: "middle",
    },
  },
}));

export const IndicatorListAchieved = ({
  indicators,
  indicatorsData,
  ...props
}) => {
  const classes = useStyles();

  const dataProvider = useDataProvider();
  const [isFetching, setIsFetching] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [indicatorHistory, setIndicatorHistory] = useState([]);

  if (indicators && indicators.length === 0) return null;

  const handleShowHistory = (id) => {
    setShowDialog(true);
    setIsFetching(true);

    dataProvider
      .getListOfAll("achieved-targets", {
        sort_field: "created_on",
        sort_order: "DESC",
        filter: { indicator_id: Number(id) },
      })
      .then((res) => {
        if (res && res.data) {
          setIndicatorHistory(res.data);
          setIsFetching(false);
        }
      });
  };

  return (
    <>
      <TableContainer style={{ overflow: "auto", marginBottom: 25 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {props.parent && (
                <TableCell style={{ textTransform: "capitalize" }}>
                  {props.type}
                </TableCell>
              )}
              <TableCell>Indicator</TableCell>
              <TableCell>Baseline</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Achieved Target</TableCell>
              <TableCell>Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {indicators &&
              indicators.map((item) =>
                !item ? null : (
                  <TableRow className={classes.row}>
                    {props.parent && (
                      <TableCell style={{ width: "25%" }}>
                        {props.parent}
                      </TableCell>
                    )}
                    <TableCell style={{ width: "25%" }}>{item.name}</TableCell>
                    <TableCell style={{ width: "10%" }}>
                      {costFormatterCeil(item.baseline)}
                    </TableCell>
                    <TableCell style={{ width: "10%" }}>
                      {item.targets &&
                        costFormatterCeil(item.targets[`project`])}
                    </TableCell>
                    <TableCell style={{ width: "250px" }}>
                      <TextField
                        InputProps={{
                          inputProps: {
                            min: 0,
                            style: { padding: "18.5px 5px 18.5px 14px" },
                          },
                        }}
                        type="number"
                        defaultValue={item.achieved_target?.indicator_progress}
                        name="achieved_target"
                        variant="outlined"
                        onChange={(ev) => {
                          props.onChange({
                            id: item.id,
                            value: ev.target.value,
                            comments:
                              indicatorsData?.comments ||
                              item.achieved_target?.comments,
                          });
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          width: "250px",
                        }}
                      >
                        <TextField
                          InputProps={{
                            inputProps: { max: 255 },
                          }}
                          defaultValue={item.achieved_target?.comments}
                          name="comments"
                          variant="outlined"
                          onChange={(ev) => {
                            props.onChange({
                              id: item.id,
                              comments: ev.target.value,
                              value:
                                indicatorsData?.value ||
                                item.achieved_target?.indicator_progress,
                            });
                          }}
                        />
                        <IconButton
                          onClick={() => handleShowHistory(item.id)}
                          title="Show History"
                        >
                          <HistoryIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>

      {showDialog && (
        <Dialog
          fullWidth
          maxWidth={"md"}
          open
          onClose={() => setShowDialog(false)}
          style={{ overflow: "hidden" }}
        >
          <DialogTitle>History of Achieved Targets</DialogTitle>
          <DialogContent>
            <TableContainer style={{ overflow: "auto", marginBottom: 25 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Target Progress</TableCell>
                    <TableCell>Comments</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {indicatorHistory &&
                    indicatorHistory.map((item) =>
                      !item ? null : (
                        <TableRow key={item.id}>
                          <TableCell>
                            {moment(item.created_on)
                              .format("DD.MM.YYYY HH:mm")
                              .toLocaleString()}
                          </TableCell>
                          <TableCell>{item.user?.full_name}</TableCell>
                          <TableCell>{item.indicator_progress}</TableCell>
                          <TableCell>{item.comments}</TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button label="Close" onClick={() => setShowDialog(false)} />
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default IndicatorListAchieved;

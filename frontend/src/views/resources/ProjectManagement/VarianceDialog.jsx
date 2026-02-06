import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import moment from "moment";
import React from "react";
import { Button } from "react-admin";

const VarianceDialog = ({ task, onClose, ...props }) => {
  const tasks = localStorage.getItem("task")
    ? JSON.parse(localStorage.getItem("task"))
    : task;

  const dateFormatter = (date) =>
    moment(date, "DD-MM-YYYY HH:mm").format("DD-MM-YYYY");

  return (
    <Dialog
      fullWidth
      maxWidth={"ld"}
      open
      onClose={onClose}
      style={{ overflow: "hidden" }}
    >
      <DialogTitle>Variance Estimation</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableCell style={{ width: "350px" }}>Activity/Task</TableCell>
              <TableCell style={{ width: "150px", textAlign: "center" }}>
                Panned Start Date
              </TableCell>
              <TableCell style={{ width: "150px", textAlign: "center" }}>
                Planned Finish Date
              </TableCell>
              <TableCell style={{ width: "150px", textAlign: "center" }}>
                Time Period Start Date
              </TableCell>
              <TableCell style={{ width: "150px", textAlign: "center" }}>
                Time Period Finish Date
              </TableCell>
              <TableCell style={{ width: "150px", textAlign: "center" }}>
                Variance Start Date
              </TableCell>
              <TableCell style={{ width: "150px", textAlign: "center" }}>
                Variance End Date
              </TableCell>
            </TableHead>
            <TableBody>
              {tasks
                ?.filter((item) => item && item.type === "task")
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell style={{ width: "350px", textAlign: "left" }}>
                      {item.text}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {dateFormatter(item.planned_start)}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {dateFormatter(item.planned_end)}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {dateFormatter(item.start_date)}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {dateFormatter(item.end_date)}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {moment(item.start_date, "DD-MM-YYYY HH:mm").diff(
                        moment(moment(item.planned_start, "DD-MM-YYYY HH:mm")),
                        "days"
                      )}
                    </TableCell>
                    <TableCell style={{ textAlign: "center" }}>
                      {moment(item.end_date, "DD-MM-YYYY HH:mm").diff(
                        moment(moment(item.planned_end, "DD-MM-YYYY HH:mm")),
                        "days"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose} label="Close"></Button>
      </DialogActions>
    </Dialog>
  );
};

export default VarianceDialog;

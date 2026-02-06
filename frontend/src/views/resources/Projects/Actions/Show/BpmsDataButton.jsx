import * as React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Assignment from "@material-ui/icons/Assignment";
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
} from "@material-ui/core";
import { useDataProvider, useTranslate } from "react-admin";
import { costSumFormatter, dateFormatter } from "../../../../../helpers";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

const BPMS_AMOUNT_FIELDS = [
  "amount",
];

const BPMS_REMOVE_FIELDS = ["id", "project_id"];

const BpmsDataButton = (props) => {
  const [bpmsData, setDpmsData] = React.useState();
  const [showDialog, setShowDialog] = React.useState(false);
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  React.useEffect(() => {
    if (props.data && !bpmsData) {
      dataProvider
        .integrations("bpms", {
          filter: { project_id: props.data.id },
        })
        .then((res) => {
          if (res && res.data) {
            setDpmsData(res.data);
          }
        });
    }
  }, [bpmsData, dataProvider]);

  const togglePopup = () => {
    setShowDialog((prev) => !prev);
  };

  if (!bpmsData || bpmsData?.length === 0) return null;

  return (
    <>
      <Button {...props} onClick={togglePopup} startIcon={<Assignment />}>
        BPMS Data
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
            <h2>BPMS Data</h2>
            <IconButton onClick={togglePopup}>
              <CloseOutlinedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {bpmsData && bpmsData.length === 0
                      ? null
                      : Object.keys(bpmsData[0]).map((col) => {
                          if (BPMS_REMOVE_FIELDS.includes(col)) return null;
                          return (
                            <TableCell>
                              {translate(`resources.integrations.bpms.${col}`)}
                            </TableCell>
                          );
                        })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bpmsData && bpmsData.length === 0
                    ? null
                    : bpmsData.map((row) => {
                        return (
                          <TableRow>
                            {Object.keys(row).map((col) => {
                              if (BPMS_REMOVE_FIELDS.includes(col)) return null;
                              if (BPMS_AMOUNT_FIELDS.includes(col)) {
                                return (
                                  <TableCell>
                                    {costSumFormatter(row[col])}
                                  </TableCell>
                                );
                              }
                              return <TableCell>{row[col]}</TableCell>;
                            })}
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BpmsDataButton;

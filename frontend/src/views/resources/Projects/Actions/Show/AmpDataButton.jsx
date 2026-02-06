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

const AMP_AMOUNT_FIELDS = [
  "actual_commitment_amount",
  "actual_disbursement_amount",
  "planned_commitment_amount",
];
const AMP_DATE_FIELDS = [
  "agreement_close_date",
  "agreement_effective_date",
  "agreement_sign_date",
  "donor_commitment_date",
];

const AMP_REMOVE_FIELDS = ["id", "integration_sync_id", "project_id"];

const AmpDataButton = (props) => {
  const [ampData, setAmpData] = React.useState();
  const [showDialog, setShowDialog] = React.useState(false);
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  React.useEffect(() => {
    if (props.data && !ampData) {
      dataProvider
        .integrations("amp", {
          filter: { project_id: props.data.id },
        })
        .then((res) => {
          if (res && res.data) {
            setAmpData(res.data);
          }
        });
    }
  }, [ampData, dataProvider]);

  const togglePopup = () => {
    setShowDialog((prev) => !prev);
  };

  if (!ampData) return null;

  return (
    <>
      <Button {...props} onClick={togglePopup} startIcon={<Assignment />}>
        AMP Data
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
            <h2>AMP Data</h2>
            <IconButton onClick={togglePopup}>
              <CloseOutlinedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {ampData && ampData.length
                      ? Object.keys(ampData[0]).map((col) => {
                          if (AMP_REMOVE_FIELDS.includes(col)) return null;
                          return (
                            <TableCell>
                              {translate(`resources.integrations.amp.${col}`)}
                            </TableCell>
                          );
                        })
                      : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ampData && ampData.length
                    ? ampData.map((row) => {
                        return (
                          <TableRow>
                            {Object.keys(row).map((col) => {
                              if (AMP_REMOVE_FIELDS.includes(col)) return null;
                              if (AMP_AMOUNT_FIELDS.includes(col)) {
                                return (
                                  <TableCell>
                                    {costSumFormatter(row[col])}
                                  </TableCell>
                                );
                              }
                              if (AMP_DATE_FIELDS.includes(col)) {
                                return (
                                  <TableCell>
                                    {dateFormatter(row[col])}
                                  </TableCell>
                                );
                              }
                              return <TableCell>{row[col]}</TableCell>;
                            })}
                          </TableRow>
                        );
                      })
                    : "No data"}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AmpDataButton;

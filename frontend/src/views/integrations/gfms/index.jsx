import {
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import {
  costSumFormatter,
  dateFormatter,
  getCurrentFiscalYear,
} from "../../../helpers";

import { useDataProvider, useTranslate } from "react-admin";
import IntegrationFileUploader from "../../components/IntegrationFileUploader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Select, MenuItem } from "@material-ui/core";
import moment from "moment";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";
import { useEffect } from "react";
// import { getCurrentFiscalYear } from "../../../helpers";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { find } from "lodash";

const months = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

const currentFiscalYear = getCurrentFiscalYear();
const currentYearName = getFiscalYearValueFromYear(currentFiscalYear);

const years = [];

for (let index = 0; index < 5; index++) {
  const year = getFiscalYearValueFromYear(currentFiscalYear - index);
  years.push({ id: moment(year.id).format("YYYY"), name: year.name });
}

const MonthSelect = ({ onChange, value, items }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      label="Select Month"
      placeholder="Month"
    >
      {items.map((month) => (
        <MenuItem key={month.id} value={month.id}>
          {month.name}
        </MenuItem>
      ))}
    </Select>
  );
};

const UploadDialog = ({ orgData, onUpload, onClose, selectedMonth }) => {
  // const [year, serYear] = useState(selectedYear || currentFiscalYear);
  // const [month, setMonth] = useState(moment().month() + 1);
  const translate = useTranslate();

  const handleFileUpload = (uploaded) => {
    onUpload(uploaded);
  };

  return (
    <Dialog open maxWidth="lg">
      <DialogTitle>Upload integration GFMS file</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: 30,
          width: "450px",
        }}
      >
        {orgData.hasData && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 30,
            }}
          >
            <ErrorOutlineIcon style={{ fontSize: 24, color: "red" }} />
            <Typography
              variant="h4"
              style={{ color: "red", fontWeight: "bold" }}
            >
              Your action will overwrite existing data!
            </Typography>
          </div>
        )}
        <Typography variant="h5">
          {`Current Fiscal Year: ${currentYearName.name}`}{" "}
        </Typography>
        <br />
        <Typography variant="h5">
          {`Current Month: ${find(months, (m) => m.id === selectedMonth).name}`}{" "}
        </Typography>
        <br />

        <IntegrationFileUploader
          placeholder={translate("titles.drop_files")}
          onFileUpload={handleFileUpload}
          approvedUploading
          resource="gfms"
          params={{
            fiscal_year: getFiscalYearValueFromYear(
              currentFiscalYear
            ).name.replace("FY", ""),
            month: selectedMonth,
            organization_id: orgData.id,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const IntegrationsFms = () => {
  const [uploaded, setUploaded] = useState();
  const [year, setYear] = useState(currentFiscalYear);
  const [month, setMonth] = useState(moment().month() + 1);
  const [openUpload, setOpenUpload] = React.useState();
  const [data, setData] = React.useState();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getIntegrationData("integrations/gfms", {
        filter: {
          fiscal_year: getFiscalYearValueFromYear(year).name.replace("FY", ""),
          month,
        },
      })
      .then((res) => {
        if (res?.data) {
          setData(res?.data);
        }
      });
  }, [year, month]);

  const handleUpload = (uploadedData) => {
    dataProvider
      .getIntegrationData("integrations/gfms", {
        filter: {
          fiscal_year: getFiscalYearValueFromYear(year).name.replace("FY", ""),
          month,
        },
      })
      .then((res) => {
        setOpenUpload(false);
        if (res?.data) {
          setData(res?.data);
          setUploaded(uploadedData);
        }
      });
  };

  const handleClose = () => {
    setOpenUpload(false);
  };

  const renderContent = () => {
    let totalAmount = 0;

    return (
      <>
        <TableContainer style={{ overflow: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Head No & Title</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                Object.keys(data)
                  .sort((a, b) => Number(a) - Number(b))
                  .map((key) => {
                    const row = data[key];
                    totalAmount += parseFloat(row.amount);

                    return (
                      <TableRow
                        style={{
                          backgroundColor:
                            row.id === uploaded?.organization?.id
                              ? "#fff3c9"
                              : "inherit",
                        }}
                      >
                        <TableCell>{`${row.code} - ${row.name}`}</TableCell>
                        <TableCell align="right">
                          {costSumFormatter(row.amount)}
                        </TableCell>
                        <TableCell>
                          {Number(currentFiscalYear) === Number(year) && (
                            <CloudUploadIcon
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setOpenUpload({
                                  id: row.id,
                                  hasData: row.amount > 0,
                                })
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              <TableRow>
                <TableCell variant="head">Total</TableCell>
                <TableCell variant="head" align="right">
                  {costSumFormatter(totalAmount)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <Card style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 30,
        }}
      >
        <Typography variant="h5">
          Year:{" "}
          <MonthSelect
            onChange={(value) => setYear(value)}
            value={year}
            items={years}
          />
        </Typography>
        <Typography variant="h5">
          Month:{" "}
          <MonthSelect
            onChange={(value) => setMonth(value)}
            value={month}
            items={months}
          />
        </Typography>
      </div>
      {data && renderContent()}
      {openUpload && (
        <UploadDialog
          onUpload={handleUpload}
          orgData={openUpload}
          onClose={handleClose}
          selectedMonth={month}
        />
      )}
    </Card>
  );
};

export default IntegrationsFms;

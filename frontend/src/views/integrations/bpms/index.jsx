import { Card } from "@material-ui/core";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { costSumFormatter, dateFormatter } from "../../../helpers";

import { useTranslate } from "react-admin";
import IntegrationFileUploader from "../../components/IntegrationFileUploader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

const IntegrationsBpms = () => {
  const [uploaded, setUploaded] = useState(false);
  const translate = useTranslate();
  const [bpmsData, setDpmsData] = React.useState();

  const handleFileUpload = (uploaded) => {
    setUploaded(true);
    setDpmsData(uploaded);
  };

  const renderContent = () => {
    let totalAmount = 0;

    return (
      <>
        <h2>BPMS Data</h2>
        <TableContainer style={{ overflow: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Head No & Title</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bpmsData &&
                Object.keys(bpmsData)
                  .sort((a, b) => Number(a) - Number(b))
                  .map((key) => {
                    const row = bpmsData[key];
                    totalAmount += parseFloat(row.amount);

                    return (
                      <TableRow>
                        <TableCell>{`${row.code} - ${row.name}`}</TableCell>
                        <TableCell>{costSumFormatter(row.amount)}</TableCell>
                      </TableRow>
                    );
                  })}
              <TableRow>
                <TableCell variant="head">Total</TableCell>
                <TableCell variant="head">
                  {costSumFormatter(totalAmount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <Card style={{ padding: "30px" }}>
      <h2>Upload integration BPMS file</h2>
      <br />
      <h3>1. Attach file downloaded file from BPMS platform</h3>
      <IntegrationFileUploader
        placeholder={translate("titles.drop_files")}
        onFileUpload={handleFileUpload}
        approvedUploading
        resource="bpms"
      />
      {uploaded && <h3>2. BPMS data was uploaded</h3>}
      <br />
      {uploaded && renderContent()}
    </Card>
  );
};

export default IntegrationsBpms;

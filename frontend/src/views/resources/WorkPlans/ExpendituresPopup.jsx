import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { groupBy } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import IntegrationFileUploader from "../../components/IntegrationFileUploader";
import { download_csv } from "../../pages/reports/ExportActions";

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

const ExpendituresPopup = ({
  fiscalYear,
  onClose,
  project,
  record,
  costPlans,
  onRefresh,
  ...props
}) => {
  // const [year, setYear] = useState(fiscalYear);
  const [month, setMonth] = useState(moment().month() + 1);
  const [approved, setApproved] = useState(true);
  const [uploadedInfo, setUploadedInfo] = useState();

  const dataProvider = useDataProvider();
  const translate = useTranslate();

  const handleUpload = (uploadedResponse) => {
    setUploadedInfo(uploadedResponse);

    dataProvider
      .getIntegrationData("integrations/expenditures", {
        filter: {
          fiscal_year: fiscalYear,
          project_id: project.id,
        },
      })
      .then((res) => {
        if (res?.data) {
          onRefresh(res?.data);
        }
      });
  };

  // const handleUploadStart = () => {
  //   setApproved(true);
  // };

  const handleGenerateTemplate = () => {
    var csv = ["FundSource,Activity,Amount"];

    const costItems = record?.cost_plan_items?.map((item) => {
      return {
        fund_code: item?.fund?.code,
        activity_code: item?.activity?.code,
      };
    });
    const grFunds = groupBy(costItems, "fund_code");

    Object.keys(grFunds).forEach((fundCode) => {
      grFunds[fundCode].forEach((item) => {
        csv.push(`${fundCode},="${item.activity_code}",`);
      });
    });

    download_csv(csv.join("\n"), "Expenditure Template");
  };

  return (
    <Dialog open maxWidth="lg">
      <DialogTitle>
        Upload Expenditures for selected Fiscal Year and Month
      </DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: 30,
          width: "450px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 30,
          }}
        >
          <Typography variant="h5">
            Month:{" "}
            <MonthSelect
              onChange={(value) => setMonth(value)}
              value={month}
              items={months}
            />
          </Typography>
        </div>

        <IntegrationFileUploader
          placeholder={translate("titles.drop_files")}
          onFileUpload={handleUpload}
          approvedUploading={approved}
          resource="expenditures"
          params={{
            fiscal_year: fiscalYear,
            month,
            project_id: project?.id,
            project_detail_id: project?.current_project_detail?.id,
          }}
        />

        {uploadedInfo && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              marginTop: "10px",
            }}
          >
            <Typography variant="h5">
              {`Total rows imported ${
                uploadedInfo.total_rows - uploadedInfo.error_rows.length
              }  out of  ${uploadedInfo.total_rows}.`}
            </Typography>
            {uploadedInfo.error_rows.length ? (
              <Typography
                variant="h5"
                style={{
                  color: "red",
                }}
              >
                {` Rows containing errors: ${uploadedInfo.error_rows.join(
                  ", "
                )}`}
              </Typography>
            ) : null}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleGenerateTemplate} variant="text" color="primary">
          Generate Template
        </Button>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpendituresPopup;

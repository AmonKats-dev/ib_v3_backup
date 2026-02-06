import { Card } from "@material-ui/core";
import React, { useState } from "react";
import { Button, useTranslate } from "react-admin";
import IntegrationFileUploader from "../../components/IntegrationFileUploader";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

const IntegrationsAmp = () => {
  const [uploaded, setUploaded] = useState(false);
  const translate = useTranslate();

  const handleFileUpload = (uploaded) => {
    setUploaded(true);
  };

  return (
    <Card style={{ padding: "30px" }}>
      <h2>Upload integration AMP file</h2>
      <br />
      <h3>
        1. Attach file downloaded file from AMP platform (
        <a download href="assets/templates/AMP.xlsx">
          Example
        </a>
        )
      </h3>
      <IntegrationFileUploader
        placeholder={translate("titles.drop_files")}
        onFileUpload={handleFileUpload}
        approvedUploading
        resource="amp"
      />
      {uploaded && (
        <h3>2. AMP data was uploaded, you can check now in project details </h3>
      )}
    </Card>
  );
};

export default IntegrationsAmp;

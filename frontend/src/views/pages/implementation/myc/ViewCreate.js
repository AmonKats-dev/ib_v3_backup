import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

const ViewCreate = ({ activeTab, handleTabChange }) => {
  return (
    <div className="ViewCreate">
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "white",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#ffd977", // Customize active tab indicator color
            },
            "& .MuiTab-root": {
              color: "#000", // Default color for all tabs
              "&.Mui-selected": {
                color: "#000", // Color for the selected tab
              },
            },
          }}
        >
          <Tab label="CONTRACTUAL OBLIGATIONS" />
          <Tab label="ARREARS" />
          <Tab label="PROCUREMENT" />
        </Tabs>
      </Box>
    </div>
  );
};

export default ViewCreate;

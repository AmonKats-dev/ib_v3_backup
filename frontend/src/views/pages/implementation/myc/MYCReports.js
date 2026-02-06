import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CreateIcon from "@mui/icons-material/Create";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const MYCReports = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shadowVisible, setShadowVisible] = useState(true);
  const tableContainerRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tableContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          tableContainerRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5; // Adjust threshold for precision
        setShadowVisible(!isAtEnd); // Remove shadow when Action column reaches its original position
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const buttonStyles = {
    position:"fix",
    padding: "5px 15px",
    backgroundColor: "rgb(255, 217, 151)",
    color: "black",
    "&:hover": {
      backgroundColor: "rgb(255, 217, 151)",
    },
    "&:active": {
      backgroundColor: "rgba(255, 217, 151, 0.7)",
    },
    transition: "background-color 0.2s ease",
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "/api/add_myc/multi_year_commitment"
        );
        setAllProjects(response.data);
        console.log(response.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Define the styles for the TableCell headers
  const tableHeaderStyle = {
    fontWeight: "bold",
    backgroundColor: "#3F51B5",
    color: "white",
  };

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  // 🔹 Export to Excel Function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allProjects);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MYC Reports");
    XLSX.writeFile(workbook, "MYC_Reports.xlsx");
  };

  // 🔹 Export to PDF Function
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a2", // Bigger page size to fit all columns
      compress: true,
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Multi-Year Commitment Reports", 14, 15);

    // Define table headers
    const tableColumn = [
      "Vote Code",
      "Vote Name",
      "Project Start Date",
      "Project Name",
      "Project End Date",
      "Project Code",
      "Project Classification",
      "Programme Name",
      "Programme Code",
      "Funding Source",
      "Contract Value",
      "Contract Status",
      "Contract Name",
      "Arrears",
    ];

    // Extract table rows
    const tableRows = allProjects.map((project) => [
      project.vote_code,
      project.vote_name,
      project.project_start_date,
      project.project_name,
      project.project_end_date,
      project.project_code,
      project.project_classification,
      project.programme_name,
      project.programme_code,
      project.funding_source,
      project.contract_value,
      project.contract_status,
      project.contract_name,
      project.arrears,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: "wrap" },
        1: { cellWidth: "wrap" },
        2: { cellWidth: "wrap" },
        3: { cellWidth: "wrap" },
        4: { cellWidth: "wrap" },
        5: { cellWidth: "wrap" },
        6: { cellWidth: "wrap" },
        7: { cellWidth: "wrap" },
        8: { cellWidth: "wrap" },
        9: { cellWidth: "wrap" },
        10: { cellWidth: "wrap" },
        11: { cellWidth: "wrap" },
        12: { cellWidth: "wrap" },
        13: { cellWidth: "wrap" },
      },
      margin: { top: 20, left: 5, right: 5, bottom: 5 },
      tableWidth: "auto",
      horizontalPageBreak: true,
    });

    doc.save("MYC_Reports.pdf");
  };

  return (
    <div>
      <Box
          sx={{
            display: "flex",
            gap: 2,
            marginBottom: 2,
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            onClick={handleDownloadClick}
            sx={{
              background: "none", // Remove background
              borderRadius: 0, // Remove circular border
              padding: 0, // Remove padding
            }}
            disabled={loading} // Disable when loading
          >
            <DownloadIcon
              sx={{
                color: "rgb(132, 131, 131)",
                border: "1px solid",
                borderRadius: "2px",
                marginRight: "2px",
              }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            {/* Download As Header */}
            <MenuItem disabled>
              <Typography variant="body2" sx={{ color: "rgb(60, 60, 60)" }}>
                Download As
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={exportToExcel}>Excel</MenuItem>
            <MenuItem onClick={exportToPDF}>PDF</MenuItem>
          </Menu>
        </Box>
      <Box sx={{ overflowX: "hidden", width: "100%" }}>
        <TableContainer
          component={Paper}
          elevation={0}
          variant="outlined"
          sx={{ maxHeight: 540, overflow: "auto", position: "relative" }}
          ref={tableContainerRef}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderStyle}>Vote Code</TableCell>
                <TableCell sx={tableHeaderStyle}>Vote Name</TableCell>
                <TableCell sx={tableHeaderStyle}>Project Start Date</TableCell>
                <TableCell sx={tableHeaderStyle}>Project Name</TableCell>
                <TableCell sx={tableHeaderStyle}>Project End Date</TableCell>
                <TableCell sx={tableHeaderStyle}>Project Code</TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Project Classification
                </TableCell>
                <TableCell sx={tableHeaderStyle}>Programme Name</TableCell>
                <TableCell sx={tableHeaderStyle}>Programme Code</TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Non contractual commitments
                </TableCell>
                <TableCell sx={tableHeaderStyle}>MTEF ceilings</TableCell>
                <TableCell sx={tableHeaderStyle}>FY 1 MYC</TableCell>
                <TableCell sx={tableHeaderStyle}>Funding Source</TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Counterpart Financing Plan
                </TableCell>
                <TableCell sx={tableHeaderStyle}>Currency</TableCell>
                <TableCell sx={tableHeaderStyle}>Counterpart Value</TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Counterpart requirement specification
                </TableCell>
                <TableCell sx={tableHeaderStyle}>Contract Value</TableCell>
                <TableCell sx={tableHeaderStyle}>Contract Terms</TableCell>
                <TableCell sx={tableHeaderStyle}>Contract Status</TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Contract Payment Plan
                </TableCell>
                <TableCell sx={tableHeaderStyle}>Contract End Date</TableCell>
                <TableCell sx={tableHeaderStyle}>Contract Start Date</TableCell>
                <TableCell sx={tableHeaderStyle}>Name of Contractor</TableCell>
                <TableCell sx={tableHeaderStyle}>Contract Name</TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Contract Implementation Plan
                </TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Contract Expenditures
                </TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Contract Reference Number
                </TableCell>
                <TableCell sx={tableHeaderStyle}>Arrears 6 months +</TableCell>
                <TableCell sx={tableHeaderStyle}>Arrears Payment</TableCell>
                <TableCell sx={tableHeaderStyle}>Unverified Arrears</TableCell>
                <TableCell sx={tableHeaderStyle}>Verified Arrears</TableCell>
                <TableCell sx={tableHeaderStyle}>Arrears</TableCell>
                <TableCell sx={tableHeaderStyle}>Approved Payments</TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Annual Appropriations
                </TableCell>
                <TableCell sx={tableHeaderStyle}>
                  Financing Agreement Title
                </TableCell>
                <TableCell
                  sx={{
                    ...tableHeaderStyle,
                    position: "sticky",
                    right: 0,
                    background: "#3F51B5",
                    zIndex: 2,
                    boxShadow: shadowVisible
                      ? "2px 1px 8px rgba(0, 0, 0, 0.1)"
                      : "none", // Light shadow initially
                    transition: "box-shadow 0.3s ease", // Smooth transition
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    <CircularProgress sx={{ color: "#772303" }} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {error}
                  </TableCell>
                </TableRow>
              ) : allProjects.length > 0 ? (
                allProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.vote_code}</TableCell>
                    <TableCell>{project.vote_name}</TableCell>
                    <TableCell>{project.project_start_date}</TableCell>
                    <TableCell>{project.project_name}</TableCell>
                    <TableCell>{project.project_end_date}</TableCell>
                    <TableCell>{project.project_code}</TableCell>
                    <TableCell>{project.project_classification}</TableCell>
                    <TableCell>{project.programme_name}</TableCell>
                    <TableCell>{project.programme_code}</TableCell>
                    <TableCell>{project.non_contractual_commitments}</TableCell>
                    <TableCell>{project.mtef_ceilings}</TableCell>
                    <TableCell>{project.fy_1_myc}</TableCell>
                    <TableCell>{project.funding_source}</TableCell>
                    <TableCell>{project.counterpart_financing_plan}</TableCell>
                    <TableCell>{project.currency}</TableCell>
                    <TableCell>{project.counterpart_value}</TableCell>
                    <TableCell>
                      {project.counterpart_requirement_specification}
                    </TableCell>
                    <TableCell>{project.contract_value}</TableCell>
                    <TableCell>{project.contract_terms}</TableCell>
                    <TableCell>{project.contract_status}</TableCell>
                    <TableCell>{project.contract_payment_plan}</TableCell>
                    <TableCell>{project.contract_end_date}</TableCell>
                    <TableCell>{project.contract_start_date}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{project.contract_name}</TableCell>
                    <TableCell>
                      {project.contract_implementation_plan}
                    </TableCell>
                    <TableCell>{project.contract_expenditures}</TableCell>
                    <TableCell>{project.contract_reference_number}</TableCell>
                    <TableCell>{project.arrears_6_months_plus}</TableCell>
                    <TableCell>{project.arrears_payment}</TableCell>
                    <TableCell>{project.unverified_arrears}</TableCell>
                    <TableCell>{project.verified_arrears}</TableCell>
                    <TableCell>{project.arrears}</TableCell>
                    <TableCell>{project.approved_payments}</TableCell>
                    <TableCell>{project.annual_appropriations}</TableCell>
                    <TableCell>{project.financing_agreement_title}</TableCell>
                    <TableCell
                      sx={{
                        position: "sticky",
                        right: 0,
                        background: "white",
                        zIndex: 1,
                        boxShadow: shadowVisible
                          ? "2px 1px 8px rgba(0, 0, 0, 0.1)"
                          : "none",
                        transition: "box-shadow 0.3s ease",
                      }}
                    >
                      <Link to={`/edit/${project.id}`}>
                        <Button
                          size="small"
                          sx={buttonStyles}
                          startIcon={<CreateIcon />}
                        >
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No projects available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default MYCReports;

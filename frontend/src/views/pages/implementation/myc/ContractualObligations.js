import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const ContractualObligations = ({ contractRefNumber }) => {
  return (
    <div>
      <TableContainer
        className="shadow-sm"
        component={Paper}
        sx={{ boxShadow: "none" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Contract Reference Number</TableCell>
              <TableCell sx={{ padding: 1, width: "15%" }}>
                Funding Source
              </TableCell>
              <TableCell sx={{ padding: 1, width: "25%" }}>
                Contract Value (UGX)
              </TableCell>
              <TableCell sx={{ padding: 1 }}>
                Approved contract payments ending undefined (UGX)
              </TableCell>
              <TableCell sx={{ padding: 1 }}>
                Balance on Contract Value (UGX)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ padding: 1, borderBottom: 0 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={contractRefNumber}
                  disabled
                  sx={{ backgroundColor: "#f4f4f4" }}
                  size="small"
                  aria-readonly
                />
              </TableCell>
              <TableCell align="right" sx={{ padding: 1, borderBottom: 0 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={"External"}
                  aria-readonly
                  disabled
                  sx={{ backgroundColor: "#f4f4f4" }}
                />
              </TableCell>
              <TableCell align="right" sx={{ padding: 1, borderBottom: 0 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  aria-readonly
                  disabled
                  sx={{ backgroundColor: "#f4f4f4" }}
                />
              </TableCell>
              <TableCell align="right" sx={{ padding: 1, borderBottom: 0 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  aria-readonly
                />
              </TableCell>
              <TableCell align="right" sx={{ padding: 1, borderBottom: 0 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  aria-readonly
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ padding: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  aria-readonly
                  disabled
                  value={contractRefNumber}
                  sx={{ backgroundColor: "#f4f4f4" }}
                />
              </TableCell>
              <TableCell align="right" sx={{ padding: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  aria-readonly
                  disabled
                  value={"GoU"}
                  sx={{ backgroundColor: "#f4f4f4" }}
                />
              </TableCell>
              <TableCell align="right" sx={{ padding: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  aria-readonly
                  disabled
                  sx={{ backgroundColor: "#f4f4f4" }}
                />
              </TableCell>
              <TableCell align="right" sx={{ padding: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  aria-readonly
                />
              </TableCell>
              <TableCell align="right" sx={{ padding: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  aria-readonly
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContractualObligations;

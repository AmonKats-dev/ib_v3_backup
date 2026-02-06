import React, { useState } from "react";
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
import ButtonMui from "../../../components/mui-component/ButtonMui";
import axios from "axios";

const Contractual = () => {
  const [formData, setFormData] = useState({
    financing_agreement_title: "",
    annual_appropriations: "",
    approved_payments: "",
    arrears: "",
    verified_arrears: "",
    unverified_arrears: "",
    arrears_payment: "",
    arrears_6_months_plus: "",
    contract_reference_number: "",
    contract_expenditures: "",
    contract_implementation_plan: "",
    contract_name: "",
    contractor_name: "",
    contract_start_date: "",
    contract_end_date: "",
    contract_payment_plan: "",
    contract_status: "",
    contract_terms: "",
    contract_value: "",
    counterpart_requirement_specification: "",
    counterpart_value: "",
    currency: "",
    counterpart_financing_plan: "",
    funding_source: "",
    fy_1_myc: "",
    mtef_ceilings: "",
    non_contractual_commitments: "",
    programme_code: "",
    programme_name: "",
    project_classification: "",
    project_code: "",
    project_end_date: "",
    project_name: "",
    project_start_date: "",
    vote_code: "",
    vote_name: "",
  });
  // State to hold errors for each field.
  const [errors, setErrors] = useState({});

  // Update state on input change and clear errors for the field.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Remove error when the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate that all fields are filled. Returns an object with errors.
  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    return newErrors;
  };

  // Submit form data via POST request.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      // If there are errors, do not submit and set error state.
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes.
    setErrors({});

    // Convert number fields appropriately.
    const payload = {
      ...formData,
      annual_appropriations: Number(formData.annual_appropriations),
      approved_payments: Number(formData.approved_payments),
      arrears: Number(formData.arrears),
      verified_arrears: Number(formData.verified_arrears),
      unverified_arrears: Number(formData.unverified_arrears),
      arrears_payment: Number(formData.arrears_payment),
      arrears_6_months_plus: Number(formData.arrears_6_months_plus),
      contract_expenditures: Number(formData.contract_expenditures),
      contract_value: Number(formData.contract_value),
      counterpart_value: Number(formData.counterpart_value),
      fy_1_myc: Number(formData.fy_1_myc),
      mtef_ceilings: Number(formData.mtef_ceilings),
    };

    try {
      const response = await axios.post(
        "https://farooqa.pythonanywhere.com/add_myc/multi_year_commitment",
        payload
      );
      console.log("Response:", response.data);
      // Optionally, clear the form or display a success message.
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="text-sm">
          <div className="p-4">
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
                      Contract Name
                    </TableCell>
                    <TableCell sx={{ padding: 1, width: "25%" }}>
                      Name of Contractor
                    </TableCell>
                    <TableCell sx={{ padding: 1 }}>
                      Contract Start Date (FY)
                    </TableCell>
                    <TableCell sx={{ padding: 1 }}>
                      Contract End Date (FY)
                    </TableCell>
                    <TableCell sx={{ padding: 1, width: "15%" }}>
                      Contract Value GOU (UGX)
                    </TableCell>
                    <TableCell sx={{ padding: 1, width: "15%" }}>
                      Source of Funding
                    </TableCell>
                    <TableCell sx={{ padding: 1, width: "10%" }}>
                      Annual Penalty Interest Rate (%)
                    </TableCell>
                    <TableCell sx={{ padding: 1 }}>Contract Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {/* Contract Reference Number */}
                    <TableCell sx={{ padding: 1 }}>
                      <TextField
                        name="contract_reference_number"
                        value={formData.contract_reference_number}
                        onChange={handleChange}
                        error={Boolean(errors.contract_reference_number)}
                        helperText={errors.contract_reference_number}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    {/* Contract Name */}
                    <TableCell align="right" sx={{ padding: 1 }}>
                      <TextField
                        name="contract_name"
                        value={formData.contract_name}
                        onChange={handleChange}
                        error={Boolean(errors.contract_name)}
                        helperText={errors.contract_name}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    {/* Name of Contractor */}
                    <TableCell align="right" sx={{ padding: 1 }}>
                      <TextField fullWidth variant="outlined" size="small" />
                    </TableCell>
                    {/* Contract Start Date */}
                    <TableCell align="right" sx={{ padding: 1 }}>
                      <Select
                        name="contract_start_date"
                        type="date"
                        value={formData.contract_start_date}
                        onChange={handleChange}
                        error={Boolean(errors.contract_start_date)}
                        helperText={errors.contract_start_date}
                        slotProps={{ inputLabel: { shrink: true } }}
                        size="small"
                        fullWidth
                        // defaultValue="FY2026/27"
                      >
                        <MenuItem value="FY2026/27">FY2026/27</MenuItem>
                        <MenuItem value="FY2025/26">FY2025/26</MenuItem>
                      </Select>
                    </TableCell>
                    {/* Contract End Date */}
                    <TableCell align="right" sx={{ padding: 1 }}>
                      <Select
                        name="contract_end_date"
                        type="date"
                        value={formData.contract_end_date}
                        onChange={handleChange}
                        error={Boolean(errors.contract_end_date)}
                        helperText={errors.contract_end_date}
                        slotProps={{ inputLabel: { shrink: true } }}
                        size="small"
                        fullWidth
                        defaultValue="FY2026/27"
                      >
                        <MenuItem value="FY2026/27">FY2026/27</MenuItem>
                        <MenuItem value="FY2025/26">FY2025/26</MenuItem>
                      </Select>
                    </TableCell>
                    {/* Contract Value GOU */}
                    <TableCell align="right" sx={{ padding: 1 }}>
                      <TextField
                        name="contract_value"
                        type="number"
                        value={formData.contract_value}
                        onChange={handleChange}
                        error={Boolean(errors.contract_value)}
                        helperText={errors.contract_value}
                        size="small"
                        fullWidth
                      />
                    </TableCell>
                    {/* Contract Value External */}
                    <TableCell align="right" sx={{ padding: 1 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        size="small"
                      />
                    </TableCell>
                    {/* Annual Penalty Interest Rate */}
                    <TableCell align="right" sx={{ padding: 1 }}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        size="small"
                      />
                    </TableCell>
                    {/* Contract Status */}
                    <TableCell align="right" sx={{ padding: 1 }}>
                      <Select
                        name="contract_status"
                        value={formData.contract_status}
                        onChange={handleChange}
                        error={Boolean(errors.contract_status)}
                        helperText={errors.contract_status}
                        size="small"
                        fullWidth
                        defaultValue="Ongoing"
                      >
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="flex border-b">
            <button
              className={`py-3 px-4 uppercase ${
                nestedTab === "obligation"
                  ? "border-b-2 border-[#ffd977]"
                  : "text-gray-500"
              }`}
              onClick={() => setNestedTab("obligation")}
            >
              Contractual Obligation
            </button>
            <button
              className={`py-3 px-4 uppercase ${
                nestedTab === "arrears"
                  ? "border-b-2 border-[#ffd977]"
                  : "text-gray-500"
              }`}
              onClick={() => setNestedTab("arrears")}
            >
              Arrears
            </button>
            <button
              className={`py-3 px-4 uppercase ${
                nestedTab === "procurement"
                  ? "border-b-2 border-[#ffd977]"
                  : "text-gray-500"
              }`}
              onClick={() => setNestedTab("procurement")}
            >
              Procurement
            </button>
          </div>
          <div>
            {nestedTab === "obligation" && (
              <div className="p-4">
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
                          Cumulative contract payments undefined (UGX)
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
                            disabled
                            sx={{ backgroundColor: "#f4f4f4" }}
                            size="small"
                            aria-readonly
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ padding: 1, borderBottom: 0 }}
                        >
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
                        <TableCell
                          align="right"
                          sx={{ padding: 1, borderBottom: 0 }}
                        >
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            aria-readonly
                            disabled
                            sx={{ backgroundColor: "#f4f4f4" }}
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ padding: 1, borderBottom: 0 }}
                        >
                          <TextField
                            name="approved_payments"
                            type="number"
                            value={formData.approved_payments}
                            onChange={handleChange}
                            error={Boolean(errors.approved_payments)}
                            helperText={errors.approved_payments}
                            size="small"
                            fullWidth
                            aria-readonly
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ padding: 1, borderBottom: 0 }}
                        >
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
            )}
            {nestedTab === "arrears" && (
              <div className="p-4">
                {" "}
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
                          Cumulative Arrears undefined (UGX)
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          Verified Arrears (UGX)
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          Un-verified Arrears (UGX)
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          Cumulative Arrears Penalty Exposure (UGX)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ padding: 1, borderBottom: 0 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            disabled
                            sx={{ backgroundColor: "#f4f4f4" }}
                            size="small"
                            aria-readonly
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ padding: 1, borderBottom: 0 }}
                        >
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
                        <TableCell
                          align="right"
                          sx={{ padding: 1, borderBottom: 0 }}
                        >
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            aria-readonly
                            disabled
                            sx={{ backgroundColor: "#f4f4f4" }}
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ padding: 1, borderBottom: 0 }}
                        >
                          <TextField
                            name="verified_arrears"
                            type="number"
                            value={formData.verified_arrears}
                            onChange={handleChange}
                            error={Boolean(errors.verified_arrears)}
                            helperText={errors.verified_arrears}
                            size="small"
                            fullWidth
                            aria-readonly
                          />
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ padding: 1, borderBottom: 0 }}
                        >
                          <TextField
                            name="unverified_arrears"
                            type="number"
                            value={formData.unverified_arrears}
                            onChange={handleChange}
                            error={Boolean(errors.unverified_arrears)}
                            helperText={errors.unverified_arrears}
                            size="small"
                            fullWidth
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
                      <TableRow>
                        <TableCell sx={{ padding: 1 }}>
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
            )}
            {nestedTab === "procurement" && (
              <div className="p-4">
                {" "}
                <TableContainer
                  className="shadow-sm"
                  component={Paper}
                  sx={{ boxShadow: "none" }}
                >
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Procurement Ref. No.</TableCell>
                        <TableCell sx={{ padding: 1, width: "15%" }}>
                          Description of Procurement
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "25%" }}>
                          Category of Procurement
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          Stage of Procurement
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          Estimated Contract Value (UGX)
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "15%" }}>
                          Source of Financing
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "15%" }}>
                          Estimated Commencement Date
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "10%" }}>
                          Estimated Contract End Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <Select size="small" fullWidth variant="outlined">
                            <MenuItem value="Works">Works</MenuItem>
                            <MenuItem value="Supplies">Supplies</MenuItem>
                            <MenuItem value="Consultancy">Consultancy Services</MenuItem>
                            <MenuItem value="Non-Consultancy-Services">
                              Non-Consultancy Services
                            </MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <Select size="small" fullWidth variant="outlined">
                            <MenuItem value="Initiations">Initiations</MenuItem>
                            <MenuItem value="Bidding">Bidding</MenuItem>
                            <MenuItem value="Evaluation">Evaluation</MenuItem>
                            <MenuItem value="Award and Contract Signing">
                              Award and Contract Signing
                            </MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <Select size="small" fullWidth variant="outlined">
                            <MenuItem value="Government of Uganda">
                              Government of Uganda
                            </MenuItem>
                            <MenuItem value="External Financing">
                              External Financing
                            </MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <Select size="small" fullWidth variant="outlined">
                            <MenuItem value="FY2026/27">FY2026/27</MenuItem>
                            <MenuItem value="FY2025/26">FY2025/26</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <Select size="small" fullWidth variant="outlined">
                            <MenuItem value="FY2026/27">FY2026/27</MenuItem>
                            <MenuItem value="FY2025/26">FY2025/26</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <h3 className="p-3">Annual Pipeline Procurement Cost</h3>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Estimated contract value (UGX)</TableCell>
                        <TableCell sx={{ padding: 1, width: "15%" }}>
                          FY2021/22 (UGX)
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "25%" }}>
                          FY2022/23 (UGX)
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          FY2023/24 (UGX)
                        </TableCell>
                        <TableCell sx={{ padding: 1 }}>
                          FY2024/25 (UGX)
                        </TableCell>
                        <TableCell sx={{ padding: 1, width: "15%" }}>
                          FY2025/26 (UGX)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ padding: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled
                            sx={{ backgroundColor: "#f4f4f4" }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ padding: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
          <div className="p-4">
            <ButtonMui type="submit">Submit</ButtonMui>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Contractual;
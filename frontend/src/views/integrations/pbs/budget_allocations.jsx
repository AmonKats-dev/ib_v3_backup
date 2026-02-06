import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";
import "./index.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

export default function ListPBSProjects(props) {
  const [pbsProjectsList, setPBSProjectsList] = useState(<LinearProgress />);
  const [fiscalYear, setFiscalYear] = useState("");
  const [budgetStage, setBudgetStage] = useState("");
  const [args, setArgs] = useState({});

  useEffect(() => {
    pbsProjects(args).then((response) => {
      let projects =
        response.data
          .cgIbpProjectBudgetAllocationByFiscalYearVCAndBOCProjectCode;
      if (projects && projects.length > 0) {
        setPBSProjectsList(
          <table className="pbs-data-table">
            <tr>
              <th>Vote_Name</th>
              <th>Programme_Name</th>
              <th>SubProgramme_Name</th>
              <th>Sub_SubProgramme_Name</th>
              <th>Project_Code</th>
              <th>Project_Name</th>
              <th>Budget_Output_Code</th>
              <th>Budget_Output_Description</th>
              <th>Item_Code</th>
              <th>Description</th>
              <th>GoU</th>
              <th>ExtFin</th>
              <th>AIA</th>
              <th>GoUArrears</th>
              <th>BudgetStage</th>
              <th>Fiscal_Year</th>
            </tr>
            {projects.map((project) => (
              <tr key={project.Project_Code} className="data-row">
                <td>{project.Vote_Name.replaceAll(",", "")}</td>
                <td>{project.Programme_Name.replaceAll(",", "")}</td>
                <td>{project.SubProgramme_Name.replaceAll(",", "")}</td>
                <td>{project.Sub_SubProgramme_Name.replaceAll(",", "")}</td>
                <td>{project.Project_Code}</td>
                <td>{project.Project_Name.replaceAll(",", "")}</td>
                <td>{project.Budget_Output_Code}</td>
                <td>{project.Budget_Output_Description.replaceAll(",", "")}</td>
                <td>{project.Item_Code}</td>
                <td>{project.Description.replaceAll(",", "")}</td>
                <td>{project.GoU}</td>
                <td>{project.ExtFin}</td>
                <td>{project.AIA}</td>
                <td>{project.GoUArrears}</td>
                <td>{project.BudgetStage}</td>
                <td>{project.Fiscal_Year}</td>
              </tr>
            ))}
          </table>
        );
      }
    });
  }, [args]);
  return (
    <div>
      <label className="pbs-projects-title">Budget Allocations</label>
      <div className="responses-options-div">
        <FormControl sx={{ marginRight: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-helper-label">
            Fiscal Year
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={fiscalYear}
            label="Fiscal Year"
            onChange={(e) => {
              setFiscalYear(e.target.value);
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"2000-2001"}>2000-2001</MenuItem>
            <MenuItem value={"2001-2002"}>2001-2002</MenuItem>
            <MenuItem value={"2002-2003"}>2002-2003</MenuItem>
            <MenuItem value={"2003-2004"}>2003-2004</MenuItem>
            <MenuItem value={"2004-2005"}>2004-2005</MenuItem>
            <MenuItem value={"2005-2006"}>2005-2006</MenuItem>
            <MenuItem value={"2006-2007"}>2006-2007</MenuItem>
            <MenuItem value={"2007-2008"}>2007-2008</MenuItem>
            <MenuItem value={"2008-2009"}>2008-2009</MenuItem>
            <MenuItem value={"2009-2010"}>2009-2010</MenuItem>
            <MenuItem value={"2010-2011"}>2010-2011</MenuItem>
            <MenuItem value={"2011-2012"}>2011-2012</MenuItem>
            <MenuItem value={"2012-2013"}>2012-2013</MenuItem>
            <MenuItem value={"2013-2014"}>2013-2014</MenuItem>
            <MenuItem value={"2014-2015"}>2014-2015</MenuItem>
            <MenuItem value={"2015-2016"}>2015-2016</MenuItem>
            <MenuItem value={"2016-2017"}>2016-2017</MenuItem>
            <MenuItem value={"2017-2018"}>2017-2018</MenuItem>
            <MenuItem value={"2018-2019"}>2018-2019</MenuItem>
            <MenuItem value={"2019-2020"}>2019-2020</MenuItem>
            <MenuItem value={"2020-2021"}>2020-2021</MenuItem>
            <MenuItem value={"2021-2022"}>2021-2022</MenuItem>
            <MenuItem value={"2022-2023"}>2022-2023</MenuItem>
            <MenuItem value={"2023-2024"}>2023-2024</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ marginRight: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-helper-label2">
            Budget Stage
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label2"
            id="demo-simple-select-helper2"
            value={budgetStage}
            label="Budget Stage"
            onChange={(e) => {
              setBudgetStage(e.target.value);
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"Draft Budget"}>Draft Budget</MenuItem>
            <MenuItem value={"Approved Budget"}>Approved Budget</MenuItem>
          </Select>
        </FormControl>
        <Button
          sx={{ marginLeft: 4, minWidth: 100, height: 55, cursor: "pointer" }}
          variant="outlined"
          onClick={() => {
            authenticatePBS().then((response) => {
              let token = response.data.login.access_token;
              setArgs({
                token: token,
                fiscalYear: fiscalYear,
                budgetStage: budgetStage,
              });
            });
          }}
        >
          Search
        </Button>
        <img
          className="download-img"
          src="excel-icon.png"
          alt="Download"
          onClick={() => {
            tableToCSV();
          }}
        />
      </div>
      <div className="table-div">{pbsProjectsList}</div>
    </div>
  );
}

async function pbsProjects(args) {
  const data = JSON.stringify({
    query: `
          query{
                cgIbpProjectBudgetAllocationByFiscalYearVCAndBOCProjectCode (BudgetStage:"${args.budgetStage}",Fiscal_Year:"${args.fiscalYear}",
            ){
                Vote_Code
                Vote_Name
                Programme_Code
                Programme_Name
                SubProgramme_Code
                SubProgramme_Name
                Sub_SubProgramme_Code
                Sub_SubProgramme_Name
                Project_Code
                Project_Name
                Budget_Output_Code
                Budget_Output_Description
                Item_Code
                Description
                GoU
                ExtFin
                AIA
                GoUArrears
                BudgetStage
                Fiscal_Year
            }
            }
        `,
  });

  const response = await fetch("https://pbsopenapi.finance.go.ug/graphql", {
    method: "post",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  return await response.json();
}

async function authenticatePBS() {
  const data = JSON.stringify({
    query: `
        mutation {
                login(
                    data: {
                    User_Name: "Nita"
                    Password: "Nita1290W"
                    ipAddress: "192.168.5.0"
                    }
                ) {
                    access_token
                    refresh_token
                }
            }
        `,
  });

  const response = await fetch("https://pbsopenapi.finance.go.ug/graphql", {
    method: "post",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

function tableToCSV() {
  let csv_data = [];
  let rows = document.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    let cols = rows[i].querySelectorAll("td,th");
    let csvrow = [];
    for (let j = 0; j < cols.length; j++) {
      csvrow.push(cols[j].innerHTML);
    }
    csv_data.push(csvrow.join(","));
  }
  csv_data = csv_data.join("\n");
  downloadCSVFile(csv_data);
}

function downloadCSVFile(csv_data) {
  let CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });

  let temp_link = document.createElement("a");

  temp_link.download = "Budget Allocations.csv";
  let url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  temp_link.click();
  document.body.removeChild(temp_link);
}

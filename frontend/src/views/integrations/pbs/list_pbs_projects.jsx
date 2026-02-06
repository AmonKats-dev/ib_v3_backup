import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";
import "./index.css";

export default function BudgetAllocations(props) {
  const [pbsProjectsList, setPBSProjectsList] = useState(<LinearProgress />);

  useEffect(() => {
    authenticatePBS().then((response) => {
      let token = response.data.login.access_token;
      pbsProjects(token).then((response) => {
        let projects = response.data.cgActiveIbpProjects;
        setPBSProjectsList(
          <table className="pbs-data-table">
            <tr>
              <th>Vote Code</th>
              <th>Vote Name</th>
              <th>Programme Code</th>
              <th>Programme Name</th>
              <th>Sub-Programme Code</th>
              <th>Sub-Programme Name</th>
              <th>Sub-SubProgramme Code</th>
              <th>Sub-SubProgramme Name</th>
              <th>Project Code</th>
              <th>Project Name</th>
              <th>Status</th>
            </tr>
            {projects.map((project) => (
              <tr key={project.Project_Code} className="data-row">
                <td key={`${project.Project_Code}-${project.Vote_Code}`}>
                  {project.Vote_Code}
                </td>
                <td>{project.Vote_Name.replaceAll(",", "")}</td>
                <td>{project.Programme_Code}</td>
                <td>{project.Programme_Name.replaceAll(",", "")}</td>
                <td>{project.SubProgramme_Code}</td>
                <td>{project.SubProgramme_Name.replaceAll(",", "")}</td>
                <td>{project.Sub_SubProgramme_Code}</td>
                <td>{project.Sub_SubProgramme_Name.replaceAll(",", "")}</td>
                <td>{project.Project_Code}</td>
                <td
                  className="data-row"
                  onClick={(e) => {
                    let projectCode = project.Project_Code;
                  }}
                >
                  {project.Project_Name}
                </td>
                <td>{project.Status}</td>
              </tr>
            ))}
          </table>
        );
      });
    });
  }, []);
  return (
    <div>
      <div className="responses-options-div">
        <label className="pbs-projects-title">PBS Projects</label>
        <label
          className="download-label"
          onClick={() => {
            tableToCSV();
          }}
        >
          Download
        </label>
      </div>
      {pbsProjectsList}
    </div>
  );
}

async function pbsProjects(token) {
  const data = JSON.stringify({
    query: `
        query {
                cgActiveIbpProjects {
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
                    Status
                }
            }
        `,
  });

  const response = await fetch("https://pbsopenapi.finance.go.ug/graphql", {
    method: "post",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

  temp_link.download = "PBS Projects.csv";
  let url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  temp_link.click();
  document.body.removeChild(temp_link);
}

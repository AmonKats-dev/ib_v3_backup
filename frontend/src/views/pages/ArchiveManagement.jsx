import React, { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import axios from "axios";
import { API_URL } from "../../constants/config";
import { TOKEN } from "../../constants/auth";
import { getdata } from "../../data/providers/archiveData";
import { LinearProgress } from "@mui/material";

export default function ArchiveManagement() {
  const [date, setDate] = useState(null);
  const [programme, setProgramme] = useState(null);
  const [media, setMedia] = useState(null);
  const [programmes, setProgrammes] = useState(<LinearProgress />);
  const [documentType, setDocumentType] = useState("minutes");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    getdata({ endpoint: "/programs" }).then((programmes) => {
      setProgrammes(
        <select
          className="archive-programs-dropdown-upload"
          onChange={(e) => {
            setProgramme(e.target.value);
          }}
          hidden={hidden}
        >
          <option key={"Select Programme"}>Select Programme</option>
          {programmes.map((option) => {
            return <option key={option.id}>{option.name}</option>;
          })}
        </select>
      );
    });
  }, [hidden]);

  return (
    <div className="archive-home">
      <div className="archive-management-component">
        <h2 className="archive-upload-title">Upload Document to the Archive</h2>
        <FormControl
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            width: "50%",
            fontSize: "12pt",
          }}
        >
          <FormLabel id="demo-row-radio-buttons-group-label">
            Document Type
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(e) => {
              let value = e.target.value;
              if (value === "minutes") {
                setHidden(false);
              } else {
                setHidden(true);
                setProgramme("Null");
              }

              setDocumentType(value);
            }}
            defaultValue={"minutes"}
          >
            <FormControlLabel
              value="minutes"
              control={<Radio on />}
              label="Minutes"
            />
            <FormControlLabel
              value="matrix"
              control={<Radio />}
              label="Decisions Matrix"
            />
          </RadioGroup>
        </FormControl>
        <input
          className="archive-date-input"
          type="date"
          name="Meeting Date"
          title="Date"
          required={true}
          onChange={(e) => {
            setDate(`${e.target.value}`);
            console.log(date);
          }}
        />
        {programmes}
        <input
          className="archive-file-picker"
          type="file"
          accept=".pdf"
          name="DC Minutes"
          required={true}
          onChange={(e) => {
            setMedia(e.target.files[0]);
          }}
        />
        <button
          className="archive-upload-button"
          type="submit"
          name="Upload File"
          onClick={() => {
            if (
              date == null ||
              programme == null ||
              media == null ||
              date.includes("dd") ||
              date.includes("mm") ||
              date.includes("yyyy")
            ) {
              alert(
                "Invalid input. Please input valid date, programme, and file in order to upload file."
              );
            } else {
              if (documentType === "minutes") {
                let document = {
                  dc_document: media,
                  programme: programme,
                  date: date,
                };

                uploadDCMinutes(document);
              } else if (documentType === "matrix") {
                let document = {
                  dc_document: media,
                  date: date,
                };

                uploadMatrix(document);
              }
            }
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

async function uploadDCMinutes(props) {
  getBase64(props.dc_document).then((data) => {
    console.log(props.dc_document);
    const url = `${API_URL}/dc_minutes`;
    const token = localStorage.getItem(TOKEN);
    const year = props.date.slice(0, 4);
    const config = {
      headers: {
        enctype: "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(
        url,
        {
          dc_minutes: data,
          title: props.dc_document.name,
          file_name: props.dc_document.name,
          programme: props.programme,
          minutes_date: props.date,
          year: year,
        },
        config
      )
      .then((response) => {
        alert(response.statusText);
        window.location.reload();
      });
  });
}

async function uploadMatrix(props) {
  getBase64(props.dc_document).then((data) => {
    console.log(props.dc_document);
    const url = `${API_URL}/dc_matrix`;
    const token = localStorage.getItem(TOKEN);
    const year = props.date.slice(0, 4);
    const config = {
      headers: {
        enctype: "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(
        url,
        {
          dc_matrix: data,
          title: props.dc_document.name,
          file_name: props.dc_document.name,
          matrix_date: props.date,
          year: year,
        },
        config
      )
      .then((response) => {
        alert(response.statusText);
        window.location.reload();
      });
  });
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

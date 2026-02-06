import React, { useState, useEffect } from "react";
import { API_URL } from "../../constants/config";
import { TOKEN } from "../../constants/auth";
import DCMinutes from "./DCMinutes";
import "./styles.css";
import { countBy } from "lodash";
import { getdata } from "../../data/providers/archiveData";
import { LinearProgress } from "@material-ui/core";

async function fetchMinutesFiles(url) {
  const token = localStorage.getItem(TOKEN);
  const options = {};
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }
  return await fetch(url, options);
}

export default function Archive() {
  const [programmes, setProgrammes] = useState(<LinearProgress />);
  const [downloads, setDownloads] = useState(null);
  const [programme, setProgramme] = useState(null);
  const [date, setDate] = useState(null);
  useEffect(() => {
    getdata({ endpoint: `/programs` }).then((programmes) => {
      console.log(programmes);
      setProgrammes(
        <select
          className="archive-programs-dropdown"
          onChange={(e) => {
            setProgramme(e.target.value);
          }}
        >
          <option key={"Select Programme"}>Select Programme</option>
          {programmes.map((option) => (
            <option key={option.id}>{option.name}</option>
          ))}
        </select>
      );
    });
  }, []);
  return (
    <div className="archive-page-div">
      <>
        <h1>DC Minutes</h1>
      </>
      <div className="archive-filter-div">
        {programmes}
        <input
          className="archive-date-picker"
          type="number"
          min={1960}
          placeholder="YYYY"
          onChange={(e) => {
            setDate(`${e.target.value}`);
          }}
        ></input>
        <button
          className="search-button"
          onClick={(e) => {
            if (programme != "Select Programme" && date) {
              fetchMinutesFiles(
                `${API_URL}/dc_minutes?filter=%7B%22year%22%3A%22${date}%22%2C%22programme%22%3A%22${programme.replace(
                  " ",
                  "%20".trim()
                )}%22%7D`
              )
                .then((response) => response)
                .then((data) => data.json())
                .then((results) => {
                  setDownloads(<DCMinutes files={results} />);
                })
                .catch((e) => console.log(e));
            } else {
              alert("Please choose valid Programme and Year in the filters");
            }
          }}
        >
          Search
        </button>
      </div>
      <div className="archive-table-div">{downloads}</div>
    </div>
  );
}

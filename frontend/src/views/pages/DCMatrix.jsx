import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";
import MatrixTable from "./MatrixTable";
import "./styles.css";
import { getdata } from "../../data/providers/archiveData";
import { API_URL } from "../../constants/config";

export default function DCMatrix(props) {
  const [table, setTable] = useState(<LinearProgress />);
  const [date, setDate] = useState(null);

  const handleOnSearch = () => {
    if (date === "" || date === null) {
      setTable(<>{"Select Year"}</>);
    } else {
      getdata({
        endpoint: `/get_matrix?filter=%7B%22year%22%3A%22${date}%22%7D`,
      }).then((response) => {
        setTable(<MatrixTable matrices={response} />);
      });
    }
  };

  return (
    <div className="matrix-home-div">
      <>
        <h1>DC Decision Matrices</h1>
      </>
      <div className="archive-filter-div">
        <input
          className="archive-date-picker"
          type="number"
          min={1960}
          placeholder="YYYY"
          id="date-picker"
          onChange={(e) => {
            setDate(e.target.value);
          }}
        ></input>
        <button className="search-button" onClick={handleOnSearch}>
          Search
        </button>
      </div>
      <div className="matrix-home-div">{table}</div>
    </div>
  );
}

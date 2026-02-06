import React from "react";
import HTML2React from "html2react";
import { useTranslate } from "react-admin";
import { romanize } from "../../../../helpers/formatters";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";

export const Challenges = (props) => {
  const { customRecord, counter = 1 } = props;
  const translate = useTranslate();
  if (!customRecord) return null;
  

  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)}. Challenges encountered and recommendations
        </h2>
        <div>{HTML2React(customRecord.challenges_recommendations)}</div>
      </div>
    </div>
  );
};

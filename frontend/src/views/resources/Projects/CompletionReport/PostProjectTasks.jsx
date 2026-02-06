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

export const PostProjectTasks = (props) => {
  const { customRecord, counter = 1 } = props;
  const translate = useTranslate();

  return (
    <div className="Section2">
      <div className="content-area">
        <h2 className="content-area_title">
          {romanize(counter)} Post-project tasks / future considerations
        </h2>
        <div>
          List any continuing development and operational objectives. What
          actions still need to be completed, and who is responsible for
          completing them? List any additional outstanding project activities?
        </div>
      </div>
    </div>
  );
};

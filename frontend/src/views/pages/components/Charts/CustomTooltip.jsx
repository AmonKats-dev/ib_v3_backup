import React, { PureComponent, useState } from "react";
import { billionsFormatter } from "../../../resources/Projects/Report/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #ccc', padding: "0px 15px"}}>
        <p style={{ marginBottom: 2}} >{`${label}`}</p>
        <p style={{ fontWeight: 'bold'}} >
          {billionsFormatter(parseFloat(payload[0].value))}
        </p>
        </div>
    );
  }

  return null;
};

export default CustomTooltip;

import React, { PureComponent, useState } from "react";
import { PROJECT_PHASES_COLORS } from "../../../../constants/common";
import lodash from "lodash";
import { LinearProgress, Typography } from "@material-ui/core";

export default function Blocks(props) {
  if (!props.data) return null;

  const totalCount = lodash.sumBy(props.data, (item) =>
    parseFloat(item.total_count)
  );

  return (
    <div>
      {props.data.map((entry, index) => {
        const progressValue = (entry.total_count * 100) / totalCount;

        return (
          <div
            key={entry.phase_name || `block-${index}`}
            style={{
              backgroundColor: PROJECT_PHASES_COLORS[index + 1],
              padding: 25,
              marginBottom: 15,
              border: "1px solid #c8ced3",
              borderRadius: 5,
              color: "#FFF",
            }}
          >
            <Typography
              variant="h3"
              style={{ marginBottom: 5, color: "#fff", fontWeight: "bold" }}
            >
              {entry.total_count}
            </Typography>
            <Typography
              style={{ marginBottom: 10, color: "#fff" }}
              variant="h5"
            >
              {entry.phase_name}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              color="secondary"
            />
          </div>
        );
      })}
    </div>
  );
}

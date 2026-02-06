import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { maxLength, required, TextInput } from "react-admin";

const IntermediaryTargets = ({ frequency, years, isEdit, data }) => {
  const renderContent = () => {
    if (frequency === 3) {
      return (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell>Target</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {years?.map((year, index) => (
                <TableRow>
                  <TableCell style={{ verticalAlign: "middle" }}>
                    {year.name}
                  </TableCell>
                  <TableCell style={{ verticalAlign: "middle" }}>
                    {isEdit ? (
                      <TextInput
                        validate={[required(), maxLength(255)]}
                        label={false}
                        source={`intermediary_targets.${String(year.id)}y..y${
                          index + 1
                        }`}
                        variant="outlined"
                        margin="none"
                      />
                    ) : (
                      <Typography>
                        {data[`${String(year.id)}y`][`y${index + 1}`]}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      );
    }
    if (frequency === 2) {
      return (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell>First Half Target</TableCell>
                <TableCell>Second Half Target</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {years?.map((year) => (
                <TableRow>
                  <TableCell style={{ verticalAlign: "middle" }}>
                    {year.name}
                  </TableCell>
                  <TableCell style={{ verticalAlign: "middle" }}>
                    {isEdit ? (
                      <TextInput
                        validate={[required(), maxLength(255)]}
                        label={false}
                        source={`intermediary_targets.${String(year.id)}y.h1`}
                        variant="outlined"
                        margin="none"
                      />
                    ) : (
                      <Typography>{data[`${String(year.id)}y`].h1}</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEdit ? (
                      <TextInput
                        validate={[required(), maxLength(255)]}
                        label={false}
                        source={`intermediary_targets.${String(year.id)}y.h2`}
                        variant="outlined"
                        margin="none"
                      />
                    ) : (
                      <Typography>{data[`${String(year.id)}y`].h2}</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      );
    }
    if (frequency === 1) {
      return (
        <>
          <Table>
            <TableBody>
              <TableBody>
                <TableRow>
                  <TableCell variant="head">Year</TableCell>
                  <TableCell variant="head">Q1 Target</TableCell>
                  <TableCell variant="head">Q2 Target</TableCell>
                  <TableCell variant="head">Q3 Target</TableCell>
                  <TableCell variant="head">Q4 Target</TableCell>
                </TableRow>

                {years?.map((year) => (
                  <TableRow>
                    <TableCell style={{ verticalAlign: "middle" }}>
                      {year.name}
                    </TableCell>
                    <TableCell style={{ verticalAlign: "middle" }}>
                      {isEdit ? (
                        <TextInput
                          validate={[required(), maxLength(255)]}
                          label={false}
                          source={`intermediary_targets.${String(year.id)}y.q1`}
                          variant="outlined"
                          margin="none"
                        />
                      ) : (
                        <Typography>
                          {data && data[`${String(year.id)}y`].q1}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ verticalAlign: "middle" }}>
                      {isEdit ? (
                        <TextInput
                          validate={[required(), maxLength(255)]}
                          label={false}
                          source={`intermediary_targets.${String(year.id)}y.q2`}
                          variant="outlined"
                          margin="none"
                        />
                      ) : (
                        <Typography>
                          {data && data[`${String(year.id)}y`].q2}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ verticalAlign: "middle" }}>
                      {isEdit ? (
                        <TextInput
                          validate={[required(), maxLength(255)]}
                          label={false}
                          source={`intermediary_targets.${String(year.id)}y.q3`}
                          variant="outlined"
                          margin="none"
                        />
                      ) : (
                        <Typography>
                          {data && data[`${String(year.id)}y`].q3}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell style={{ verticalAlign: "middle" }}>
                      {isEdit ? (
                        <TextInput
                          validate={[required(), maxLength(255)]}
                          label={false}
                          source={`intermediary_targets.${String(year.id)}y.q4`}
                          variant="outlined"
                          margin="none"
                        />
                      ) : (
                        <Typography>
                          {data && data[`${String(year.id)}y`].q4}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableBody>
          </Table>
        </>
      );
    }
  };

  return (
    <div>
      {" "}
      <Typography variant="h4" style={{ margin: "14px 0px" }}>
        Intermediary targets
      </Typography>
      <div>{renderContent()}</div>
    </div>
  );
};

export default IntermediaryTargets;

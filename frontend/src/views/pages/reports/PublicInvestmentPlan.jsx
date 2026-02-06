// in src/Dashboard.js
import { Grid, makeStyles, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import * as React from "react";
import { Button, useDataProvider, useTranslate } from "react-admin";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "bold",
    paddingLeft: "30px",
    margin: "10px auto",
  },
  filters: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "25px",
    gap: "25px",
  },
  actions: {
    width: "100%",
    padding: "25px",
    display: "flex",
    justifyContent: "flex-start",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const filterResources = ["programs", "organizations", "functions", "locations"];

function PublicInvestmentPlan(props) {
  const [resources, setResources] = React.useState({});
  const [selected, setSelected] = React.useState([]);
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    filterResources.forEach((resourceName) => {
      dataProvider
        .getListOfAll(resourceName, { filter: { level: 1 } })
        .then((res) => {
          if (res && res.data) {
            setResources((prev) => ({ ...prev, [resourceName]: res.data }));
          }
        });
    });
  }, [dataProvider]);

  const handleDownloadReport = () => {
    dataProvider
      .downloadPIPReport({ export_name: "PIP Report" })
      .then((res) => {
        console.log(res);
      });
  };

  const handleChange = (resourceName) => (event) => {
    setSelected((prev) => ({ ...prev, [resourceName]: event.target.value }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {translate(
            `resources.${props.location.pathname.slice(
              1,
              props.location.pathname.length
            )}.name`
          )}
        </Typography>
        <Card>
          <div className={classes.filters}>
            {/* {filterResources.map((resourceName) => {
              return resources && resources[resourceName] ? (
                <FormControl className={classes.formControl} variant="outlined">
                  <InputLabel style={{ textTransform: "capitalize" }}>
                    {resourceName}
                  </InputLabel>
                  <Select
                    multiple
                    value={selected[resourceName] || []}
                    onChange={handleChange(resourceName)}
                    MenuProps={MenuProps}
                    label={resourceName}
                  >
                    {resources &&
                      resources[resourceName].map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              ) : null;
            })} */}
            <div className={classes.actions}>
              <Button
                label="Download Report"
                onClick={handleDownloadReport}
                variant="contained"
                startIcon={<CloudDownloadIcon />}
                size="large"
              />
            </div>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
}

export default PublicInvestmentPlan;

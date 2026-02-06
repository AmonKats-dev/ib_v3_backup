import { useMediaQuery } from "@material-ui/core";
import {
  CreateButton,
  NumberField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  List,
  Datagrid,
  TextField,
  usePermissions,
  FunctionField,
  useRedirect,
  useShowController,
  useDataProvider,
  ShowButton,
} from "react-admin";
import lodash, { isArray } from "lodash";

import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CustomTreeView from "./CustomTreeView";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  title: {
    textAlign: "center",
    margin: "15px",
  },
}));

const RESOURCES = {
  organizations: "organizational_config",
  programs: "programs_config",
  functions: "functions_config",
  funds: "fund_config",
  costings: "cost_config",
  locations: "location_config",
};

export const OrganizationsShow = (props) => {
  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config } = appConfig;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Show {...props}>
          <SimpleShowLayout>
            <TextField source="code" />
            <TextField source="name" />

            <FunctionField
              source="level"
              render={(record) => RESOURCES[props.resource][record.level].name}
            />
          </SimpleShowLayout>
        </Show>
        <br />
        <List
          filter={{ parent_id: props.id }}
          {...props}
          actions={false}
          bulkActionButtons={false}
          empty={false}
        >
          <Datagrid>
            <TextField source="code" />
            <TextField source="name" />
          </Datagrid>
        </List>
      </Grid>

      {/* <Grid item xs={7}>
        <Card>
          <Chart {...props} />
        </Card>
      </Grid> */}
    </Grid>
  );
};

function Chart(props) {
  const [current, setCurrent] = useState({});
  const [drillLevel, setDrillLevel] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [projects, setProjects] = useState([]);

  const appConfig = useSelector((state) => state.app.appConfig);
  const { organizational_config } = appConfig;

  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const classes = useStyles();

  useEffect(() => {
    dataProvider
      .getListOfAll("projects", { filter: { organization_id: props.id } })
      .then((response) => {
        setProjects(response.data);
      });
    dataProvider.getOne("organizations", { id: props.id }).then((response) => {
      setCurrent(response.data);
      setDrillLevel(response.data.parent_id);
    });
    dataProvider.getListOfAll("organizations", {
      filter: {
        is_hidden: false,
      },
    }).then((response) => {
      setOrganizations(response.data);
    });
  }, []);

  function getChildrens() {
    if (projects.length === 0) return [];
    const currProjects = projects.map((item) =>
      !drillLevel ? getParent(item.organization_id) : item.organization_id
    );

    return current && current.children
      ? current.children.filter((item) => currProjects.includes(item.id))
      : [];
  }

  function getChildrensProjects() {
    if (projects.length === 0) return null;

    return (
      current &&
      current.children &&
      current.children.map((child) => {
        const currProjects = projects.filter((item) =>
          !drillLevel
            ? getParent(item.organization_id) === child.id
            : item.organization_id === child.id
        );
        return currProjects ? currProjects.length : 0;
      })
    );
  }

  function getParent(id, name) {
    const curr = lodash.find(
      organizations,
      (item) => item.id === Number(id) || item.name === name
    );
    return curr ? curr.parent_id : null;
  }

  function handleBack() {
    dataProvider.getOne("organizations", { id: props.id }).then((response) => {
      setCurrent(response.data);
      setDrillLevel(null);
    });
  }

  const datas = {
    labels: getChildrens().map((item) => item.name),
    datasets: [
      {
        data: getChildrensProjects(),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const options = {
    responsive: true,
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
      },
    },
  };

  return (
    <Card>
      {current && (
        <Typography
          variant="h2"
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Projects by{" "}
          {organizational_config[current.level] &&
            organizational_config[current.level].name}{" "}
        </Typography>
      )}
      {projects && projects.length > 0 && (
        <Pie
          options={options}
          data={datas}
          onElementsClick={(elems) => {
            const curr = lodash.find(
              current.children,
              (it) => it.name === datas.labels[elems[0]._index]
            );
            if (curr) {
              if (!lodash.isEmpty(curr.children)) {
                setCurrent(curr);
                setDrillLevel(curr.parent_id);
              } else {
                redirect(
                  `/projects?filter=${encodeURI(
                    JSON.stringify({ organization_id: curr.id })
                  )}&page=1&per_page=10&sort_field=id&sort_order=ASC`
                );
              }
            }
          }}
        />
      )}
      {drillLevel && (
        <CardActions>
          <Button size="small" onClick={handleBack}>
            BACK
          </Button>
        </CardActions>
      )}
    </Card>
  );
}

export default OrganizationsShow;

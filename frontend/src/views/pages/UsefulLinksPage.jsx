import React, { forwardRef } from "react";
import PivotTable from "react-pivottable/PivotTable";
import "react-pivottable/pivottable.css";
import TableRenderers from "react-pivottable/TableRenderers";
import Plot from "react-plotly.js";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import { NavLink as RouterLink } from "react-router-dom";

import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useDataProvider, useTranslate } from "react-admin";
import {
  Button,
  Grid,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Link,
  ListItem,
  ListItemText,
  List,
} from "@material-ui/core";
import lodash from "lodash";
import "./styles.css";

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref} style={{ flexGrow: 1 }}>
    <RouterLink {...props} target="_blank" />
  </div>
));

function UsefulLinksPage(props) {
  const [links, setLinks] = useState([]);
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider
      .getListOfAll("parameters", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          const useful_links = lodash.find(
            response.data,
            (it) => it.param_key === "useful_links"
          );
          if (useful_links) {
            setLinks(useful_links.param_value);
          }
        }
      });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h2" style={{ margin: 10 }}>
          Useful Links
        </Typography>
        <List>
          {links &&
            links.length > 0 &&
            links.map((link) => (
              <ListItem disableGutters key={link}>
                <a href={link} target="_blank">
                  <Typography
                    variant="h4"
                    style={{ margin: 10, color: "blue" }}
                  >
                    {link}
                  </Typography>
                </a>
              </ListItem>
            ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default UsefulLinksPage;

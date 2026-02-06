/* eslint-disable no-nested-ternary */
import React from "react";
import { makeStyles, formatMs } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { useLocation } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { useTranslate } from "react-admin";
import { checkFeature } from "../../../../../helpers/checkPermission";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "#576065",
    display: "flex",
    flexDirection: "column",
    padding: "15px 10px 10px",
  },
  lists: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(1),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

export default function RouterBreadcrumbs(props) {
  const breadCrumpsLinks = useSelector((state) => state.ui.breadCrumps);

  const dispatch = useDispatch();
  const classes = useStyles();
  const location = useLocation();
  const translate = useTranslate();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const FORMS = ["show", "edit", "create"];
  const links = pathnames.filter((page) => !FORMS.includes(page));
  const lastLink = links[links.length - 1];
  const phaseId = parseInt(lastLink, 10);
  const phaseName =
    !isNaN(phaseId) && phaseId >= 1 && phaseId <= 8
      ? translate(`resources.breadcrumbs.phase_${phaseId}`)
      : "";

  const renderLinks = () => {
    if (breadCrumpsLinks.length > 0) {
      return breadCrumpsLinks.map((link, index) => {
        const { to, title } = link;

        return to ? (
          <LinkRouter color="inherit" to={to} key={to} onClick={link.onClick}>
            {title}
          </LinkRouter>
        ) : (
          <Typography color="textPrimary" key={title} onClick={link.onClick}>
            {title}
          </Typography>
        );
      });
    }

    return links.map((value, index) => {
      let resource = value;
      let last = index === links.length - 1;
      let to = `/${links.slice(0, index + 1).join("/")}`;
      if (parseFloat(value)) return null;
      const hasPhase = value === "projects";

      if (value === "project-details") {
        resource = "projects";
        to = `/projects`;
      }

      if (value === "project") {
        resource = "projects";
        to = `/projects`;
      }

      if (value === "me-report") {
        resource = "me-reports";
        to = to + "s";
      }

      if (value === "project-indicators") {
        to = "/reports-indicators-projects";
      }

      if (value === "indicators") {
        to = "";
      }

      return last || !to ? (
        <Typography color="textPrimary" key={to}>
          {translate(`resources.${resource}.name`, {
            smart_count: 2,
          })}
        </Typography>
      ) : (
        <div>
          <LinkRouter
            color="inherit"
            to={to}
            key={to}
            onClick={() => {
              checkFeature("has_pimis_fields") &&
                dispatch({
                  type: "SET_PROJECT_TITLE_HEADER",
                  payload: {
                    data: "",
                  },
                });
            }}
          >
            {resource &&
              translate(`resources.${resource}.name`, {
                smart_count: 2,
              })}
          </LinkRouter>
          {checkFeature("has_pimis_fields") && hasPhase && (
            <>
              <span style={{ margin: "0px 5px" }}>/</span>
              {phaseName}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb">
        <LinkRouter color="inherit" to="/">
          {translate(`common.home`)}
        </LinkRouter>
        {renderLinks()}
      </Breadcrumbs>
    </div>
  );
}

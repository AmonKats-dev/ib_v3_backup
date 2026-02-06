import { Link, Tooltip } from "@material-ui/core";
import { useTranslate } from "react-admin";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MobileActions from "../../MobileActions";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { connect } from "react-redux";
import NotificationsAction from "./NotificationIcon";
import { checkFeature } from "../../../../../helpers/checkPermission";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& .MuiToolbar-regular": {
      minHeight: checkFeature("has_pimis_fields") ? 58 : 64,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0px -5px 5px -5px rgba(34, 60, 80, 0.6) inset",
    },
  },
  // drawer: {
  //   [theme.breakpoints.up("md")]: {
  //     width: drawerWidth,
  //     flexShrink: 0,
  //   },
  // },
  appBar: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    boxShadow: "none",
    backgroundColor: "#fff",
    color: "#576065",
    borderBottom: "1px solid #eeeeee",
    zIndex: 10,
  },
  appBarClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up("sm")]: {
      width: "calc(100% - 80px)",
      marginLeft: 80,
    },
  },
  appBarActions: {
    // position: "absolute",
    right: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

function TopBar(props) {
  const classes = useStyles();
  const translate = useTranslate();

  const { className, onSidebarOpen, ...rest } = props;

  function renderTitle() {
    if (checkFeature("has_pimis_fields")) {
      return props.location &&
        (props.location.indexOf("project-details") > -1 ||
          props.location.indexOf("expenditure") > -1 ||
          props.location.indexOf("gfms_data") > -1 ||
          props.location.indexOf("cost-plans") > -1 ||
          props.location.indexOf("projects") > -1 ||
          props.location.indexOf("project-indicators") > -1 ||
          props.location.indexOf("project-management") > -1) &&
        props.headerTitle
        ? props.headerTitle
        : "Public Investment Management Information System";
    }
    if (checkFeature("has_esnip_fields")) {
      return "Subsistema Nacional de Investimentos Públicos";
    }

    return props.headerTitle
      ? props.headerTitle
      : "Integrated Bank of Projects";
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarClose]: !props.opened,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => props.onMobileOpen(!props.mobileOpened)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              width: "70%",
              marginRight: 15,
            }}
          >
            <Typography variant="h3" noWrap>
              {renderTitle()}
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {checkFeature("has_pimis_fields") && (
              <Typography
                variant="caption"
                style={{
                  color: "#546e7a",
                }}
              >
                {`Logged in as ${
                  props.user &&
                  props.user.current_role &&
                  props.user.current_role.role.name
                }`}
              </Typography>
            )}
            {checkFeature("has_topbar_information_block") && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p style={{ margin: "1px 0px", fontSize: 10 }}>
                  Phone: <a href="tel:0414707386"> 0414707386 </a>
                </p>
                <p style={{ margin: "1px 0px", fontSize: 10 }}>
                  Email:
                  <a href="mailto:ibpsupport@finance.go.ug">
                    ibpsupport@finance.go.ug
                  </a>
                </p>
              </div>
            )}
            <div className={classes.appBarActions}>
              <Hidden xsDown implementation="css">
                <div style={{ display: "flex" }}>
                  <NotificationsAction />
                  <Tooltip
                    title={translate("tooltips.help")}
                    placement="bottom"
                  >
                    <IconButton color="inherit">
                      <Link
                        href={
                          checkFeature("has_pimis_fields")
                            ? "#"
                            : "http://ibp-help.torusline.com/"
                        }
                        target="_blank"
                        underline="none"
                      >
                        <HelpOutlineIcon fontSize="small" />
                      </Link>
                    </IconButton>
                  </Tooltip>
                </div>
              </Hidden>
              <Hidden smUp implementation="css">
                <MobileActions />
              </Hidden>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => ({
  ui: state.ui,
  user: state.user.userInfo,
  location: state.router.location.pathname,
});

const mapDispatchToProps = (state) => ({
  ui: state.ui,
  user: state.user.userInfo,
});

export default connect(mapStateToProps)(TopBar);

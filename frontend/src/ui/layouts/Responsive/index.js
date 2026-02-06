import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, ThemeProvider, useTheme } from "@material-ui/core/styles";
import {
  Notification,
  useAuthProvider,
  useLogout,
  useRedirect,
  userLogout,
  useTranslate,
} from "react-admin";
import Breadcrumbs from "./components/BreadCrumps";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import theme from "../../theme";
import RightPanel from "./components/RightPanel";
import {
  setRigtPanelVisibility,
  setRigtPanelContent,
} from "../../../actions/ui";
import Preloader from "../../../views/components/Preloader";
import { Container, useMediaQuery } from "@material-ui/core";
import { checkFeature } from "../../../helpers/checkPermission";
import IdleTimer from "react-idle-timer";
import { IdlePopup } from "./components/IdlePopup";
import { SESSION_TIMEOUT } from "../../../constants/config";
import { useSelector } from "react-redux";
import ErrorHandler from "../../../ErrorHandler";

const INITIAL_TIMER = 15;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    overflow: "hidden",
  },
  content: {
    flexGrow: 1,
    flex: "1 1 auto",
    minHeight: 0,
    minWidth: 0, // allow flex item to shrink with sidebar so no horizontal scroll
    overflowY: "auto",
    overflowX: "hidden",
    padding: theme.spacing(3),
    paddingTop: theme.spacing(9),
  },
  container: {
    padding: 0,
    margin: 0,
    width: "100%",
    maxWidth: "100%", // fit within main content area (responsive to sidebar open/closed)
    minWidth: 0,
  },
}));

function ResponsiveLayout(props) {
  const classes = useStyles();
  const authProvider = useAuthProvider();
  const logout = useLogout();
  const isMobile = useMediaQuery("(max-width:600px)", {
    noSsr: true,
  });
  const [timerLeft, setTimeLeft] = React.useState(INITIAL_TIMER);
  const [logoffTimer, setLogoffTimer] = React.useState(null);

  const [open, setOpen] = React.useState(true);
  const [timerState, setTimerState] = React.useState({
    timeout: SESSION_TIMEOUT,
    showModal: false,
    userLoggedIn: false,
    isTimedOut: false,
  });
  const [mobileOpen, setMobileOpen] = React.useState(isMobile);
  const dispatch = useDispatch();
  let idleTimer = null;

  const appConfig = useSelector((state) => state.app.appConfig);
  const appPrefix = appConfig.application_config.prefix;

  useEffect(() => {
    if (timerLeft === 0) {
      handleLogout();
    }
  }, [timerLeft]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toggleDrawer = () => {
    dispatch(setRigtPanelVisibility(false));
    dispatch(setRigtPanelContent(null));
  };

  function onAction(e) {
    if (!timerState.showModal) {
      setTimerState({ ...timerState, isTimedOut: false });
    }
  }

  function onActive(e) {
    if (!timerState.showModal) {
      setTimerState({ ...timerState, isTimedOut: false });
    }
  }

  function onIdle(e) {
    setTimerState({ ...timerState, showModal: true, isTimedOut: true });

    const interval = setInterval(function () {
      setTimeLeft((timerLeft) => timerLeft - 1);
    }, 1000);
    setLogoffTimer(interval);
  }

  function handleClose() {
    setTimerState({ ...timerState, showModal: false, isTimedOut: false });
    idleTimer.reset();
    clearInterval(logoffTimer);
    setLogoffTimer(null);
    authProvider.refreshToken();
    setTimeLeft(INITIAL_TIMER);
  }

  function handleLogout() {
    setTimerState({ ...timerState, showModal: false });
    clearInterval(logoffTimer);
    setLogoffTimer(null);
    logout();
  }

  return (
    <ThemeProvider theme={theme}>
      <IdleTimer
        ref={(ref) => {
          idleTimer = ref;
        }}
        element={document}
        onActive={onActive}
        onIdle={onIdle}
        onAction={onAction}
        debounce={250}
        timeout={timerState.timeout}
        stopOnIdle={true}
        crossTab={{
          emitOnAllTabs: false,
          type: "localStorage",
        }}
      />
      <div className={classes.root}>
        <CssBaseline />
        <TopBar
          opened={open}
          mobileOpened={mobileOpen}
          onMobileOpen={setMobileOpen}
          onOpenDrawer={handleDrawerOpen}
          onCloseDrawer={handleDrawerClose}
          {...props}
        />
        <Sidebar
          opened={open}
          mobileOpened={mobileOpen}
          onOpenDrawer={handleDrawerOpen}
          onCloseDrawer={handleDrawerClose}
          onMobileOpen={setMobileOpen}
          {...props}
        />
        <main className={classes.content}>
          <ErrorHandler>
            <Container className={classes.container} maxWidth={false}>
              {checkFeature("has_pimis_fields") && <Breadcrumbs {...props} />}
              {props.children}
              <Notification />
            </Container>
          </ErrorHandler>
        </main>
        <RightPanel
          open={props.rightPanelOpened}
          onToggleDrawer={toggleDrawer}
          project={props.project}
        />
        {props.isLoading && <Preloader />}
        <IdlePopup
          showModal={timerState.showModal}
          handleClose={handleClose}
          handleLogout={handleLogout}
          remainingTime={timerLeft}
        />
      </div>
    </ThemeProvider>
  );
}

ResponsiveLayout.propTypes = {
  window: PropTypes.func,
};

const mapStateToProps = (state) => ({
  headerTitle: state.ui.headerTitle,
  rightPanelOpened: state.ui.rightPanelVisible,
  isLoading: state.admin.loading,
  project:
    state.admin.resources.projects && state.admin.resources.projects.data,
});

export default connect(mapStateToProps, { userLogout })(ResponsiveLayout);

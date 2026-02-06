import React, { Fragment } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { Field, withTypes, Form } from "react-final-form";
import { useLocation } from "react-router-dom";
import { Link } from "@material-ui/core";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import { createTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import LockIcon from "@material-ui/icons/Lock";

import { useDispatch } from "react-redux";
import { Notification, Responsive, useDataProvider } from "react-admin";
import {
  useTranslate,
  useLogin,
  useNotify,
  useRedirect,
  useLogout,
} from "ra-core";
import theme from "../../ui/theme";
import { set } from "lodash";
import { LocationDisabledSharp } from "@material-ui/icons";
import "./login.css";
import { checkFeature } from "../../helpers/checkPermission";
import { useSelector } from "react-redux";
import moment from "moment";
import { RESET_PASSWORD_PAGE, TOKEN } from "../../constants/auth";
import { Typography } from "@material-ui/core";
import { API_URL } from "../../constants/config";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  small_box: {
    display: "flex",
    margin: "75px auto",
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
  },
  container: { position: "fixed", height: "100%", width: "100%" },
  main: {
    display: "flex",
    boxShadow: "0px 0px 20px 15px rgba(34, 60, 80, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    position: "absolute",
    top: "15%",
    bottom: "20%",
    right: "15%",
    left: "15%",
  },
  bg_image: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundImage: "url(assets/images/jm/bg_pimis.jpeg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "black",
  },
  logo: {
    alignItems: "center",
    position: "absolute",
    display: "flex",
    gap: 10,
    bottom: 10,
    right: 10,
  },
  content: {
    width: "100%",
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    gap: 15,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 30,
    padding: "30px 0px",
  },
  label: {
    display: "flex",
  },
  input: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    position: "absolute",
    left: "15px",
    top: "15px",
  },
  title: {
    marginBottom: "55px",
    textShadow: "2px 2px #ffffff",
    textAlign: "center",
    width: "50%",
  },
  card: {
    minWidth: 300,
  },
  avatar: {
    margin: "1em",
    textAlign: "center ",
    display: "flex",
    justifyContent: "center",
  },
  hint: {
    textAlign: "center",
    marginTop: "1em",
    color: "#ccc",
  },
  footer: {
    position: "absolute",
    bottom: "15px",
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    color: "rgba(255, 255, 255, 1.00)",
    textShadow:
      "1px 1px 2px rgba(0, 0, 0, 1.00), 0px 0px 5px rgba(0, 0, 0, 1.00)",
  },
  footerRightTitle: {
    paddingRight: "15px",
    textAlign: "center",
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
  },

  actions: {
    padding: "0 1em 1em 1em",
    display: "flex",
    flexDirection: "column",
    gap: 10,

    "& .MuiButton-fullWidth": {
      backgroundColor: "#043875",
      padding: 10,
      fontSize: 16,
      borderRadius: 15,
      textTransform: "capitalize",
    },
  },
  bgImageleft: {
    // backgroundImage: "url(assets/img/logo_new.png)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "300px",
    height: "305px",
    position: "absolute",
    left: "5%",
  },
  bgImageRight: {
    backgroundSize: "cover",
    // backgroundImage: "url(assets/img/coat_of_arms.png)",
    backgroundRepeat: "no-repeat",
    width: "300px",
    height: "305px",
    position: "absolute",
    right: "5%",
    backgroundSize: "90%",
  },
  sm_bgImageLeft: {
    // backgroundImage: "url(assets/img/logo_new.png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%",
    width: "150px",
    height: "150px",
  },
  sm_bgImageRight: {
    // backgroundImage: "url(assets/img/coat_of_arms.png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "90%",
    width: "150px",
    height: "150px",
  },
  copyright: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
}));

const renderInput = ({
  meta: { touched, error } = { touched: false, error: undefined },
  input: { ...inputProps },
  ...props
}) => (
  <TextField
    error={!!(touched && error)}
    helperText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
    variant="outlined"
  />
);

function Copyright(appConfig) {
  const classes = useStyles();
  return appConfig === "ug" ? (
    <h5 className={classes.footerRightTitle}>
      {`Copyright © 2019 - ${moment().format(
        "YYYY"
      )}, Ministry of Finance, Planning and Economic Development
               `}
    </h5>
  ) : (
    <h5 className={classes.footerRightTitle}>
      {`©${moment().format("YYYY")} CRI`}
    </h5>
  );
}

function renderTitle(appPrefix) {
  switch (appPrefix) {
    case "jm":
      return "Public Investment Management Information System";
    case "ug":
      return "Integrated Bank of Projects";
    default:
      return null;
  }
}

const ResetPasswordPagePimis = (props) => {
  const [loading, setLoading] = useState(false);
  const translate = useTranslate();
  const classes = useStyles();
  const showNotification = useNotify();
  const location = useLocation();
  const redirect = useRedirect();
  const appConfig = useSelector((state) => state.app.appConfig);
  const appPrefix = appConfig.application_config.prefix;

  const handleSubmit = (auth) => {
    setLoading(true);
    fetch(API_URL + "/password", {
      method: "PUT",
      body: JSON.stringify({ username: auth.username }), // данные могут быть 'строкой' или {объектом}!
    })
      .then((result) => {
        localStorage.removeItem(RESET_PASSWORD_PAGE);
        showNotification("Password was resetted!");
        setLoading(false);
        setTimeout(() => {
          redirect("/login");
        }, 1500);
      })
      .catch((result) => {
        showNotification("Password wasn`t resetted! ", "error");
        setLoading(false);
      });
  };

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = translate("ra.validation.required");
    }
    return errors;
  };

  return (
    <Fragment>
      <Form
        onSubmit={handleSubmit}
        validate={validate}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} noValidate>
            <div className={classes.container}>
              <div className={classes.main}>
                <div className={classes.bg_image}>
                  <Typography
                    variant="p"
                    style={{
                      fontSize: 55,
                      lineHeight: '55px',
                      fontWeight: 900,
                      paddingLeft: 100,
                      color: "#fff",
                      top: "30%",
                      position: "absolute",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    Welcome <br /> Back!
                  </Typography>
                  <div className={classes.logo}>
                    <div
                      style={{
                        backgroundImage: `url(assets/images/jm/logo.png)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: 12,
                        width: 18,
                      }}
                    />
                    <div style={{ color: "#fff", fontSize: "14px" }}>
                      Government of Jamaica
                    </div>
                  </div>
                </div>
                <div className={classes.content}>
                  <div>
                    <Typography variant="p" style={{ fontSize: 25 }}>
                      Reset Password
                    </Typography>
                    <br />
                    <br />
                    <Typography variant="p" style={{ fontSize: 18 }}>
                      Enter your username to reset password
                    </Typography>
                  </div>
                  <div className={classes.form}>
                    <div className={classes.input}>
                      <Typography variant="h6" style={{ marginBottom: 5 }}>
                        User Name
                      </Typography>
                      <Field
                        autoFocus
                        name="username"
                        component={renderInput}
                        label={false}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className={classes.actions}>
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      disabled={loading}
                      fullWidth
                    >
                      {loading && <CircularProgress size={25} thickness={2} />}
                      Reset Password
                    </Button>

                    <br />

                    <Link href={"#/login"} underline="none">
                      <Typography
                        variant="body1"
                        style={{
                          marginTop: 10,
                          fontSize: 14,
                          color: "#002e7b",
                          textAlign: "left",
                        }}
                      >
                        Back to Login
                      </Typography>
                    </Link>
                  </div>
                </div>
                <Notification />
                <div className={classes.copyright}>{Copyright(appPrefix)}</div>
              </div>
            </div>
          </form>
        )}
      />
    </Fragment>
  );
};

ResetPasswordPagePimis.propTypes = {
  authProvider: PropTypes.func,
  previousRoute: PropTypes.string,
};

// We need to put the ThemeProvider decoration in another component
// Because otherwise the useStyles() hook used in Login won't get
// the right theme
const ResetPasswordPageWithThemePimis = (props) => (
  <ThemeProvider theme={createTheme(theme)}>
    <ResetPasswordPagePimis {...props} />
  </ThemeProvider>
);

export default ResetPasswordPageWithThemePimis;

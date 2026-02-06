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
    boxShadow: "10px 10px 5px 0px rgba(34, 60, 80, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    position: "absolute",
    top: "15%",
    bottom: "15%",
    right: "20%",
    left: "20%",
    height: "auto",
  },
  bg_image: {
    position: "relative",
    width: "120%",
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
    paddingLeft: 25,
    paddingRight: 25,
    // height: "100%",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-around",
    // gap: 15,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginTop: 10,
    // padding: "30px 0px",
  },
  label: {
    display: "flex",
  },
  input: {
    display: "flex",
    flexDirection: "column",
    height: 70,
    "& .MuiOutlinedInput-input": {
      padding: "15.5px 32px 15.5px 14px",
    },
  },
  hint: {
    textAlign: "center",
    marginTop: "1em",
    color: "#ccc",
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
    margin: 10,
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
  },

  actions: {
    // padding: "0 1em 1em 1em",
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
    inputProps={{ maxLength: inputProps.name === "username" ? 50 : 20 }}
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
    case "mzb":
      return "Subsistema Nacional de Investimentos Públicos";
    default:
      return null;
  }
}

const Login = (props) => {
  const [showResetPass, setShowResetPass] = useState(false);
  const [tempLogin, setTempLogin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const translate = useTranslate();
  const classes = useStyles();
  const notify = useNotify();
  const login = useLogin();
  const location = useLocation();
  const dispatch = useDispatch();
  const appConfig = useSelector((state) => state.app.appConfig);
  const appPrefix = appConfig.application_config.prefix;

  const handleSubmit = (auth) => {
    setTempLogin(auth.username);
    setLoading(true);
    login(
      { ...auth, success: { reset: setToken, dispatch: dispatch } },
      location.state ? location.state.nextPathname : "/"
    ).catch((error) => {
      if (
        checkFeature("is_password_expirable") &&
        error.message === "password_expired"
      ) {
        setPasswordReset(true);

        return;
      }
      setLoading(false);
      notify(
        typeof error === "string"
          ? error
          : typeof error === "undefined" || !error.message
          ? "ra.auth.sign_in_error"
          : error.message,
        "warning"
      );
    });
  };

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = translate("ra.validation.required");
    }
    if (!values.password) {
      errors.password = translate("ra.validation.required");
    }
    return errors;
  };

  return (
    <Fragment>
      {!passwordReset && (
        <Form
          onSubmit={handleSubmit}
          validate={validate}
          render={({ handleSubmit }) => (
            <Responsive
              small={
                <form onSubmit={handleSubmit} noValidate>
                  <div className={classes.container}>
                    <div className={classes.main}>
                      <div className={classes.content}>
                        <div style={{ marginBottom: 15 }}>
                          <Typography variant="p" style={{ fontSize: 22 }}>
                            Login
                          </Typography>
                          <br />
                          <Typography
                            variant="p"
                            style={{ fontSize: 16, marginBottom: 15 }}
                          >
                            Welcome back! Please login to your account.
                          </Typography>
                        </div>
                        <div className={classes.form}>
                          <div className={classes.input}>
                            <Typography variant="h6">User Name</Typography>
                            <Field
                              autoFocus
                              name="username"
                              component={renderInput}
                              label={false}
                              disabled={loading}
                            />
                          </div>
                          <div className={classes.input}>
                            <Typography variant="h6">Password</Typography>
                            <Field
                              name="password"
                              component={renderInput}
                              label={false}
                              type="password"
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div className={classes.actions}>
                          {checkFeature("has_reset_password_page") && (
                            <Link href={"#/reset-password"} underline="none">
                              <Typography
                                variant="body1"
                                style={{
                                  marginTop: 10,
                                  fontSize: 14,
                                  color: "#002e7b",
                                  textAlign: "right",
                                }}
                                onClick={() => {
                                  localStorage.setItem(
                                    RESET_PASSWORD_PAGE,
                                    "true"
                                  );
                                }}
                              >
                                Forget password?
                              </Typography>
                            </Link>
                          )}

                          <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            fullWidth
                          >
                            {loading && (
                              <CircularProgress size={25} thickness={2} />
                            )}
                            Login
                          </Button>

                          <Typography
                            variant="subtitle2"
                            style={{ marginTop: 10, fontSize: 14 }}
                            onClick={() => {
                              localStorage.setItem(RESET_PASSWORD_PAGE, "true");
                            }}
                          >
                            New User?
                            <a
                              href="mailto:pimis@mof.gov.jm"
                              style={{
                                color: "#002e7b",
                                textDecoration: "none",
                                marginLeft: 5,
                              }}
                            >
                              Sign up
                            </a>
                          </Typography>
                        </div>
                      </div>
                      <Notification />
                      <div className={classes.copyright}>
                        {Copyright(appPrefix)}
                      </div>
                    </div>
                  </div>
                </form>
              }
              medium={
                <form onSubmit={handleSubmit} noValidate>
                  <div className={classes.container}>
                    <div className={classes.main}>
                      <div className={classes.bg_image}>
                        <Typography
                          variant="p"
                          style={{
                            fontSize: 55,
                            lineHeight: "55px",
                            fontWeight: 900,
                            paddingLeft: "10%",
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
                          <Typography
                            variant="p"
                            style={{
                              fontSize: 30,
                              fontWeight: 900,
                              color: "#043875",
                            }}
                          >
                            Login
                          </Typography>
                          <br />
                          <br />
                          <Typography variant="p" style={{ fontSize: 18 }}>
                            Welcome back! Please login to your account.
                          </Typography>
                        </div>
                        <div className={classes.form}>
                          <div className={classes.input}>
                            <Typography
                              variant="h6"
                              style={{ marginBottom: 5 }}
                            >
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
                          <div className={classes.input}>
                            <Typography
                              variant="h6"
                              style={{ marginBottom: 5 }}
                            >
                              Password
                            </Typography>
                            <Field
                              name="password"
                              component={renderInput}
                              label={false}
                              type="password"
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div className={classes.actions}>
                          {checkFeature("has_reset_password_page") && (
                            <Link href={"#/reset-password"} underline="none">
                              <Typography
                                variant="body1"
                                style={{
                                  marginTop: 10,
                                  fontSize: 14,
                                  color: "#002e7b",
                                  textAlign: "right",
                                }}
                                onClick={() => {
                                  localStorage.setItem(
                                    RESET_PASSWORD_PAGE,
                                    "true"
                                  );
                                }}
                              >
                                Forget password?
                              </Typography>
                            </Link>
                          )}

                          <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading}
                            fullWidth
                          >
                            {loading && (
                              <CircularProgress size={25} thickness={2} />
                            )}
                            Login
                          </Button>

                          <Typography
                            variant="subtitle2"
                            style={{ marginTop: 10, fontSize: 14 }}
                            onClick={() => {
                              localStorage.setItem(RESET_PASSWORD_PAGE, "true");
                            }}
                          >
                            New User?
                            <a
                              href="mailto: test@test.te"
                              style={{
                                color: "#002e7b",
                                textDecoration: "none",
                                marginLeft: 5,
                              }}
                            >
                              Sign up
                            </a>
                          </Typography>
                        </div>
                      </div>
                      <Notification />
                      <div className={classes.copyright}>
                        {Copyright(appPrefix)}
                      </div>
                    </div>
                  </div>
                </form>
              }
            />
          )}
        />
      )}
      {passwordReset && (
        <ResetPassword {...props} tempToken={token} tempLogin={tempLogin} />
      )}
    </Fragment>
  );
};

const ResetPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(false);
  const translate = useTranslate();
  const classes = useStyles();
  const notify = useNotify();
  const login = useLogin();
  const logout = useLogout();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const location = useLocation();
  const dispatch = useDispatch();
  const appConfig = useSelector((state) => state.app.appConfig);
  const appPrefix = appConfig.application_config.prefix;

  const handleSubmitLogin = (auth) => {
    setLoading(true);
    login(
      { ...auth, success: { reset: () => {}, dispatch: dispatch } },
      location.state ? location.state.nextPathname : "/"
    ).catch((error) => {
      setLoading(false);
      notify(
        typeof error === "string"
          ? error
          : typeof error === "undefined" || !error.message
          ? "ra.auth.sign_in_error"
          : error.message,
        "warning"
      );
    });
  };

  const handleSubmit = (auth) => {
    localStorage.setItem(TOKEN, props.tempToken);
    setLoading(true);
    dataProvider
      .update("users/me", {
        data: { password: auth.confirmPassword, id: null },
      })
      .then((result) => {
        setLoading(false);
        // localStorage.removeItem(TOKEN);
        // window.location.href = "https://ibp.finance.go.ug/app.html#/login";
        // window.location.reload();
        handleSubmitLogin({
          password: auth.confirmPassword,
          username: props.tempLogin,
        });
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const validate = (values) => {
    const regEx = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/gm;

    const errors = {};
    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = "Password confirmation incorrect";
    }
    if (!values.newPassword) {
      errors.newPassword = translate("ra.validation.required");
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = translate("ra.validation.required");
    }
    if (!regEx.test(values.newPassword)) {
      errors.confirmPassword = `Contain both upper- and lower-case characters (e.g., a-z, A-Z). <br/>
      Have numbers and punctuation characters as well as letters.
      At least eight alphanumeric characters long`;
    }
    setErrors(errors.confirmPassword);
    return errors;
  };

  return (
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
                    lineHeight: "55px",
                    fontWeight: 900,
                    paddingLeft: "10%",
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
              {/* <div
                className={classes.content}
                style={{
                  flexDirection: "row",
                }}
              >
                <div className={classes.bg_image}>
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
                </div> */}

              <div className={classes.content}>
                <div>
                  <Typography
                    variant="p"
                    style={{
                      fontSize: 25,
                      marginBottom: 5,
                      fontWeight: 900,
                      color: "rgb(4, 56, 117)",
                    }}
                  >
                    Your password expired
                  </Typography>
                  <br />
                  <Typography
                    variant="p"
                    style={{ fontSize: 18, marginBottom: 15 }}
                  >
                    Please change your password.
                  </Typography>
                </div>
                <div className={classes.form}>
                  <div className={classes.input}>
                    <Typography variant="h6" style={{ marginBottom: 5 }}>
                      New Password
                    </Typography>
                    <Field
                      name="newPassword"
                      component={renderInput}
                      label={false}
                      type="password"
                      disabled={loading}
                    />
                  </div>
                  <div className={classes.input}>
                    <Typography variant="h6" style={{ marginBottom: 5 }}>
                      Password Confirmation
                    </Typography>
                    <Field
                      name="confirmPassword"
                      component={renderInput}
                      label={false}
                      type="password"
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
                    Change Password
                  </Button>
                </div>
              </div>
              <Notification />
              <div className={classes.copyright}>{Copyright(appPrefix)}</div>
            </div>
          </div>
          {/* </div> */}
        </form>
      )}
    />
  );
};

Login.propTypes = {
  authProvider: PropTypes.func,
  previousRoute: PropTypes.string,
};

// We need to put the ThemeProvider decoration in another component
// Because otherwise the useStyles() hook used in Login won't get
// the right theme
const LoginWithTheme = (props) => (
  <ThemeProvider theme={createTheme(theme)}>
    <Login {...props} />
  </ThemeProvider>
);

export default LoginWithTheme;

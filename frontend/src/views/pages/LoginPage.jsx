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
  main: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d1bc9b",
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
  form: {
    padding: "0 1em 1em 1em",
  },
  input: {
    display: "flex",
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
      {`Copyright © ${moment().format("YYYY")}, Pimis Development
                 `}
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
                  <div className={classes.main}>
                    <div
                      className={classes.bgImageleft}
                      style={{
                        backgroundImage: checkFeature("has_pimis_fields")
                          ? `url(assets/images/${appPrefix}/coat_of_arms.png)`
                          : `url(assets/images/${appPrefix}/logo.png)`,
                        backgroundSize: checkFeature("has_pimis_fields")
                          ? "contain"
                          : "50%",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        margin: "10px auto",
                        backgroundPosition: "center",
                        height: 175,
                        width: "100%",
                      }}
                    ></div>
                    <h2 className={classes.title} style={{ width: "90%" }}>
                      {renderTitle(appPrefix)}
                    </h2>
                    <Card className={classes.card}>
                      <div className={classes.avatar}>
                        <Avatar className={classes.icon}>
                          <LockIcon />
                        </Avatar>
                      </div>
                      <div className={classes.form}>
                        <div className={classes.input}>
                          <Field
                            autoFocus
                            name="username"
                            // @ts-ignore
                            component={renderInput}
                            label={translate("ra.auth.username")}
                            disabled={loading}
                          />
                        </div>
                        <div className={classes.input}>
                          <Field
                            name="password"
                            // @ts-ignore
                            component={renderInput}
                            label={translate("ra.auth.password")}
                            type="password"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <CardActions className={classes.actions}>
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
                          {translate("ra.auth.sign_in")}
                        </Button>
                      </CardActions>
                    </Card>
                    <Notification />
                    <div
                      className={classes.footer}
                      style={{ justifyContent: "center" }}
                    >
                      {Copyright(appPrefix)}
                    </div>
                  </div>
                </form>
              }
              medium={
                <form onSubmit={handleSubmit} noValidate>
                  <div className={classes.main}>
                    <div
                      className={classes.bgImageleft}
                      style={{
                        backgroundImage: `url(assets/images/${appPrefix}/logo.png)`,
                        marginTop: checkFeature("has_pimis_fields")
                          ? "150px"
                          : 0,
                        backgroundSize: checkFeature("has_pimis_fields")
                          ? "contain"
                          : "cover",
                      }}
                    ></div>
                    <h1 className={classes.title}>{renderTitle(appPrefix)}</h1>
                    <Card className={classes.card}>
                      <div className={classes.avatar}>
                        <Avatar className={classes.icon}>
                          <LockIcon />
                        </Avatar>
                      </div>
                      <div className={classes.form}>
                        <div className={classes.input}>
                          <Field
                            autoFocus
                            name="username"
                            // @ts-ignore
                            component={renderInput}
                            label={translate("ra.auth.username")}
                            disabled={loading}
                          />
                        </div>
                        <div className={classes.input}>
                          <Field
                            name="password"
                            // @ts-ignore
                            component={renderInput}
                            label={translate("ra.auth.password")}
                            type="password"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <CardActions className={classes.actions}>
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
                          {translate("ra.auth.sign_in")}
                        </Button>
                        {checkFeature("has_reset_password_page") && (
                          <Link href={"#/reset-password"} underline="none">
                            <Typography
                              variant="subtitle2"
                              style={{ marginTop: 10 }}
                              onClick={() => {
                                localStorage.setItem(RESET_PASSWORD_PAGE, 'true');
                              }}
                            >
                              reset password
                            </Typography>
                          </Link>
                        )}
                      </CardActions>
                    </Card>
                    <div
                      className={classes.bgImageRight}
                      style={{
                        backgroundImage: `url(assets/images/${appPrefix}/coat_of_arms.png)`,
                      }}
                    ></div>
                    <Notification />
                    <div className={classes.footer}>{Copyright(appPrefix)}</div>
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
          <div className={classes.main}>
            <div className={classes.bgImageleft}></div>{" "}
            <h1 className={classes.title}>{renderTitle(appPrefix)}</h1>
            <Card className={classes.card}>
              <div className={classes.avatar}>
                <Avatar className={classes.icon}>
                  <LockIcon />
                </Avatar>
              </div>
              <div className={classes.form}>
                <div className={classes.input}>
                  <Field
                    name="newPassword"
                    component={renderInput}
                    label={"new password"}
                    type="password"
                    disabled={loading}
                  />
                </div>
                <div className={classes.input}>
                  <Field
                    name="confirmPassword"
                    component={renderInput}
                    label={"confirm password"}
                    type="password"
                    disabled={loading}
                  />
                </div>
              </div>
              <CardActions className={classes.actions}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={loading || errors}
                  fullWidth
                >
                  {loading && <CircularProgress size={25} thickness={2} />}
                  {"change password"}
                </Button>
              </CardActions>
            </Card>
            <div className={classes.bgImageRight}></div>
            <Notification />
          </div>
          <div className={classes.footer}>{Copyright(appPrefix)}</div>
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

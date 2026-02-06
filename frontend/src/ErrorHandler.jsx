import React from "react";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import { Button } from "@material-ui/core";
import { UpdateOutlined } from "@material-ui/icons";

class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.log(error, errorInfo);
    // You can also log error messages to an error reporting service here
  }


  render() {
    const permissions =
      window.localStorage.getItem("permissions") &&
      JSON.parse(window.localStorage.getItem("permissions"));
    const isAdmin = permissions && permissions.includes("full_access");

    const err = this.state.error;
    const isNetworkError =
      err &&
      (err.message === "Failed to fetch" ||
        err.message === "Network request failed" ||
        (err.message && err.message.includes("Load failed")));

    if (this.state.errorInfo) {
      // Error path
      return (
        <div
          style={{
            padding: "50px",
            fontSize: "18px",
            color: "#cdcdcd",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WarningRoundedIcon style={{ color: "#cdcdcd", fontSize: "250px" }} />
          <h2>Something went wrong.</h2>
          {isNetworkError && (
            <p style={{ maxWidth: "480px", textAlign: "center", marginTop: 8 }}>
              The app could not reach the API. Make sure the backend server is
              running (e.g. <code>flask run</code> in the backend folder on port
              5000).
            </p>
          )}
          <Button href="/" variant="text" startIcon={<UpdateOutlined />}>
            Refresh
          </Button>
          {isAdmin && (
            <>
              <h4>Check error details below</h4>
              <details
                style={{
                  whiteSpace: "pre-wrap",
                  height: "80%",
                  overflow: "auto",
                }}
              >
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            </>
          )}
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorHandler;

import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import logo from './logo.png';
import './styles.css';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 9999,
    color: "#fff",
  },
}));



const Preloader = () => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={true} >
      <CircularProgress disableShrink />
    </Backdrop>
  );
};

export default Preloader;

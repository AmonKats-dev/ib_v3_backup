import { makeStyles } from "@material-ui/core/styles";

const styles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tabContainer: {
    display: "flex",
    flexDirection: "column",
  },
  form: {
    "& .MuiCardContent-root": {
      padding: 0,
    },
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    width: "90%",
    minWidth: "250px",
    position: "relative",
  },
  inputWrapperFullWidth: {
    width: "100%",
  },
  content: {
    width: "100%",
  },
  contentBoolean: {
    width: "initial",
  },
  contentDisabled: {
    pointerEvents: "none",
    "& .ra-rich-text-input": {
      pointerEvents: "none",
    },
  },
  icon: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  iconRight: {
    position: "absolute",
    top: theme.spacing(2),
    right: 0,
  },
}));

export default styles;

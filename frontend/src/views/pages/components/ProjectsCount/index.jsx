import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import MoneyIcon from "@material-ui/icons/Money";
import { PROJECT_PHASES_COLORS } from "../../../../constants/common";
import DescriptionIcon from "@material-ui/icons/Description";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    height: 56,
    width: 56,
  },
  differenceIcon: {
    color: colors.red[900],
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1),
  },
}));

const ProjectsCount = ({ className, ...props }) => {
  const classes = useStyles();
  if (!props.item) return null;
  return (
    <Card className={clsx(classes.root, className)} {...props}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {props.item && props.item.phase_name}
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {props.item.total_count}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              className={classes.avatar}
            >
              <DescriptionIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ProjectsCount.propTypes = {
  className: PropTypes.string,
};

export default ProjectsCount;

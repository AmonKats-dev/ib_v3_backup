import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import List from "@material-ui/core/List";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import lodash from "lodash";
import moment from "moment";
import React, { Component } from "react";
import EventItem from "./EventItem";

const styles = (theme) => ({
  root: {
    width: 600,
    margin: "auto",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
    fontWeight: "bold",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  details: {
    display: "block",
  },
});

const getDayString = (date) =>
  new Date(date).toLocaleDateString("en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const sortByDate = (a, b) => new Date(b).valueOf() - new Date(a).valueOf();

const getDayForEvent = (event) => {
  const momentDate = moment(event.created_on);
  const date = new Date(momentDate);
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(0);
  date.setHours(0);
  return date.toISOString();
};

const groupByDay = (events) => {
  const groups = events.reduce((days, event) => {
    const day = getDayForEvent(event);
    if (!days[day]) {
      days[day] = [];
    }
    days[day] = days[day].concat(event);
    return days;
  }, {});

  return {
    days: Object.keys(groups).sort(sortByDate),
    eventsByDay: groups,
  };
};

export class Timeline extends Component {
  state = {
    expanded: null,
    eventsByPhaseDays: [],
  };

  componentDidMount() {
    const { events } = this.props;
    const eventsByPhase = lodash.groupBy(events, "phase_id");
    const eventsByPhaseDays = lodash
      .sortBy(
        lodash.keys(eventsByPhase).map((phase) => {
          return {
            phase: phase,
            phaseName:
              eventsByPhase[phase] && eventsByPhase[phase][0].phase.name,
            ...groupByDay(eventsByPhase[phase]),
          };
        }),
        "phase"
      )
      .reverse();

    if (!this.state.expanded && eventsByPhaseDays.length !== 0) {
      this.setState({
        expanded: lodash.first(eventsByPhaseDays).phase,
        eventsByPhaseDays,
      });
    }
  }

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { expanded, eventsByPhaseDays } = this.state;
    const { classes, translate } = this.props;

    const sortedDays = (dayData) => {
      return lodash.sortBy(dayData, (day) => moment(day.created_on)).reverse();
    };

    return (
      <div className={classes.root}>
        {eventsByPhaseDays.map((item) => (
          <ExpansionPanel
            expanded={expanded === item.phase}
            onChange={this.handleChange(item.phase)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                {item.phase && item.phaseName}
              </Typography>
              {/* <Typography className={classes.heading}>{translate(`resources.phases.phase_${item.phase}`)}</Typography> */}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              {item.days.map((day) => (
                <div key={day} className={classes.day}>
                  <Typography variant="subheading" gutterBottom>
                    <italic>{getDayString(day)}</italic>
                  </Typography>
                  <List>
                    {sortedDays(item.eventsByDay[day]).map((event) => (
                      <EventItem event={event} key={event.id} />
                    ))}
                  </List>
                </div>
              ))}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(Timeline);

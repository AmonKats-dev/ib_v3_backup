import './styles.scss';

import { ACTION_TYPES, API_URL } from '../../../constants/common';
import { Button, showNotification, translate } from 'react-admin';
import React, {Component, Fragment} from 'react';
import { change, isSubmitting, submit } from 'redux-form';

import Assignment from '@material-ui/icons/Assignment';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import CustomTimeline from '../TimeLine';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Drawer from '@material-ui/core/Drawer';
import EventItem from '../TimeLine/EventItem';
import Refresh from '@material-ui/icons/Refresh';
import Timeline from '@material-ui/icons/Timeline';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import dataProvider from '../../../providers/dataProvider';
import lodash from 'lodash';
import moment from 'moment';
import { push } from 'react-router-redux';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    timeline_container: {
        width: '600px'
    },
    link: {
        textDecoration: 'underline',
        color: 'blue',
        cursor: 'pointer'
    }
}
class CustomShowEventButton extends Component {
    state = {
        events: [],
        isOpenModal: false
    }

    toggleDrawer = (open) => () => {
        this.setState({ isOpenModal: open });
    };

    handleClick = () => {
        const { push, record, showNotification, action, config } = this.props;
        const requestParams = {
            id: record.id + '/timeline',
        };
        
        dataProvider('GET_ONE', 'projects', requestParams)
            .then((response) => {
                if (response && response.data) {
                    const sortedEvents = lodash.sortBy(response.data, (item) => moment(item.created_at, 'DD.MM.YYYY hh:mm')).reverse();
                    this.setState({ events: sortedEvents.length !== 0 ? [sortedEvents[0]] : [], isOpenModal: true })
                    return response.data;
                } else {
                    this.props.showNotification('Failed to fetch', 'warning')
                }
            })
    }

    renderFiles (files) {
        if (files.length !== 0) {
            return [
                <p className="timeline-event-description_title">{`Files:`}</p>, 
                <div>{files}</div>
            ]
        }

        return null;
    }

    render() {
        const { push, record, showNotification, action, config } = this.props;
        return (
            <Fragment>
                <Typography style={styles.link} onClick={this.handleClick}>{this.props.label}</Typography>
                <Dialog
                    open={this.state.isOpenModal}
                    onClose={this.toggleDrawer(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{this.props.translate('timeline.event_title')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        {
                            this.state.events.length !== 0 &&
                            this.state.events.map((event) => 
                                <EventItem event={event} key={event.id} />)
                        }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button label={this.props.translate('buttons.close')} onClick={this.toggleDrawer(false)} />
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

const mapDispatchToProps = {
    push,
    showNotification,
    change,
    submit
};

export default translate(connect(null, mapDispatchToProps)(withStyles(styles)(CustomShowEventButton)))
import React, {Component, Fragment} from 'react';
import { showNotification, translate, Button } from 'react-admin';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { ACTION_TYPES, API_URL } from '../../../constants/common';
import { change, submit, isSubmitting } from 'redux-form';
import dataProvider from '../../../providers/dataProvider';
import Drawer from '@material-ui/core/Drawer';
import CustomTimeline from '../TimeLine';
import moment from 'moment';

import Timeline from '@material-ui/icons/Timeline';
import Check from '@material-ui/icons/Check';
import Cancel from '@material-ui/icons/Cancel';
import Refresh from '@material-ui/icons/Refresh';
import Assignment from '@material-ui/icons/Assignment';

import lodash from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import './styles.scss';
const styles = {
    timeline_container: {
        width: '600px'
    }
}
class TimeLineButton extends Component {
    state = {
        events: [],
        isOpenDrawer: false
    }

    renderIcon(action) {
        switch (action) {
            case ACTION_TYPES.approve:
                return <Check />
            case ACTION_TYPES.reject:
                return <Cancel />
            case ACTION_TYPES.revise:
                return <Refresh />
            case ACTION_TYPES.assign:
                return <Assignment />
            default:
                return null
        }
    }

    toggleDrawer = (open) => () => {
        this.setState({ isOpenDrawer: open });
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
                    this.setState({ events: sortedEvents, isOpenDrawer: true })
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
                <Button label={this.props.translate('buttons.timeline')} onClick={this.handleClick}><Timeline /></Button>
                    <Drawer anchor="right" open={this.state.isOpenDrawer} onClose={this.toggleDrawer(false)} classes={styles.timeline_container}>
                        <div
                            tabIndex={0}
                            role="button"
                            onKeyDown={this.toggleDrawer(false)}
                        >   
                            <div className="timeline-container">
                                <p className="timeline-title">{this.props.translate('timeline.title')}</p>
                                <br/>
                                <div className="timeline-btn-close">
                                    <Button label={this.props.translate('buttons.close')} onClick={this.toggleDrawer(false)} />
                                </div>
                                <div className="timeline-content">
                                    <CustomTimeline events={this.state.events}  {...this.props}/>
                                </div>
                            </div>
                            
                            
                        </div>
                    </Drawer>
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

export default translate(connect(null, mapDispatchToProps)(withStyles(styles)(TimeLineButton)))
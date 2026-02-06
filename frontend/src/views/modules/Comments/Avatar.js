import React from 'react';
import MuiAvatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    avatar: {
        width: 25,
        height: 25,
        left: 10,
        position: 'absolute',
        background: '#fff'
    },
};

const AvatarView = ({ user, classes, ...props }) => (
    <MuiAvatar
        className={classes.avatar}
    >{props.children}</MuiAvatar>
);

const Avatar = withStyles(styles)(AvatarView);

export default Avatar;

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import { SaveOutlined } from '@material-ui/icons';
import lodash from 'lodash';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  item: {
    margin: '0 20px',
    border: '1px solid #a2b1c6',
    width: '250px'
  }
}));

export default function ReportListBuilder(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    setChecked(value);
    props.onLoad(value);
  };

  return (
    <List className={classes.root}>
       {lodash.keys(props.items).map((item, idx) => {
        const labelId = `checkbox-list-label-${idx}`;
        return (
          [<ListItem  key={item} role={undefined} dense button onClick={handleToggle(item)} >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked === item}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={item} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments" onClick={props.onSave}>
                <SaveOutlined />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>, <Divider orientation="vertical" flexItem />]
        );
      })}
    </List>
  );
}

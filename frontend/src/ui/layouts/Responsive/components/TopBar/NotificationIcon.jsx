import React, { useEffect, useState } from "react";
import lodash from "lodash";
import { useDataProvider, useNotify, useTranslate } from "react-admin";
import {
  Badge,
  Button,
  Divider,
  IconButton,
  Link,
  MenuItem,
  Select,
  Tooltip,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import { NOTIFICATIONS_REFRESH_TIME } from "../../../../../constants/common";

export default function NotificationsAction(props) {
  const [notifications, setNotifications] = useState(0);
  // const [timerRefresh, setTimerRefresh] = useState([]);
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const translate = useTranslate();

  useEffect(() => {
    refreshNotifications();

    //TODO add refresh
    // const timerRefresh = setInterval(() => {
    //   refreshNotifications();
    // }, NOTIFICATIONS_REFRESH_TIME);

    // setTimerRefresh(timerRefresh);

    // return () => {
    //   clearInterval(timerRefresh);
    // };
  }, []);

  const refreshNotifications = () => {
    dataProvider
      .getListOfAll("notifications", {
        filter: { is_unread: true },
        sort_field: "created_on",
      })
      .then((response) => {
        if (response && response.data) {
          const unreadMessages = response.data.filter((item) => item.is_unread);

          if (unreadMessages.length !== 0) {
            if (!lodash.isEqual(notifications, unreadMessages)) {
              showNotification(translate("messages.new_messages"));
              setNotifications(unreadMessages.length);
            }
          }
        }
      });
  };
  return (
    <Tooltip title={translate("tooltips.notifications")} placement="bottom">
      <Link href="#/notifications" underline="none">
        <IconButton color="inherit">
          <Badge badgeContent={notifications} color="primary" overlap="rectangular">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Link>
    </Tooltip>
  );
}

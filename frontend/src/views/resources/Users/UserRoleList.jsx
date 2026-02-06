import React, { useState } from "react";
import {
  BooleanField,
  Datagrid,
  EditButton,
  FunctionField,
  List,
  ShowButton,
  TextField,
  Confirm,
  useTranslate,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";
import { Button } from "@material-ui/core";
import { CheckOutlined } from "@material-ui/icons";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import moment from "moment";

function ApproveButton(props) {
  const [show, setShow] = useState(false);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const checkPermission = useCheckPermissions();
  const showNotification = useNotify();
  const refresh = useRefresh();

  function handleConfirm() {
    setShow(false);
    const params = {
      is_approved: true,
    };

    if (props && props.record && props.record.is_approved) {
      params.end_date = moment().add(-1, 'days').format("YYYY-MM-DD");
    }
    dataProvider
      .update("user-roles", {
        id: props.record.id,
        data: { ...params },
      })
      .then((result) => {
        showNotification("Delegation approved!");
        refresh();
      })
      .catch((result) => {
        showNotification("Delegation wasn`t approved!");
      });
  }

  const handleShowConfirm = (status) => () => {
    setShow(status);
  };

  return (
    <>
      <Confirm
        isOpen={show}
        title={"Approve Delegation"}
        content={"Are you sure for confirming delegation?"}
        onConfirm={handleConfirm}
        onClose={handleShowConfirm(false)}
        confirm={translate("buttons.confirm")}
        cancel={translate("buttons.cancel")}
      />
      <Button variant="text" color="primary" onClick={handleShowConfirm(true)}>
        <CheckOutlined />
        {props && props.record && props.record.is_approved
          ? translate("buttons.revoke")
          : translate("buttons.approve")}
      </Button>
    </>
  );
}

const UserRoleList = ({ translate, ...props }) => (
  <List
    resource="user-roles"
    basePath="/user-roles"
    bulkActionButtons={false}
    filter={{ 
      is_delegated: true, 
      gt_end_date: moment().format("YYYY-MM-DD") 
    }}
  >
    <Datagrid>
      <TextField source="id" />
      <BooleanField source="is_approved" />
      <FunctionField label="Role" render={(record) => record.role.name} />
      <FunctionField label="User" render={(record) => record.user.username} />
      <FunctionField
        label="Full Name"
        render={(record) => record.user.full_name}
      />
      <ApproveButton {...props} />
    </Datagrid>
  </List>
);

export default UserRoleList;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import TextFieldInput from "@material-ui/core/TextField";
import { CancelOutlined, Check } from "@material-ui/icons";
import Refresh from "@material-ui/icons/Refresh";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import lodash from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Confirm,
  DeleteButton,
  EditButton,
  FunctionField,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
  useDataProvider,
  useNotify,
  useTranslate,
} from "react-admin";
import { useSelector } from "react-redux";
import { useCheckPermissions } from "../../../helpers/checkPermission";

function DelegationPopup({users, ...props}) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const showNotification = useNotify();
  const dataProvider = useDataProvider();

  function handleClose() {
    props.onClose();
  }
  function handleSave() {
    dataProvider
      .create("user-roles", {
        data: {
          delegated_by: props.id,
          user_id: user,
          start_date: startDate,
          end_date: endDate,
          role_id: role,
          role: lodash.find(
            props.data.user_roles,
            (item) => item.role_id === role
          ),
        },
      })
      .then((response) => {
        if (response.data) {
          showNotification("Delegation created!");
          props.onClose();
        }
      })
      .catch((err) => {
        showNotification(err);
      });
  }
  function handleChange(event) {
    setUser(event.target.value);
  }

  function handleChangeRole(event) {
    setRole(event.target.value);
  }

  const handleSetDate = (type) => (event) => {
    switch (type) {
      case "startDate":
        setStartDate(event.target.value);
        break;
      case "endDate":
        setEndDate(event.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={"xs"}
      open={props.show}
      onClose={handleClose}
      style={{ overflow: "hidden" }}
      disableEscapeKeyDown
    >
      <DialogTitle>Delegation</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <TextFieldInput
          onChange={handleSetDate("startDate")}
          label="Start Date"
          type="date"
          defaultValue={startDate}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "10px" }}
        />
        <TextFieldInput
          onChange={handleSetDate("endDate")}
          label="End Date"
          type="date"
          defaultValue={endDate}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "10px" }}
        />
        <FormControl variant="outlined" style={{ marginTop: "10px" }}>
          <InputLabel
            style={{ transform: "translate(14px, -10px) scale(0.75)" }}
          >
            Username
          </InputLabel>
          <Select
            variant="standard"
            value={user}
            onChange={handleChange}
            style={{ margin: "10px" }}
          >
            {users &&
              users.map((item) => (
                <MenuItem value={item.id}>{item.full_name}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ marginTop: "10px" }}>
          <InputLabel
            style={{ transform: "translate(14px, -10px) scale(0.75)" }}
          >
            Role
          </InputLabel>
          <Select
            variant="standard"
            value={role}
            onChange={handleChangeRole}
            style={{ margin: "10px" }}
          >
            {props.data &&
              props.data.user_roles &&
              props.data.user_roles.map((item) => (
                <MenuItem value={item.role_id}>
                  {item.role && item.role.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} style={{ margin: "0px 10px" }}>
          <Check />
          Ok
        </Button>
        <Button onClick={handleClose} style={{ margin: "0px 10px" }}>
          <CancelOutlined />
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ResetPasswordPopup(props) {
  const [values, setValues] = useState({ password: "", confirm: "" });
  const translate = useTranslate();
  const showNotification = useNotify();
  const dataProvider = useDataProvider();
  const checkPermission = useCheckPermissions();

  function handleClose() {
    props.onClose();
  }

  function handleSave() {
    const regEx = /^(?=.[A-Z])(?=.[!@#$&%])(?=.[0-9])(?=.*[a-z]).{8,}$/gm;

    if (
      values.password &&
      values.confirm &&
      values.password === values.confirm &&
      !regEx.test(values.password)
    ) {
      dataProvider
        .update("users", {
          id: props.id,
          data: { password: values.password },
        })
        .then((response) => {
          if (response.data) {
            showNotification("Password changed!", "info");
            props.onClose();
          }
        })
        .catch((err) => {
          showNotification(err.message, "error");
        });
    } else {
      showNotification(
        "Password and Confirmation must be equal! And Password should contain at least eight characters, one uppercase letter, and one special character",
        "warning"
      );
    }
  }

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  return (
    <Dialog
      fullWidth
      maxWidth={"xs"}
      open={props.show}
      onClose={handleClose}
      style={{ overflow: "hidden" }}
      disableEscapeKeyDown
    >
      <DialogTitle>Password change</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Typography
          variant="caption"
          align="center"
          style={{ marginBottom: 5 }}
        >
          * Password should contain at least eight characters, one uppercase
          letter, and one special character.
        </Typography>
        <TextFieldInput
          onChange={handleChange}
          value={values.password}
          label="Password"
          name="password"
          type="password"
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "10px" }}
        />
        <TextFieldInput
          onChange={handleChange}
          value={values.confirm}
          label="Password Confirmation"
          name="confirm"
          type="password"
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "10px" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} style={{ margin: "0px 10px" }}>
          <Check />
          Ok
        </Button>
        <Button onClick={handleClose} style={{ margin: "0px 10px" }}>
          <CancelOutlined />
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const ShowActions = (props) => {
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenDelegation, setIsOpenDelegation] = useState(false);
  const [isOpenResetPassword, setIsOpenDResetPassword] = useState(false);
  const translate = useTranslate();
  const showNotification = useNotify();
  const dataProvider = useDataProvider();
  const checkPermission = useCheckPermissions();
  const isLoading = useSelector((state) => state.admin.loading);
  const [users, setUsers] = useState(null);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    dataProvider
      .getListOfAll("users", {
        sort_field: "full_name",
        filter: {
          organization_id: userInfo.organization_id,
        },
      })
      .then((response) => {
        if (response && response.data) {
          setUsers(lodash.sortBy(response.data, "full_name"));
        }
      });
  }, []);

  if (isLoading || (props && props.data && props.data.is_blocked)) return null;

  function handleConfirm(values) {
    setIsOpenConfirm(false);
    dataProvider
      .reset("users", { id: props.id })
      .then((result) => {
        showNotification("Password changed!");
      })
      .catch((result) => {
        showNotification(
          "Password wasn`t changed! " + result.body.error_message,
          "error"
        );
      });
  }

  function handleOpenConfirmation() {
    setIsOpenConfirm(true);
  }

  function handleCloseConfirmation() {
    setIsOpenConfirm(false);
  }

  function handleOpenDelegation() {
    setIsOpenDelegation(true);
  }
  function handleCloseDelegation() {
    setIsOpenDelegation(false);
  }

  function handleOpenPasswordPopup() {
    setIsOpenDResetPassword(true);
  }
  function handleClosePasswordPopup() {
    setIsOpenDResetPassword(false);
  }

  return (
    <TopToolbar>
      <Confirm
        isOpen={isOpenConfirm}
        title={translate("messages.reset_password")}
        content={translate("messages.reset_password_confirmation")}
        onConfirm={handleConfirm}
        onClose={handleCloseConfirmation}
        confirm={translate("buttons.confirm")}
        cancel={translate("buttons.cancel")}
      />
      {isOpenDelegation && (
        <DelegationPopup
          {...props}
          show={isOpenDelegation}
          onClose={handleCloseDelegation}
          users={users}
        />
      )}
      {isOpenResetPassword && (
        <ResetPasswordPopup
          {...props}
          show={isOpenResetPassword}
          onClose={handleClosePasswordPopup}
        />
      )}

      <Button
        variant="text"
        color="primary"
        onClick={handleOpenPasswordPopup}
        style={{ padding: "4px 5px" }}
      >
        <VpnKeyIcon style={{ marginRight: "5px" }} />
        Change Password
      </Button>
      {checkPermission("reset_user_password") && (
        <Button
          variant="text"
          color="primary"
          onClick={handleOpenConfirmation}
          style={{ padding: "4px 5px" }}
        >
          <Refresh style={{ marginRight: "5px" }} />
          Reset password
        </Button>
      )}

      {checkPermission("edit_delegation") && (
        <Button
          variant="text"
          color="primary"
          onClick={handleOpenDelegation}
          style={{ padding: "4px 5px" }}
        >
          <SupervisorAccountIcon style={{ marginRight: "5px" }} />
          Delegate
        </Button>
      )}
      {checkPermission("edit_users") && (
        <EditButton basePath="/users" record={props.data || props} />
      )}
      {checkPermission("delete_users") && (
        <DeleteButton basePath="/users" record={props.data || props} />
      )}
    </TopToolbar>
  );
};

const UserShow = (props) => (
  <Show {...props} actions={<ShowActions {...props} />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="full_name" />
      <TextField source="email" />
      <TextField source="phone" />
      <FunctionField
        source="organization"
        label="User Department"
        render={(record) => {
          const name =
            record.organization && record.organization.name;
          return (
            <p style={{ margin: 0 }}>
              {name != null && name !== "" ? name : "—"}
            </p>
          );
        }}
      />
      <FunctionField
        source="organization"
        label="User Vote"
        render={(record) => {
          const name =
            record.organization &&
            record.organization.parent &&
            record.organization.parent.name;
          return (
            <p style={{ margin: 0 }}>
              {name != null && name !== "" ? name : "—"}
            </p>
          );
        }}
      />
      <FunctionField
        source="user_roles"
        label="User Roles"
        render={(record) => {
          const roles = record.user_roles;
          if (!roles || !Array.isArray(roles) || roles.length === 0) {
            return <p style={{ margin: 0 }}>—</p>;
          }
          return (
            <>
              {roles.map((item, idx) => (
                <p key={item.id ?? item.role_id ?? idx} style={{ margin: 0 }}>
                  {item.role && item.role.name ? item.role.name : "—"}
                </p>
              ))}
            </>
          );
        }}
      />
    </SimpleShowLayout>
  </Show>
);

export default UserShow;

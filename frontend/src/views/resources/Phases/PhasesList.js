import React from "react";
import {
  List,
  SimpleList,
  Datagrid,
  TextField,
  usePermissions,
  BooleanField,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";
import { useMediaQuery } from "@material-ui/core";
import CustomInput from "../../components/CustomInput";

// Phases are stored in the backend `phase` table. This list at /phases is the source of truth
// for phase names and sequence (project starts from Profile, then Prefeasibility, Feasibility, etc.).

const PhasesList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  return (
    <List {...props}  bulkActionButtons={false}>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.name}
          secondaryText={(record) => `${record.id}`}
        />
      ) : (
        <Datagrid rowClick="show">
          <TextField source="id" />
          <TextField source="name" />
          <TextField source="sequence" />
        </Datagrid>
      )}
    </List>
  );
};

export default PhasesList;

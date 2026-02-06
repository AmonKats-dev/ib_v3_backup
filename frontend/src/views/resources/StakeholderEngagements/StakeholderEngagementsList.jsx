import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import moment from "moment";
import React from "react";
import {
  CreateButton,
  Datagrid,
  EditButton,
  Filter,
  List,
  ShowButton,
  TextField,
  TextInput,
  TopToolbar,
  useCreate,
  useDataProvider,
  useNotify,
  useRedirect,
} from "react-admin";
import { useCheckPermissions } from "../../../helpers/checkPermission";
import { getFiscalYearValueFromYear } from "../../../helpers/formatters";

const ListActions = ({ onCreate, onGoBack, ...props }) => {
  return (
    <TopToolbar
      style={{
        justifyContent: "space-between",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Button
        onClick={onGoBack}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddOutlinedIcon />}
        onClick={onCreate}
      >
        Create
      </Button>
    </TopToolbar>
  );
};

const ListFilters = (props) => {
  return (
    <Filter
      {...props}
      variant="outlined"
      margin="none"
      style={{ alignItems: "center", flex: "none", marginTop: 5 }}
    >
      <TextInput
        label="Report Name"
        source="name"
        alwaysOn
        variant="outlined"
        margin="none"
      />
    </Filter>
  );
};

const Empty = (props) => {
  const { loading, loaded, total } = props;
  const checkPermission = useCheckPermissions();

  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={1}>
        <Typography variant="h4" paragraph>
          There are no custom reports in the system
          <br />
          <br />
          {checkPermission("create_custom_report") && (
            <CreateButton basePath="/custom-reports" />
          )}
        </Typography>
      </Box>
    );
  }

  return <div></div>;
};

const StakeholderEngagementsList = ({ translate, ...props }) => {
  const dataProvider = useDataProvider();
  const redirectTo = useRedirect();
  const notify = useNotify();
  const checkPermission = useCheckPermissions();
  const [showYearSelector, setShowYearSelector] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState(null);
  const [create] = useCreate("cost-plans");

  function getYearsFromCurrent() {
    const currentYear = moment().startOf("year");
    const nextYear = currentYear.clone().add(1, "years");

    return [
      {
        id: moment(getFiscalYearValueFromYear(currentYear).id).format("YYYY"),
        name: getFiscalYearValueFromYear(currentYear).name,
      },
      {
        id: moment(getFiscalYearValueFromYear(nextYear).id).format("YYYY"),
        name: getFiscalYearValueFromYear(nextYear).name,
      },
    ];
  }

  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSave = (activities) => {
    create(
      {
        payload: {
          data: {
            year: Number(selectedYear),
            project_detail_id: Number(props.match?.params?.id),
            cost_plan_activities: [...activities],
            cost_plan_items: [],
          },
        },
      },
      {
        onSuccess: ({ data: newRecord }) => {
          notify("New Report Created", {});
          redirectTo(`/risk-asessments/${newRecord.id}`);
        },
      }
    );
  };

  const handleCreate = () => {
    dataProvider
      .getOne("project-details", {
        id: Number(props.match?.params?.id),
      })
      .then((response) => {
        if (response && response.data) {
          const formattedActivities = response.data.activities.map((item) => {
            item.activity_id = item.id;
            delete item.id;
            return item;
          });

          handleSave(formattedActivities);
        }
      });
  };

  return (
    <>
    <h1>{"Stakeholder Management"}</h1>
      <List
        {...props}
        empty={<Empty {...props} />}
        bulkActionButtons={false}
        actions={
          <ListActions
            {...props}
            onCreate={() => {
              redirectTo(
                `/${props.resource}/${Number(props.match?.params?.id)}/create`
              );
            }}
            onGoBack={() => {
              redirectTo(
                `/implementation-module/${Number(
                  props.match?.params?.id
                )}/costed-annualized-plan`
              );
            }}
          />
        }
        // filters={<ListFilters {...props} />}
        filter={{ project_detail_id: props.match?.params?.id }}
      >
        <Datagrid rowClick={false}>
          <TextField source="reporting_date" />
          <TextField source="reporting_quarter" />
          <TextField source="description" />
          <TextField source="impact" />
          <TextField source="score" />

          <ShowButton {...props} />
          <EditButton {...props} />
          {/* <DeleteWithConfirmButton {...props} /> */}
        </Datagrid>
      </List>
      {showYearSelector && (
        <Dialog
          fullWidth
          maxWidth={"xs"}
          open={showYearSelector}
          onClose={() => {
            setShowYearSelector(false);
          }}
          style={{ overflow: "hidden" }}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle>Create Risk Asessment</DialogTitle>
          <DialogContent>
            <Select
              fullWidth
              variant="outlined"
              value={selectedYear}
              onChange={handleChange}
            >
              {getYearsFromCurrent() &&
                getYearsFromCurrent().map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowYearSelector(false);
              }}
              label="Cancel"
              variant="outlined"
              color="primary"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              color="primary"
              variant="contained"
              startIcon={<SaveIcon />}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default StakeholderEngagementsList;

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Cancel from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { camelCase, find } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import {
  ArrayInput,
  Button,
  Edit,
  FormDataConsumer,
  minValue,
  NumberInput,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  Toolbar,
  TopToolbar,
  useDataProvider,
  useNotify,
  useRefresh,
  useTranslate,
  useRedirect,
} from "react-admin";
import { useHistory } from "react-router-dom";
import { checkFeature } from "../../../helpers/checkPermission";
import ProjectResourcesManagmentForm from "../../pages/gantt/ProjectResourcesManagmentForm";
import ProjectResourcesManagmentFormPimis from "../../pages/gantt/ProjectResourcesManagmentFormPimis";
import CustomShowButton from "../Projects/Actions/Buttons/CustomShowButton";
import ResourceDialog from "./ResourceDialog";

var humanResourcesDict = [
  {
    id: 1,
    text: "Senior Procurement Specialist",
    parent: null,
  },
  {
    id: 2,
    text: "Procurement Specialist",
    parent: null,
  },
  {
    id: 3,
    text: "Project Manager",
    parent: null,
  },
  {
    id: 4,
    text: "Senior Engineer",
    parent: null,
  },
  {
    id: 5,
    text: "Engineer",
    parent: null,
  },
  {
    id: 6,
    text: "Surveyor",
    parent: null,
  },
  {
    id: 7,
    text: "Cost Estimator",
    parent: null,
  },
  {
    id: 8,
    text: "Works Supervisor",
    parent: null,
  },
  {
    id: 9,
    text: "Technical Advisor",
    parent: null,
  },
  {
    id: 10,
    text: "Special Advisor",
    parent: null,
  },
  {
    id: 11,
    text: "System Architect",
    parent: null,
  },
  {
    id: 12,
    text: "Data Analyst",
    parent: null,
  },
  {
    id: 13,
    text: "Licensed Training Provider",
    parent: null,
  },
  { id: 14, text: "Other", parent: null },

  { id: 15, text: "Unassigned", parent: 14, default: true },
];

const PostEditActions = ({
  basePath,
  data,
  resource,
  handleOpen,
  ...props
}) => {
  const redirect = useRedirect();
  return (
    <TopToolbar>
      {/* <Button
        record={data && data.project}
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => {
          redirect(
              `/implementation-module/${Number(
              props.projectDetailId
              )}/costed-annualized-plan`
          );
          }}
        label="Back"
      /> */}
      <CustomShowButton
        basePath={"/projects"}
        record={data && data.project}
        label="Back to Project Summary" //Amon
      />
      <Button onClick={() => handleOpen("resources")} label="Create Resource">
        <AssessmentIcon />
      </Button>
    </TopToolbar>
  );
};

const ProjectManagementEdit = (props) => {
  const [show, setShow] = useState(false);
  let history = useHistory();
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const translate = useTranslate();
  const refresh = useRefresh();
  const [humanResources, setHumanResources] = useState([]);

  useEffect(() => {
    dataProvider
      .getListOfAll("parameters", { sort_field: "id" })
      .then((response) => {
        if (response && response.data) {
          const params = find(
            response.data,
            (it) => it.param_key === "human_resource"
          );
          if (params && params.param_value) {
            setHumanResources(
              params.param_value.map((item) => {
                return {
                  id: camelCase(item),
                  text: item,
                  parent: null,
                };
              })
            );
          }
        }
      });
  }, []);

  function handleClose() {
    setShow(false);
  }

  function handleSave(values) {
    localStorage.setItem("staff", JSON.stringify(values.staff));
    setShow(false);
  }
  function handleOpen(type) {
    setShow(type);
  }

  useEffect(() => {
    localStorage.removeItem("task");
    localStorage.removeItem("link");
    localStorage.removeItem("staff");

    return () => {
      localStorage.removeItem("task");
      localStorage.removeItem("link");
      localStorage.removeItem("staff");
    };
  }, []);

  const handleUpdate = (data) => {
    const task =
      localStorage.getItem("task") && JSON.parse(localStorage.getItem("task"));
    const staff =
      localStorage.getItem("staff") &&
      JSON.parse(localStorage.getItem("staff"));
    const link =
      localStorage.getItem("link") && JSON.parse(localStorage.getItem("link"));

    const requestParams = {
      data: {
        ...data,
        task: task || data?.task || [],
        staff: staff || data?.staff || [],
        link: link || data?.link || [],
      },
      id: props.id,
    };

    dataProvider
      .update(props.resource, requestParams)
      .then((response) => {
        if (response) {
          showNotification(translate("messages.project_management_saved"));
          refresh();
        }
      })
      .catch((err) => {
        showNotification(err.message, "warning");
      });
  };

  return (
    <Edit
      {...props}
      undoable={false}
      redirect={false}
      actions={<PostEditActions handleOpen={handleOpen} {...props} />}
    >
      <EditForm
        {...props}
        show={show}
        humanResources={humanResources}
        onSave={handleUpdate}
        onClose={handleClose}
      />
    </Edit>
  );
};

const EditForm = ({ show, humanResources, onSave, onClose, ...props }) => {
  return (
    <SimpleForm
      {...props}
      validate={false}
      redirect={false}
      toolbar={
        <Toolbar>
          <FormDataConsumer>
            {({ formData, scopedFormData, getSource, ...rest }) => {
              return (
                <Button
                  style={{
                    marginLeft: 10,
                    height: 36,
                    backgroundColor: "green",
                  }}
                  variant="contained"
                  onClick={() => onSave(formData)}
                  label="Save Changes"
                >
                  <SaveIcon />
                </Button>
              );
            }}
          </FormDataConsumer>

          <Button
            style={{ marginLeft: 10, height: 36, backgroundColor: "#c55c5e" }}
            variant="contained"
            onClick={() => {
              localStorage.removeItem("task");
              localStorage.removeItem("link");
              localStorage.removeItem("staff");
            }}
            label="Discard Changes"
          >
            <Cancel />
          </Button>
        </Toolbar>
      }
    >
      <FormDataConsumer>
        {({ formData, scopedFormData, getSource, ...rest }) => {
          return checkFeature("has_pimis_fields") ? (
            <ProjectResourcesManagmentFormPimis
              {...formData}
              onSave={onSave}
              humanResources={humanResources}
              show={show}
              onClose={onClose}
            />
          ) : (
            <>
              <ProjectResourcesManagmentForm
                {...formData}
                onSave={onSave}
                humanResources={humanResourcesDict}
                show={show}
                onClose={onClose}
              />
              {/* {show && (
                <ResourceDialog
                  {...props}
                  humanResources={humanResources}
                  onClose={onClose}
                />
              )} */}
            </>
          );
        }}
      </FormDataConsumer>
    </SimpleForm>
  );
};

export default ProjectManagementEdit;

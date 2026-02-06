import React, { Fragment, useEffect, useState } from "react";
import {
  Edit,
  TextInput,
  SimpleFormIterator,
  NumberInput,
  FormDataConsumer,
  SelectInput,
  ReferenceInput,
  SimpleForm,
  SaveButton,
  ArrayInput,
  SelectArrayInput,
  Toolbar,
  minValue,
  Button,
  TopToolbar,
} from "react-admin";
import AssessmentIcon from "@material-ui/icons/Assessment";
import Cancel from "@material-ui/icons/Cancel";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
} from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import { useFormState } from "react-final-form";
import GanttChartView from "../../pages/gantt/GantChart";
import ProjectResourcesManagment from "../../pages/gantt/ProjectResourcesManagment";
import ProjectResourcesManagmentForm from "../../pages/gantt/ProjectResourcesManagmentForm";
import CustomShowButton from "../Projects/Actions/Buttons/CustomShowButton";
import { useHistory } from "react-router-dom";

const DEPARTMENTS = [
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
];

const ProjectManagementCreateForm = (props) => {
  const [show, setShow] = useState(false);
  let history = useHistory();

  function handleClose() {
    setShow(false);
  }

  function handleSave(values) {
    return () => {
      setShow(false);
    };
  }
  function handleOpen() {
    setShow(true);
  }

  useEffect(() => {
    localStorage.removeItem("task");
    localStorage.removeItem("link");
    localStorage.removeItem("staff");
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("task");
      localStorage.removeItem("link");
      localStorage.removeItem("staff");
    };
  }, []);

  return (
    <Edit
      {...props}
      undoable={false}
      redirect={false}
      // actions={<PostEditActions handleOpen={handleOpen} />}
    >
      <SimpleForm
        redirect={false}
        toolbar={
          <Toolbar>
            <SaveButton
              label="Save"
              transform={(data) => ({
                ...data,
                task: JSON.parse(localStorage.getItem("task")),
                staff: JSON.parse(localStorage.getItem("staff")),
                link: JSON.parse(localStorage.getItem("link")),
              })}
              submitOnEnter={false}
              redirect={false}
            />
            <Button
              style={{ marginLeft: 10, height: 36, backgroundColor: "#c55c5e" }}
              variant="contained"
              onClick={() => {
                history.go(0);
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
            return <ProjectResourcesManagmentForm {...formData} />;
          }}
        </FormDataConsumer>

        <Dialog
          fullWidth
          maxWidth={"md"}
          open={show}
          onClose={handleClose}
          style={{ overflow: "hidden" }}
        >
          <DialogTitle>Project’s Human Resources</DialogTitle>
          <DialogContent>
            <ArrayInput source="staff" label={false}>
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ formData, scopedFormData, getSource, ...rest }) => {
                    if (scopedFormData && !scopedFormData.id) {
                      scopedFormData.id = Date.now();
                    }

                    localStorage.setItem(
                      "staff",
                      JSON.stringify(formData.staff)
                    );

                    return (
                      <Fragment>
                        <SelectInput
                          options={{ fullWidth: true }}
                          label={"Labor Category"}
                          variant="outlined"
                          margin="none"
                          source={getSource("parent")}
                          choices={DEPARTMENTS}
                          optionValue="id"
                          optionText="text"
                        />
                        <TextInput
                          options={{ fullWidth: true }}
                          label={"Full Name"}
                          source={getSource("text")}
                          variant="outlined"
                          margin="none"
                        />
                        <NumberInput
                          options={{ fullWidth: true }}
                          label={"Monthly Availability"}
                          source={getSource("capacity")}
                          variant="outlined"
                          margin="none"
                          validate={[minValue(1)]}
                        />
                      </Fragment>
                    );
                  }}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </DialogContent>
          <DialogActions>
            <FormDataConsumer>
              {({ formData, scopedFormData, getSource, ...rest }) => (
                <Button
                  variant="contained"
                  onClick={handleSave(formData)}
                  label="Save Changes"
                ></Button>
              )}
            </FormDataConsumer>
          </DialogActions>
        </Dialog>
      </SimpleForm>
    </Edit>
  );
};

export default ProjectManagementCreateForm;

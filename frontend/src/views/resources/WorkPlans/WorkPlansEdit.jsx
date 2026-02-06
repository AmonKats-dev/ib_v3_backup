import React, { useEffect } from "react";
import {
  Edit,
  Button,
  useDataProvider,
  useEditController,
  TopToolbar,
  useRedirect,
} from "react-admin";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import WorkPlansEditForm from "./WorkPlansEditForm";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useDispatch } from "react-redux";

const Actions = (props) => {
  const redirect = useRedirect();
  return (
    <TopToolbar style={{ display: "flex", justifyContent: "flex-start" }}>
      <Button
        onClick={() => {
          redirect(`/cost-plans/${props.projectId}/show`);
        }}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
      />
    </TopToolbar>
  );
};

const WorkPlansEdit = (props) => {
  const [projectDetails, setProjectDetails] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const dataProvider = useDataProvider();
  const editControllerProps = useEditController(props);
  const { record } = editControllerProps;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "SET_PROJECT_TITLE_HEADER",
      payload: {
        data: `${projectDetails?.project?.name}`,
      },
    });

  return () => {
    dispatch({
      type: "SET_PROJECT_TITLE_HEADER",
      payload: {
        data: "",
      },
    });
  };
}, [projectDetails?.project?.name]);

  React.useEffect(() => {
    if (record) {
      dataProvider
        .getOne("project-details", {
          id: record.project_detail_id,
        })
        .then((response) => {
          if (response && response.data) {
            setProjectDetails(formatValuesToQuery({ ...response.data }));

            dataProvider
              .getOne("projects", {
                id: response.data.project_id,
              })
              .then((res) => {
                if (res && res.data) {
                  setProject(formatValuesToQuery({ ...res.data }));
                }
              });
          }
        });
    }
  }, [record, dataProvider]);

  return (
    <Edit
      {...props}
      actions={<Actions projectId={project?.id} />}
      undoable={false}
    >
      <WorkPlansEditForm projectDetails={projectDetails} project={project} />
    </Edit>
  );
};

export default WorkPlansEdit;

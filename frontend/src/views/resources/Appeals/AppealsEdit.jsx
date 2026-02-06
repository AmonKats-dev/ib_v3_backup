import React from "react";
import {
  Edit,
  Button,
  useDataProvider,
  useEditController,
  TopToolbar,
  useRedirect,
} from "react-admin";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import AppealsEditForm from "./AppealsEditForm";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const Actions = (props) => {
  const history = useHistory();
  const redirect = useRedirect();

  return (
    <TopToolbar style={{ display: "flex", justifyContent: "flex-start" }}>
      <Button
        onClick={() => {
          redirect(`${props.basePath}/${props.projectDetailId}/list`);
        }}
        label="Back"
        color="primary"
        startIcon={<ArrowBackIcon />}
      />
    </TopToolbar>
  );
};

const AppealsEdit = (props) => {
  const [projectDetails, setProjectDetails] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const dataProvider = useDataProvider();
  const editControllerProps = useEditController(props);
  const { record } = editControllerProps;

  React.useEffect(() => {
    if (record)
      dataProvider
        .getOne("projects", {
          id: record?.project_id,
        })
        .then((resp) => {
          if (resp && resp.data) {
            setProject(resp.data);

            dataProvider
              .getOne("project-details", {
                id: resp.data.current_project_detail.id,
              })
              .then((res) => {
                if (res && res.data) {
                  setProjectDetails(res.data);
                }
              });
          }
        });
  }, [dataProvider, record]);

  return (
    <Edit
      {...props}
      actions={<Actions projectDetailId={projectDetails?.id} />}
      undoable={false}
    >
      <AppealsEditForm projectDetails={projectDetails} project={project} />
    </Edit>
  );
};

export default AppealsEdit;

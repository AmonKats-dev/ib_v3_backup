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
import RiskAsessmentsEditForm from "./StakeholderEngagementsEditForm";
import { useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const Actions = (props) => {
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

const CostPlansEdit = (props) => {
  const [projectDetails, setProjectDetails] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const dataProvider = useDataProvider();
  const editControllerProps = useEditController(props);
  const { record } = editControllerProps;

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
      actions={<Actions projectDetailId={projectDetails?.id} />}
      undoable={false}
    >
      <RiskAsessmentsEditForm
        projectDetails={projectDetails}
        project={project}
      />
    </Edit>
  );
};

export default CostPlansEdit;

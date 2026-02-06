import * as React from "react";

import {
  Button,
  Datagrid,
  FunctionField,
  List,
  Pagination,
  TextField,
  Title,
  useDataProvider,
  useListContext,
  useTranslate,
  useNotify,
  useRefresh,
  useUnselectAll,
} from "react-admin";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@material-ui/core";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { dateFormatter } from "../../../helpers";
import lodash, { difference } from "lodash";
import { makeStyles } from "@material-ui/core";
import AsideChart from "./AsideChart";
import ExportActions from "./ExportActions";
import { EXPORT_TYPES } from "../../../constants/common";
import { getFeatureValue } from "../../../helpers/checkPermission";
import AsideRankData from "./AsideRankData";
import FilesUploaderSection from "../../resources/Projects/Actions/Buttons/ActionButton/FilesUploaderSection";
import FileUploader from "../../components/FileUploader";

const useStyles = makeStyles((theme) => ({
  topGroup: {
    display: "flex",
    justifyContent: "space-around",
  },
  title: {
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "bold",
    paddingLeft: "30px",
    margin: "10px auto",
  },
  card: {
    width: "100%",
    "& .MuiTableCell-paddingCheckbox": {
      verticalAlign: "middle",
    },
    "& .MuiTableCell-sizeSmall": {
      verticalAlign: "middle",
    },
    "& .MuiTableSortLabel-root": {
      lineHeight: "18px",
    },
  },
}));

const EmptyDashboard = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

const BulkActions = (props) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [approvedUpload, setApprovedUpload] = React.useState(false);
  const [fileSelected, setFileSelected] = React.useState(false);
  const [fileUploaded, setFileUploaded] = React.useState(false);
  const dataProvider = useDataProvider();
  const showNotification = useNotify();
  const refresh = useRefresh();
  const unselectAll = useUnselectAll();

  const { data } = useListContext();
  const handleClick = () => {
    setShowDialog(true);
  };

  const handleApprove = () => {
    setApprovedUpload(true);
    handleFileUpload();
  };

  const handleHideDialog = () => setShowDialog(false);

  function handleDeleteSelected() {
    setFileSelected(false);
  }

  function handleFileSelect() {
    setFileSelected(true);
  }

  function handleFileUpload(file) {
    setFileUploaded(file);

    const params = {
      data: {
        action: "APPROVE",
        project_ids: props.selectedIds,
      },
    };

    dataProvider.ranking(params).then((response) => {
      if (!response) {
        showNotification("Approving fails, please try again later!", "warning");
      }
      if (response && response.data.length !== props.selectedIds.length) {
        const diff = lodash
          .difference(props.selectedIds, response)
          .map((item) => {
            return `${data[item].code} - ${data[item].name}`;
          });
        const message = `This project wasn't approved: ${diff.join(", ")}`;

        showNotification(message, "warning");
      } else {
        showNotification("All projects was approved", "success");
      }

      unselectAll("projects");
      refresh();
      handleHideDialog();

      const projects = Object.keys(data).map((n) => Number(n));
      const approved = difference(props.selectedIds, response);
      const notSelectedProjects = difference(projects, approved);

      if (notSelectedProjects?.length > 0) {
        dataProvider.notificationsSet({
          data: {
            projects: notSelectedProjects.map((item) => ({
              id: data[item]?.id,
              created_by: data[item]?.created_by,
              project_status: "IN_PIPELINE",
            })),
          },
        });
      }
    });
  }

  const record = props.selectedIds.length > 0 ? data[props.selectedIds[0]] : {};
  const translate = useTranslate();

  return (
    <>
      <Button label="Approve" onClick={handleClick} />
      <Dialog fullWidth open={showDialog} onClose={handleHideDialog}>
        <DialogContent>
          <div>
            <FileUploader
              meta={{
                current_step: 18, // Ranking phase timeline step
                phase_id: 5, // Ranking phase ID
                ranking_report: true,
              }}
              resource="timeline"
              entityIds={props.selectedIds}
              fileTypeId={15}
              placeholder={translate("titles.drop_files")}
              approvedUploading={approvedUpload}
              onDelete={() => handleFileUpload()}
              onFileSelect={handleFileSelect}
              onFileDelete={handleDeleteSelected}
              onFileUpload={handleFileUpload}
              noRefreshOnDelete
            />
          </div>
          <div>
            <h3>Approving list of projects</h3>
            <ul>
              {props.selectedIds.map((projId) => (
                <li key={projId}>
                  {data[projId] &&
                    `${data[projId].code} - ${data[projId].name}`}
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>

        <DialogActions>
          <>
            <Button
              label="Confirm"
              onClick={handleApprove}
              // disabled={!fileSelected}
            />
            <Button label="Cancel" onClick={handleHideDialog} />
          </>
        </DialogActions>
      </Dialog>
    </>
  );
};

function RankingProjectsReport(props) {
  const translate = useTranslate();
  const classes = useStyles();
  // const dataProvider = useDataProvider();
  // const PIPELINE_PHASE_ID = getFeatureValue("has_pipeline_report") || -1;

  return (
    <Grid container spacing={3}>
      <ExportActions
        reportId="report-container"
        title="Projects Ranking Report"
        exportTypes={[EXPORT_TYPES.WORD, EXPORT_TYPES.PDF, EXPORT_TYPES.XLS]}
      />
      <Grid item xs={12} id="report-container">
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {"Projects Ranking Report"}
        </Typography>
        <Card className={classes.card}>
          <List
            {...props}
            basePath="/projects"
            resource="projects"
            bulkActionButtons={false}
            actions={<></>}
            filter={{ ranking_score: 1 }}
            perPage={25}
            sort={{ field: "ranking_score", order: "DESC" }}
            pagination={<EmptyDashboard />}
            className="report-page"
            hasCreate={false}
            
          >
            <Datagrid rowClick={"show"} expand={<AsideRankData {...props} />}>
              <TextField source="code" />
              <TextField source="name" />
              <FunctionField
                source="created_on"
                label={translate(`resources.projects.fields.created_at`)}
                render={(record) =>
                  record ? dateFormatter(record.created_on) : null
                }
              />
              <FunctionField
                source="status"
                label={translate(`resources.projects.fields.status`)}
                render={(record) =>
                  record
                    ? translate(
                        `timeline.${record.project_status.toLowerCase()}`
                      )
                    : null
                }
              />
              <FunctionField
                source="status"
                label={translate(`resources.projects.fields.phase_id`)}
                render={(record) =>
                  record ? record.phase && record.phase.name : null
                }
              />
              <TextField source="ranking_score" />
            </Datagrid>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default RankingProjectsReport;

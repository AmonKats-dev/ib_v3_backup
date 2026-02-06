// in src/Dashboard.js
import * as React from "react";

import {
  Datagrid,
  FunctionField,
  List,
  Pagination,
  TextField,
  Title,
  SelectInput,
  useDataProvider,
  useTranslate,
  useRedirect,
  useListContext,
  TextInput,
  Edit,
  Button,
  SimpleForm,
  FormDataConsumer,
  Toolbar,
  SaveButton,
} from "react-admin";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Divider,
} from "@material-ui/core";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
// import { dateFormatter } from "../../../helpers";
import lodash from "lodash";
import { makeStyles } from "@material-ui/core";
import { dateFormatter } from "../../../helpers";
import CustomInput from "../../components/CustomInput";
// import { EXPORT_TYPES } from "../../../constants/common";
// import ExportActions from "./ExportActions";
// import { costSumFormatter } from "../../resources/Projects/Report/helpers";

const RANKING_SCORE = [
  { id: 5, name: "High" },
  { id: 3, name: "Medium" },
  { id: 1, name: "Low" },
  { id: 0, name: "Not Applicable" },
];

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
}));

const EmptyDashboard = (props) => {
  const { loading, loaded, total } = props;
  if (total === 0 && !loading && loaded) {
    return (
      <Box textAlign="center" m={3}>
        <Typography variant="h5" paragraph>
          No projects are in Completed status
        </Typography>
      </Box>
    );
  }
  return <Pagination {...props} />;
};

function Actions(props) {
  return (
    <Toolbar {...props}>
      <SaveButton />
    </Toolbar>
  );
}

function RankingProjectsList(props) {
  const translate = useTranslate();
  const classes = useStyles();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();

  const handleRedirect = (id) => () => {
    redirect(`/ranking`);
  };

  const Projects = () => {
    const [showPopup, setShowPopup] = React.useState(false);
    const { ids, data, basePath } = useListContext();

    const handleClick = (id) => (event) => {
      event.stopPropagation();
      setShowPopup(id);
    };

    function handleClose() {
      setShowPopup(false);
    }

    return (
      <div style={{ margin: "2em", overflow: "auto" }}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          {"Rank Projects"}
        </Typography>
        <Table style={{ overflow: "auto" }}>
          <TableHead>
            <TableRow className={classes.filledRow}>
              <TableCell style={{ minWidth: 150 }}>Project Code</TableCell>
              <TableCell style={{ minWidth: 350 }}>Project Title</TableCell>
              <TableCell style={{ minWidth: 150 }}>Submission Date</TableCell>
              <TableCell style={{ minWidth: 150 }}>Created By</TableCell>
              <TableCell style={{ minWidth: 150 }}>Status</TableCell>
              <TableCell style={{ minWidth: 100 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ids.map((id) => {
              const projectData = data[id];

              return (
                <TableRow key={projectData.id}>
                  <TableCell>{`${projectData.code}`}</TableCell>
                  <TableCell>{`${projectData.name}`}</TableCell>
                  <TableCell>{`${dateFormatter(
                    projectData.submission_date
                  )}`}</TableCell>

                  <TableCell>{`${
                    projectData.user && projectData.user.full_name
                  }`}</TableCell>
                  <TableCell>{`${translate(
                    `timeline.${projectData.project_status.toLowerCase()}`
                  )}`}</TableCell>
                  <TableCell>
                    {!projectData.ranking_score && (
                      <Button
                        label="Rank"
                        onClick={handleClick(projectData.id)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Dialog
          fullWidth
          maxWidth={"lg"}
          open={showPopup}
          onClose={handleClose}
          style={{ overflow: "hidden" }}
          onBackdropClick={() => {
            setShowPopup(false);
          }}
        >
          <DialogTitle>
            <h2>{data[showPopup] && data[showPopup].name}</h2>
          </DialogTitle>
          <DialogContent style={{ padding: "5px 15px 15px 15px" }}>
            {showPopup && (
              <Edit
                basePath="/projects"
                resource="projects"
                id={showPopup}
                hasEdit
                actions={false}
                redirect={`/ranking`}
              >
                <SimpleForm toolbar={<Actions />} redirect={`/ranking`}>
                  <Typography
                    variant="h5"
                    style={{ marginLeft: 15, marginBottom: 20, width: "100%" }}
                  >
                    Strategic alignment to NDP and Vision 2040{" "}
                  </Typography>
                  <Divider
                    style={{ width: "100%", height: 2, margin: "10px auto" }}
                  />
                  <Grid container style={{ width: "100%" }} spacing={3}>
                    <Grid item xs={12} spacing={12}>
                      <Typography
                        variant="body1"
                        style={{
                          width: "100%",
                        }}
                      >
                        Alignment to the National Development Plan (strategic
                        fit) NDP III has categorised projects according to their
                        prioritisation.
                      </Typography>
                    </Grid>
                    <Grid item xs={3} spacing={3}>
                      <CustomInput
                        bool
                        tooltipText="Score High for NDP III core project.
                        Score Medium for presidential directive, Parliament, Regional projects such as EAC, COMESA and AU.
                        Score Low for Other NDP III projects.
                        "
                      >
                        <SelectInput
                          label={"Ranking"}
                          variant="outlined"
                          margin="none"
                          options={{ fullWidth: "true" }}
                          className="boolean-selector"
                          source={"ranking_data.strategic_fit.score"}
                          choices={RANKING_SCORE}
                          fullWidth
                        />
                      </CustomInput>
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput
                        source={"ranking_data.strategic_fit.comments"}
                        label={"Comments"}
                        rows={3}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        multiline
                        rowsMax={3}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ width: "100%" }} spacing={3}>
                    <Grid item xs={12} spacing={12}>
                      <Typography
                        variant="body1"
                        style={{
                          width: "100%",
                        }}
                      >
                        Regional Balance: Interventions that directly target
                        growth in key highly poverty hit regions as identified
                        in the NDP III.{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} spacing={3}>
                      <CustomInput
                        bool
                        tooltipText="Score High for interventions targeting regions of Bukedi, Busoga, Bugisu, Karamoja, Teso, West Nile, Acholi and Bunyoro, 
Score Medium for interventions that include these regions among others in target beneficiaries, 
Score Low rank to projects with no intervention in these areas.
"
                      >
                        <SelectInput
                          label={"Ranking"}
                          variant="outlined"
                          margin="none"
                          options={{ fullWidth: "true" }}
                          className="boolean-selector"
                          source={"ranking_data.inclusive_growth.score"}
                          choices={RANKING_SCORE}
                          fullWidth
                        />
                      </CustomInput>
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput
                        source={"ranking_data.inclusive_growth.comments"}
                        label={"Comments"}
                        rows={3}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        multiline
                        rowsMax={3}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ width: "100%" }} spacing={3}>
                    <Grid item xs={12} spacing={12}>
                      <Typography
                        variant="body1"
                        style={{
                          width: "100%",
                        }}
                      >
                        Economic impact to the Country: Demonstrate good use of
                        public resources from a macroeconomic point of view.{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} spacing={3}>
                      <CustomInput
                        bool
                        tooltipText="Score High for projects in the pipeline category whose ENPV or CEA lies in the 75th percentile of the projects in the pipeline.
Score Medium for projects whose ENPV or CEA lies in the 50th percentile of projects in the pipeline.
Score Low for projects whose ENPV or CEA lies in the 25th percentile of the projects in the pipeline. 
"
                      >
                        <SelectInput
                          label={"Ranking"}
                          variant="outlined"
                          margin="none"
                          options={{ fullWidth: "true" }}
                          className="boolean-selector"
                          source={"ranking_data.economic.score"}
                          choices={RANKING_SCORE}
                          fullWidth
                        />
                      </CustomInput>
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput
                        source={"ranking_data.economic.comments"}
                        label={"Comments"}
                        rows={3}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        multiline
                        rowsMax={3}
                      />
                    </Grid>
                  </Grid>

                  <Typography
                    variant="h5"
                    style={{ marginLeft: 15, marginBottom: 20, width: "100%" }}
                  >
                    Implementation Readiness: This looks at variables which
                    relate to land acquisition and right of way, legal
                    requirements, availability of required equipment, human
                    resource, clearance from various stakeholders among others{" "}
                  </Typography>
                  <Divider
                    style={{ width: "100%", height: 2, margin: "10px auto" }}
                  />
                  <Grid container style={{ width: "100%" }} spacing={3}>
                    <Grid item xs={12} spacing={12}>
                      <Typography
                        variant="body1"
                        style={{
                          width: "100%",
                        }}
                      >
                        Land acquisition and Right of way: Highly impacts
                        project costs and duration
                      </Typography>
                    </Grid>
                    <Grid item xs={3} spacing={3}>
                      <CustomInput
                        bool
                        tooltipText="Score High for projects that have completed the land acquisition or undertaken RAP and those that do not require RAP or land acquisition.
Score Medium for projects with evidence for commencing land acquisition process, have not concluded but have initiated the land acquisition process.
Score 0 for projects without evidence of commencement on land acquisition/right of way processes yet will require it.
"
                      >
                        <SelectInput
                          label={"Ranking"}
                          variant="outlined"
                          margin="none"
                          options={{ fullWidth: "true" }}
                          className="boolean-selector"
                          source={"ranking_data.land_acquisition.score"}
                          choices={RANKING_SCORE}
                          fullWidth
                        />
                      </CustomInput>
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput
                        source={"ranking_data.land_acquisition.comments"}
                        label={"Comments"}
                        rows={3}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        multiline
                        rowsMax={3}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ width: "100%" }} spacing={3}>
                    <Grid item xs={12} spacing={12}>
                      <Typography
                        variant="body1"
                        style={{
                          width: "100%",
                        }}
                      >
                        Developed and Quality work, procurement and
                        implementation plan
                      </Typography>
                    </Grid>
                    <Grid item xs={3} spacing={3}>
                      <CustomInput
                        bool
                        tooltipText="Score High for projects with a feasible and quality work, procurement and implementation plan.
Score Medium for projects that have commenced developing of the plans.
Score 0 for projects that have not commenced developing a work, procurement and implementation plan.
"
                      >
                        <SelectInput
                          label={"Ranking"}
                          variant="outlined"
                          margin="none"
                          options={{ fullWidth: "true" }}
                          className="boolean-selector"
                          source={"ranking_data.procurement.score"}
                          choices={RANKING_SCORE}
                          fullWidth
                        />
                      </CustomInput>
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput
                        source={"ranking_data.procurement.comments"}
                        label={"Comments"}
                        rows={3}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        multiline
                        rowsMax={3}
                      />
                    </Grid>
                  </Grid>

                  <Typography
                    variant="h5"
                    style={{ marginLeft: 15, marginBottom: 20, width: "100%" }}
                  >
                    Budgeting readiness and Overall MTEF requirement: This
                    relates to parameters that influence inclusion into the
                    resource envelope{" "}
                  </Typography>
                  <Divider
                    style={{ width: "100%", height: 2, margin: "10px auto" }}
                  />

                  <Grid container style={{ width: "100%" }} spacing={3}>
                    <Grid item xs={12} spacing={12}>
                      <Typography
                        variant="body1"
                        style={{
                          width: "100%",
                        }}
                      >
                        Disbursement readiness : Ascertain disbursement
                        readiness for projects targeting external financing.
                      </Typography>
                    </Grid>
                    <Grid item xs={3} spacing={3}>
                      <CustomInput
                        bool
                        tooltipText="Score High for projects that have completed the loan/grants acquisition cycle whose disbursement is ready and only awaiting a code. GoU projects that can adequately be accommodated within the available fiscal space will equally Score High for under this category otherwise score as in category (ii) on multiyear requirements.
Score Medium for projects which are under consideration for loan financing but have not yet concluded the process (Projects yet to be submitted to Parliament for consideration). 
Score 0 for projects that have been ear marked for external financing but are still at negotiation stage or those that have not commenced negotiation.
"
                      >
                        <SelectInput
                          label={"Ranking"}
                          variant="outlined"
                          margin="none"
                          options={{ fullWidth: "true" }}
                          className="boolean-selector"
                          source={"ranking_data.loan_negotiation.score"}
                          choices={RANKING_SCORE}
                          fullWidth
                        />
                      </CustomInput>
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput
                        source={"ranking_data.loan_negotiation.comments"}
                        label={"Comments"}
                        rows={3}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        multiline
                        rowsMax={3}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ width: "100%" }} spacing={3}>
                    <Grid item xs={12} spacing={12}>
                      <Typography
                        variant="body1"
                        style={{
                          width: "100%",
                        }}
                      >
                        Multiyear project requirements including counterpart
                        requirement vs available fiscal space in the MTEF.{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} spacing={3}>
                      <CustomInput
                        bool
                        tooltipText="Score High for projects whose Multiyear project requirements falls within 1/3 of the available fiscal space in the MTEF.
Score Medium for projects whose multiyear requirements resource are 50% of the available fiscal space in the MTEF.
Score Low for projects whose requirements are 100% (equal to) the available fiscal scape in the MTEF.
"
                      >
                        <SelectInput
                          label={"Ranking"}
                          variant="outlined"
                          margin="none"
                          options={{ fullWidth: "true" }}
                          className="boolean-selector"
                          source={"ranking_data.fiscal_space.score"}
                          choices={RANKING_SCORE}
                          fullWidth
                        />
                      </CustomInput>
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput
                        source={"ranking_data.fiscal_space.comments"}
                        label={"Comments"}
                        rows={3}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        multiline
                        rowsMax={3}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ width: "100%" }} spacing={3}>
                    <Grid item xs={12} spacing={12}>
                      <Typography
                        variant="body1"
                        style={{
                          width: "100%",
                        }}
                      >
                        Interlinkages within the programme: Need to maximise
                        coordination of projects within the programme to
                        leverage time, money, and resources.{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} spacing={3}>
                      <CustomInput
                        bool
                        tooltipText="Score High for interventions that maximize linkages with other votes within the program in terms of geographical proximity of interventions, sequencing and timing of other interventions within the vicinity, dependency on the completion of other projects, economies of scale opportunities, e.tc.
Score Medium for projects with moderate level of interlinkages within the programs (Linkage with above 3 votes within a program.  
Score Low for projects with no evidence of interlinkages with other votes within the program.
"
                      >
                        <SelectInput
                          label={"Ranking"}
                          variant="outlined"
                          margin="none"
                          options={{ fullWidth: "true" }}
                          className="boolean-selector"
                          source={"ranking_data.interlinkages.score"}
                          choices={RANKING_SCORE}
                          fullWidth
                        />
                      </CustomInput>
                    </Grid>
                    <Grid item xs={6}>
                      <TextInput
                        source={"ranking_data.interlinkages.comments"}
                        label={"Comments"}
                        rows={3}
                        variant="outlined"
                        margin="none"
                        fullWidth
                        multiline
                        rowsMax={3}
                      />
                    </Grid>
                  </Grid>

                  <FormDataConsumer>
                    {({ getSource, scopedFormData, formData, ...rest }) => {
                      if (formData) {
                        formData.ranking_score = lodash.sumBy(
                          lodash.keys(formData.ranking_data),
                          (key) => formData.ranking_data[key].score
                        );
                      }
                      return null;
                      // return formData ? (
                      //   <p>Total Score - {formData.ranking_score}</p>
                      // ) : null;
                    }}
                  </FormDataConsumer>
                </SimpleForm>
              </Edit>
            )}{" "}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <Grid container spacing={3}>
      <Card style={{ overflow: "auto" }}>
        <List
          {...props}
          basePath="/projects"
          resource="projects"
          bulkActionButtons={false}
          actions={false}
          filter={{ phase_id: 5, current_step: 19 }}
          pagination={<EmptyDashboard />}
          sort={{ field: "id", order: "DESC" }}
        >
          <Projects />
        </List>
      </Card>
    </Grid>
  );
}

export default RankingProjectsList;

import moment from "moment";
import React, { useState } from "react";
import {
  Create,
  DateInput,
  FormDataConsumer,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useDataProvider,
  useTranslate,
} from "react-admin";
import { QUARTERS } from "../../../constants/common";
import {
  getFiscalYearsRangeForIntervals,
  getFiscalYearValueFromYear,
} from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomTextArea from "../../components/CustomTextArea";
import CustomToolbar from "../../components/CustomToolbar";
import lodash from "lodash";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import HTML2React from "html2react";

// op.add_column('project_completion', sa.Column(
//   'actual_end_date', sa.DateTime(), nullable=True))
// op.add_column('project_completion', sa.Column(
//   'actual_start_date', sa.DateTime(), nullable=True))

const ProjectCompletionCreate = (props) => {
  const [projectDetails, setProjectDetails] = useState();
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const projectDetailsId = props.match?.params?.id;

  React.useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: projectDetailsId,
      })
      .then((res) => {
        if (res && res.data) {
          setProjectDetails(formatValuesToQuery({ ...res.data }));
        }
      });
  }, [dataProvider, projectDetailsId]);

  return (
    <Create
      {...props}
      undoable={false}
      actions={false}
      basePath="/project-completion"
      resource="project-completion"
    >
      <SimpleForm
        redirect={`show`}
        toolbar={<CustomToolbar projectDetailId={projectDetailsId} />}
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (projectDetails) {
              formData.project_id = projectDetails.project_id;
            }
            const isExtended =
              formData &&
              projectDetails &&
              formData.actual_end_date &&
              moment(formData.actual_end_date).diff(
                moment(moment(projectDetails.end_date)),
                "days"
              ) >= 1; //days

            return (
              <>
                <h2>Actual dates</h2>
                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    width: "100%",
                  }}
                >
                  <CustomInput
                    tooltipText="tooltips.completionReport.actual_start_date"
                    fullWidth
                  >
                    <DateInput
                      source={`actual_start_date`}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText="tooltips.completionReport.actual_end_date"
                    fullWidth
                  >
                    <DateInput
                      source={`actual_end_date`}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                  {isExtended && (
                    <TextInput
                      source={`extension_reason`}
                      rows={3}
                      variant="outlined"
                      margin="none"
                      fullWidth
                      multiline
                      rowsMax={3}
                    />
                  )}
                </div>

                <h2>Physical Performance</h2>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Output</TableCell>
                        <TableCell>
                          <CustomInput
                            tooltipText="tooltips.completionReport.actual_specifications"
                            bool
                          >
                            Actual Specifications / Description
                          </CustomInput>
                        </TableCell>
                        <TableCell>
                          <CustomInput
                            tooltipText="tooltips.completionReport.initial_completion_date"
                            bool
                          >
                            Initial Completion Date
                          </CustomInput>
                        </TableCell>
                        <TableCell>
                          <CustomInput
                            tooltipText="tooltips.completionReport.actual_completion_date"
                            bool
                          >
                            Actual Completion Date
                          </CustomInput>
                        </TableCell>
                        <TableCell>
                          <CustomInput
                            tooltipText="tooltips.completionReport.related_challenges"
                            bool
                          >
                            Specific Output Related Challenges
                          </CustomInput>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {projectDetails &&
                        projectDetails.outputs &&
                        projectDetails.outputs.map((output, idx) => (
                          <TableRow>
                            <TableCell>{output.name}</TableCell>

                            <TableCell>
                              <TextInput
                                source={`outputs[${idx}].specifications`}
                                label={false}
                                rows={3}
                                variant="outlined"
                                margin="none"
                                fullWidth
                                multiline
                                rowsMax={3}
                              />
                            </TableCell>
                            <TableCell>
                              <DateInput
                                source={`outputs[${idx}].intended_completion_date`}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <DateInput
                                source={`outputs[${idx}].actual_completion_date`}
                                variant="outlined"
                                margin="none"
                                label={false}
                              />
                            </TableCell>
                            <TableCell>
                              <TextInput
                                source={`outputs[${idx}].related_challenges`}
                                label={false}
                                rows={3}
                                variant="outlined"
                                margin="none"
                                fullWidth
                                multiline
                                rowsMax={3}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <h2>Outcome performance</h2>

                <CustomInput
                  tooltipText={"tooltips.completionReport.short_term_outcomes"}
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-completion.fields.outcome_performance.short_term_outcomes"
                    )}
                    source="outcome_performance.short_term_outcomes"
                    validate={required()}
                    isRequired
                    formData={formData}
                    {...props}
                  />
                </CustomInput>

                <CustomInput
                  tooltipText={"tooltips.completionReport.impacts"}
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-completion.fields.outcome_performance.impact"
                    )}
                    source="outcome_performance.impact"
                    validate={required()}
                    isRequired
                    formData={formData}
                    {...props}
                  />
                </CustomInput>

                <h2>Challenges encountered and recommendations</h2>
                <CustomInput
                  tooltipText={
                    "tooltips.completionReport.challenges_and_recommendations"
                  }
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-completion.fields.challenges_recommendations"
                    )}
                    source="challenges_recommendations"
                    validate={required()}
                    isRequired
                    formData={formData}
                    {...props}
                  />
                </CustomInput>

                <h2>Lessons learnt</h2>
                <CustomInput
                  tooltipText={"tooltips.completionReport.lessons_learnt"}
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-completion.fields.lessons_learnt"
                    )}
                    source="lessons_learnt"
                    validate={required()}
                    isRequired
                    formData={formData}
                    {...props}
                  />
                </CustomInput>
                <h2>Post-project tasks / future considerations</h2>
                <CustomInput
                  tooltipText={
                    "tooltips.completionReport.future_considerations"
                  }
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-completion.fields.future_considerations"
                    )}
                    source="future_considerations"
                    validate={required()}
                    isRequired
                    formData={formData}
                    {...props}
                  />
                </CustomInput>
                <h2>Sustainability plan</h2>
                <CustomInput
                  tooltipText={
                    "tooltips.completionReport.financial_sustainability_plan"
                  }
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-completion.fields.financial_sustainability"
                    )}
                    source="financial_sustainability"
                    validate={required()}
                    isRequired
                    formData={formData}
                    {...props}
                  />
                </CustomInput>
                <CustomInput
                  tooltipText={
                    "tooltips.completionReport.environmental_sustainability_plan"
                  }
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-completion.fields.environmental_sustainability"
                    )}
                    source="environmental_sustainability"
                    validate={required()}
                    isRequired
                    formData={formData}
                    {...props}
                  />
                </CustomInput>
                <h2>Project achievements</h2>
                <CustomInput
                  tooltipText={"tooltips.completionReport.project_achievements"}
                  textArea
                  fullWidth
                >
                  <CustomTextArea
                    label={translate(
                      "resources.project-completion.fields.achievements"
                    )}
                    source="achievements"
                    validate={required()}
                    isRequired
                    formData={formData}
                    {...props}
                  />
                </CustomInput>
              </>
            );
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Create>
  );
};

export default ProjectCompletionCreate;

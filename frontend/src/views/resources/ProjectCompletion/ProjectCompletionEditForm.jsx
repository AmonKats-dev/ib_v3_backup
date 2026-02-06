import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import {
  DateInput,
  FormDataConsumer,
  required,
  SimpleForm,
  TextInput,
  useTranslate,
} from "react-admin";
import CustomInput from "../../components/CustomInput";
import CustomTextArea from "../../components/CustomTextArea";
import CompletionToolbar from "./CompletionToolbar";

const ProjectCompletionEditForm = ({
  projectDetails,
  project,
  record,
  ...props
}) => {
  const translate = useTranslate();
  return (
    <SimpleForm
      {...props}
      toolbar={<CompletionToolbar id={record?.id} />}
      sanitizeEmptyValues={false}
      redirect={"show"}
    >
      <FormDataConsumer>
        {({ getSource, scopedFormData, formData, ...rest }) => {
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
                <DateInput
                  source={`actual_start_date`}
                  variant="outlined"
                  margin="none"
                />
                <DateInput
                  source={`actual_end_date`}
                  variant="outlined"
                  margin="none"
                />
              </div>

              <h2>Physical Performance</h2>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Output</TableCell>
                      <TableCell>Actual Specifications / Description</TableCell>
                      <TableCell>Initial Completion Date</TableCell>
                      <TableCell>Actual Completion Date</TableCell>
                      <TableCell>Specific Output Related Challenges </TableCell>
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
                tooltipText={
                  "tooltips.resources.project-completion.fields.outcome_performance.short_term_outcomes"
                }
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
                tooltipText={
                  "tooltips.resources.project-completion.fields.outcome_performance.impact"
                }
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
                  "tooltips.resources.project-completion.fields.challenges_recommendations"
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
                tooltipText={
                  "tooltips.resources.project-completion.fields.lessons_learnt"
                }
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
                  "tooltips.resources.project-completion.fields.future_considerations"
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
                  "tooltips.resources.project-completion.fields.sustainability_plan"
                }
                textArea
                fullWidth
              >
                <CustomTextArea
                  label={translate(
                    "resources.project-completion.fields.sustainability_plan"
                  )}
                  source="sustainability_plan"
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
  );
};

export default ProjectCompletionEditForm;

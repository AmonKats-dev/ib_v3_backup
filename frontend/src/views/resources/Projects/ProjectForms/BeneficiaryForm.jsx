import { TableBody, TableCell, Table, TableRow } from "@material-ui/core";
import React, { Fragment, Component } from "react";
import {
  FormDataConsumer,
  TextInput,
  translate,
  number,
  Labeled,
  ArrayInput,
  SimpleFormIterator,
  useTranslate,
  required,
} from "react-admin";
import { commasFormatter, commasParser } from "../../../../helpers";
import CustomInput from "../../../components/CustomInput";
import CustomTextArea from "../../../components/CustomTextArea";
import { checkRequired } from "../validation";

const BeneficiaryForm = (props) => {
  const translate = useTranslate();

  const ageValidation = (value, allValues) => {
    if (
      allValues &&
      allValues.beneficiary_analysis &&
      parseInt(allValues.beneficiary_analysis.population_in_poverty) >
        parseInt(allValues.beneficiary_analysis.ref_population)
    ) {
      return translate("messages.beneficiary_population");
    }

    return null;
  };

  return (
    <FormDataConsumer>
      {({ getSource, scopedFormData, formData, ...rest }) => {
        return (
          <Table class="table">
            <TableBody>
              <TableRow>
                <TableCell colspan="3">
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.ref_population"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={[number(), ageValidation]}
                      source={"beneficiary_analysis.ref_population"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.ref_population"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>
                </TableCell>
                <TableCell>
                  {" "}
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.ref_year"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.ref_year"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.ref_year"
                      )}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colspan="3">
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.population_in_poverty"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={[number(), ageValidation]}
                      source={"beneficiary_analysis.population_in_poverty"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.population_in_poverty"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>
                </TableCell>
                <TableCell>
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.poverty_year"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.poverty_year"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.poverty_year"
                      )}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colspan="4">
                  <h4>
                    {translate(
                      "resources.project-details.fields.beneficiary_analysis.fields.composition"
                    )}
                  </h4>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colspan="2">
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.male"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.male"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.male"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>
                </TableCell>
                <TableCell colspan="2">
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.female"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.female"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.female"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.children"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.children"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.children"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>
                </TableCell>
                <TableCell>
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.youth"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.youth"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.youth"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>{" "}
                </TableCell>
                <TableCell>
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.adults"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.adults"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.adults"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>{" "}
                </TableCell>
                <TableCell>
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.elderly"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.elderly"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.elderly"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>{" "}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colspan="2">
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.extreme_poverty"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.extreme_poverty"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.extreme_poverty"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>
                </TableCell>
                <TableCell>
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.poor"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.poor"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.poor"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>
                </TableCell>
                <TableCell>
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.not_poor"
                    )}
                    fullWidth
                  >
                    <TextInput
                      validate={number()}
                      source={"beneficiary_analysis.not_poor"}
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.not_poor"
                      )}
                      format={commasFormatter}
                      parse={commasParser}
                      margin="none"
                      variant="outlined"
                    />
                  </CustomInput>{" "}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colspan="4">
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.location"
                    )}
                    fullWidth
                  >
                    <CustomTextArea
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.location"
                      )}
                      source="beneficiary_analysis.location"
                      formData={formData}
                      validate={checkRequired("beneficiary_analysis.location")}
                      isRequired={Boolean(
                        checkRequired("beneficiary_analysis.location")
                      )}
                      {...props}
                    />
                  </CustomInput>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colspan="4">
                  <CustomInput
                    tooltipText={translate(
                      "tooltips.resources.project-details.fields.beneficiary_analysis.fields.other_aspects"
                    )}
                    fullWidth
                  >
                    <CustomTextArea
                      label={translate(
                        "resources.project-details.fields.beneficiary_analysis.fields.other_aspects"
                      )}
                      source="beneficiary_analysis.other_aspects"
                      validate={checkRequired(
                        "beneficiary_analysis.other_aspects"
                      )}
                      isRequired={Boolean(
                        checkRequired("beneficiary_analysis.other_aspects")
                      )}
                      formData={formData}
                      {...props}
                    />
                  </CustomInput>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      }}
    </FormDataConsumer>
  );
};

export default BeneficiaryForm;

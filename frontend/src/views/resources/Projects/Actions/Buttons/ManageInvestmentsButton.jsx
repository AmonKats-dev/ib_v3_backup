// in PostQuickCreateButton.js
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { change, submit, isSubmitting } from "redux-form";
import {
  fetchEnd,
  fetchStart,
  required,
  number,
  showNotification,
  // Button,
  SaveButton,
  SimpleForm,
  TextInput,
  LongTextInput,
  CREATE,
  REDUX_FORM_NAME,
  ReferenceInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  FormDataConsumer,
  translate,
  AutocompleteInput,
} from "react-admin";
import Button from "@material-ui/core/Button";
import IconContentAdd from "@material-ui/icons/Add";
import IconCancel from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import lodash from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";

import CustomInput from "../../../../components/CustomInput";

import dataProvider from "../../../../providers/dataProvider";
import {
  getFiscalYearsRangeForIntervals,
  optionRendererCodeName,
} from "../../../../helpers/formatters";
import {
  commasFormatter,
  commasParser,
  currencyConverter,
  currencyConverterParse,
} from "../../helpers";
import { DEFAULT_SORTING } from "../../../../constants/common";

const numberValidation = [number()];

const getYears = (years) => {
  if (years) {
    const startDate = years[0];
    const endDate = years[years.length - 1];

    return getFiscalYearsRangeForIntervals(startDate, endDate);
  }

  return [];
};

class ManageInvestmentsButton extends Component {
  state = {
    error: false,
    showDialog: false,
    references: [],
    isConverted: false,
    conversionRate: 1,
  };

  componentDidMount() {
    this.setState({ references: this.props.references });
  }

  componentWillReceiveProps(nextProps) {
    if (!lodash.isEqual(this.props.references, nextProps.references)) {
      this.setState({ references: nextProps.references });
    }
  }

  handleClick = () => {
    const {
      translate,
      type,
      formData,
      showNotification,
      formValues,
      save,
    } = this.props;

    if (type === "activities") {
      if (formData && (!formData.description || !formData.title)) {
        showNotification(
          "You should define activity name and description",
          "warning"
        );
        return;
      }
      if (formData && (!formData.start_date || !formData.end_date)) {
        showNotification("Incorrect activity date range defined", "warning");
        return;
      }
      if (
        formData &&
        (!formData.output_id /*|| formData.output_id.length === 0 */)
      ) {
        showNotification("At least one output has to be filled", "warning");
        return;
      }
    }
    if (type === "outputs") {
      if (
        formData &&
        (!formData.outcome_ids || formData.outcome_ids.length === 0)
      ) {
        showNotification("At least one outcome has to be filled", "warning");
        return;
      }
    }
    this.setState({ showDialog: true });
    save(formValues, false);
  };

  handleCloseClick = () => {
    if (!this.props.isInvalid) {
      this.setState({ showDialog: false });
      this.props.save(this.props.formValues, false);
    }
  };

  getFormattedValue = (value) => {
    const selected = lodash.find(
      this.state.references["cost-classifications"],
      (item) => item.cost_category_id === value
    );
    return selected ? `${selected.code} - ${selected.name}` : null;
  };

  handleConvert = () => {
    const { formValues } = this.props;
    const conversionRate =
      (this.props.references &&
        this.props.references["currency-rates"] &&
        lodash.find(
          this.props.references["currency-rates"],
          (item) => item.currency.abbr === "USD"
        ).rate) ||
      1;

    this.setState({ isConverted: !this.state.isConverted }, () => {
      const investmentYears =
        this.props.type === "activities" ? "investment_years" : "targets";

      if (formValues[this.props.type]) {
        formValues[this.props.type].forEach((item) => {
          item.investments.forEach((investment) => {
            item[investmentYears].forEach((year) => {
              investment[year] = currencyConverter(
                investment[year],
                conversionRate,
                !this.state.isConverted
              );
            });
          });
        });
      }
      this.props.submit("record-form");
    });
  };

  render() {
    const { showDialog, references } = this.state;
    const { translate } = this.props;

    return (
      <Fragment>
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleClick}
          label={this.props.title}
        >
          {this.props.isSaving === false ? (
            this.props.title
          ) : (
            <CircularProgress
              style={{ marginRight: "10px", color: "#fff" }}
              size={25}
              thickness={2}
            />
          )}
        </Button>
        <Dialog
          fullWidth
          open={showDialog && this.props.isSaving === false}
          onClose={this.handleCloseClick}
          aria-label={translate(
            `resources.${this.props.type}.fields.investments.name'`,
            { smart_count: 2 }
          )}
          style={{ overflow: "hidden" }}
        >
          <DialogTitle>
            {translate(`resources.${this.props.type}.fields.investments.name`, {
              smart_count: 2,
            })}
          </DialogTitle>
          <DialogContent>
            <ArrayInput
              source={this.props.source}
              label={null}
              className="iterator"
            >
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ getSource, scopedFormData, formData, ...rest }) => {
                    return (
                      <Fragment>
                        {this.props.type === "activities" && (
                          <CustomInput
                            tooltipText={
                              `tooltips.resources.${this.props.type}.fields.investments.fields.fund_id`
                            }
                            fullWidth
                          >
                            <ReferenceInput
                              sort={DEFAULT_SORTING}
                              perPage={-1}
                              source={getSource("fund_id")}
                              reference="funds"
                              label={translate(
                                `resources.${this.props.type}.fields.investments.fields.fund_id`
                              )}
                            >
                              <SelectInput
                                options={{ fullWidth: "true" }}
                                optionText="name"
                              />
                            </ReferenceInput>
                          </CustomInput>
                        )}
                        {this.props.type === "activities" && (
                          <CustomInput
                            tooltipText={translate(
                              `tooltips.resources.${this.props.type}.fields.investments.fields.fund_source_id`
                            )}
                            fullWidth
                          >
                            <ReferenceInput
                              perPage={-1}
                              sort={{ field: "code", order: "ASC" }}
                              source={getSource("fund_source_id")}
                              reference="fund-sources"
                              label={translate(
                                `resources.${this.props.type}.fields.investments.fields.fund_source_id`
                              )}
                              filterToQuery={(searchText) => ({
                                name: searchText,
                              })}
                            >
                              <SelectInput
                                options={{ fullWidth: "true" }}
                                optionText={optionRendererCodeName}
                              />
                            </ReferenceInput>
                          </CustomInput>
                        )}
                        {this.props.type === "activities" && (
                          <CustomInput
                            tooltipText={translate(
                              `tooltips.resources.${this.props.type}.fields.investments.fields.cost_category_id`
                            )}
                            fullWidth
                          >
                            <ReferenceInput
                              perPage={-1}
                              sort={{ field: "code", order: "ASC" }}
                              source={getSource("cost_category_id")}
                              reference="cost-categories"
                              label={translate(
                                `resources.${this.props.type}.fields.investments.fields.cost_category_id`
                              )}
                              filterToQuery={(searchText) => ({
                                name: searchText,
                              })}
                            >
                              <SelectInput
                                options={{ fullWidth: "true" }}
                                optionText={optionRendererCodeName}
                              />
                            </ReferenceInput>
                          </CustomInput>
                        )}
                        {this.props.type === "activities" && (
                          <CustomInput
                            tooltipText={translate(
                              `tooltips.resources.${this.props.type}.fields.investments.fields.cost_classification_id`
                            )}
                            fullWidth
                          >
                            <ReferenceInput
                              sort={{ field: "code", order: "ASC" }}
                              perPage={-1}
                              source={getSource("cost_classification_id")}
                              reference="cost-classifications"
                              label={translate(
                                `resources.${this.props.type}.fields.investments.fields.cost_classification_id`
                              )}
                              filter={{
                                cost_category_id:
                                  (scopedFormData &&
                                    scopedFormData.cost_category_id) ||
                                  null,
                              }}
                              filterToQuery={(searchText) => ({
                                name: searchText,
                              })}
                            >
                              <SelectInput
                                options={{ fullWidth: "true" }}
                                optionText={optionRendererCodeName}
                              />
                            </ReferenceInput>
                          </CustomInput>
                        )}
                        {this.props.years &&
                          getYears(this.props.years).map((year) => {
                            return (
                              <CustomInput tooltipText="Years" fullWidth>
                                <TextInput
                                  label={`${year.name}`}
                                  source={getSource(year.id)}
                                  resource={formData}
                                  validate={numberValidation}
                                  format={commasFormatter}
                                  parse={commasParser}
                                />
                              </CustomInput>
                            );
                          })}
                      </Fragment>
                    );
                  }}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </DialogContent>
          <DialogActions>
            <Button style={{ float: "right" }} onClick={this.handleConvert}>
              {`Convert to ${this.state.isConverted ? "USD" : translate("titles.currency")}`}
            </Button>
            <SaveButton
              disabled={this.props.isInvalid}
              onClick={this.handleCloseClick}
            />
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

const mapDispatchToProps = {
  change,
  fetchEnd,
  fetchStart,
  showNotification,
  submit,
};

export default translate(
  connect(null, mapDispatchToProps)(ManageInvestmentsButton)
);

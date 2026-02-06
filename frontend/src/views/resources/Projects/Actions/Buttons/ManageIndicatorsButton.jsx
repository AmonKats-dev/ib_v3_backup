// in PostQuickCreateButton.js
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { change, submit, isSubmitting, getFormValues } from "redux-form";
import {
  fetchEnd,
  fetchStart,
  required,
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
  number,
} from "react-admin";
import Button from "@material-ui/core/Button";
import IconContentAdd from "@material-ui/icons/Add";
import IconCancel from "@material-ui/icons/Cancel";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import CircularProgress from "@material-ui/core/CircularProgress";

import CustomInput from "../../../../components/CustomInput";

import dataProvider from "../../../../providers/dataProvider";
import {
  getFiscalYearsRangeForIntervals,
  getFiscalYearValue,
} from "../../../../helpers/formatters";
import lodash from "lodash";

const numberValidation = [];

const getYears = (years) => {
  if (years) {
    if (lodash.isArray(years)) {
      const startDate = years[0];
      const endDate = years[years.length - 1];

      return getFiscalYearsRangeForIntervals(startDate, endDate);
    } else {
      return getFiscalYearValue(years);
    }
  }

  return [];
};

class ManageIndicatorsButton extends Component {
  state = {
    error: false,
    showDialog: false,
    references: [],
  };

  componentDidMount() {
    this.setState({ references: this.props.references });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ references: nextProps.references });
  }

  handleClick = () => {
    this.setState({ showDialog: true });
    this.props.save(this.props.formValues, false);
  };

  handleCloseClick = () => {
    this.setState({ showDialog: false });
  };

  render() {
    const { showDialog } = this.state;
    const { isSubmitting, translate, targets } = this.props;
    let resultTargets = targets;

    if (typeof targets === "string") {
      resultTargets = targets.split(",");
    }

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
          aria-label={translate("resources.indicators.name", {
            smart_count: 2,
          })}
        >
          <DialogTitle>
            {translate("resources.indicators.name", { smart_count: 2 })}
          </DialogTitle>
          <DialogContent>
            <ArrayInput
              source={this.props.source}
              label={null}
              className="iterator"
            >
              <SimpleFormIterator>
                <FormDataConsumer>
                  {({ getSource, scopedFormData, formData, ...rest }) => (
                    <Fragment>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.indicators.fields.title"
                        }
                        fullWidth
                      >
                        <TextInput
                          source={getSource("title")}
                          label={translate("resources.indicators.fields.title")}
                        />
                      </CustomInput>
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.indicators.fields.baseline"
                        }
                        fullWidth
                      >
                        <TextInput
                          source={getSource("baseline")}
                          label={`${translate(
                            "resources.indicators.fields.baseline"
                          )} - ${getYears(formData.baseline).name || "-"}`}
                        />
                      </CustomInput>
                      {resultTargets &&
                        getYears(resultTargets).map((target) => (
                          <CustomInput
                            tooltipText={
                              "resources.indicators.fields.target"
                            }
                            fullWidth
                          >
                            <TextInput
                              label={target.name}
                              source={getSource(target.id)}
                              resource={scopedFormData}
                            />
                          </CustomInput>
                        ))}
                      <CustomInput
                        tooltipText={
                          "tooltips.resources.indicators.fields.verification_means"
                        }
                        fullWidth
                      >
                        <TextInput
                          source={getSource("verification_means")}
                          label={translate(
                            "resources.indicators.fields.verification_means"
                          )}
                        />
                      </CustomInput>
                      {this.props.type !== "goals" && (
                        <Fragment>
                          <CustomInput
                            tooltipText={
                              "tooltips.resources.indicators.fields.assumptions"
                            }
                            fullWidth
                          >
                            <TextInput
                              source={getSource("assumptions")}
                              label={translate(
                                "resources.indicators.fields.assumptions"
                              )}
                            />
                          </CustomInput>
                          <CustomInput
                            tooltipText={
                              "tooltips.resources.indicators.fields.risk_factors"
                            }
                            fullWidth
                          >
                            <TextInput
                              source={getSource("risk_factors")}
                              label={translate(
                                "resources.indicators.fields.risk_factors"
                              )}
                            />
                          </CustomInput>
                        </Fragment>
                      )}
                    </Fragment>
                  )}
                </FormDataConsumer>
              </SimpleFormIterator>
            </ArrayInput>
          </DialogContent>
          <DialogActions>
            <SaveButton saving={isSubmitting} onClick={this.handleCloseClick} />
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  formValues: getFormValues("record-form")(state),
  isSubmitting: isSubmitting("record-form")(state),
  isSaving: state.admin.saving,
});

const mapDispatchToProps = {
  change,
  fetchEnd,
  fetchStart,
  showNotification,
  submit,
};

export default translate(
  connect(mapStateToProps, mapDispatchToProps)(ManageIndicatorsButton)
);

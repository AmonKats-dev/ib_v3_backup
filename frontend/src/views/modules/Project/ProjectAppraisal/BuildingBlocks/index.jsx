import { Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import {
  SelectInput,
  ArrayInput,
  TextInput,
  DisabledInput,
  SimpleFormIterator,
  FormDataConsumer,
  useTranslate,
  Labeled,
  number,
} from "react-admin";
import { checkFeature } from "../../../../../helpers/checkPermission";
import EditForm from "./EditForm";

function BuildingBlocks(props) {
  const translate = useTranslate();
  const { record } = props;

  return (
    <ArrayInput
      source="project_options"
      label={null}
      className="iterator"
      // format={(value) => {
      //   return value;
      // }}
      // parse={(value) => {
      //   value[0].test = {};
      //   return value;
      // }}
    >
      <SimpleFormIterator
        disableAdd={
          props.activeStep !== 0 ||
          checkFeature(
            "project_options_disable_change",
            Number(record.phase_id)
          ) || props.disabled
        }
        disableRemove={
          props.activeStep > 1 ||
          checkFeature(
            "project_options_disable_change",
            Number(record.phase_id)
          ) || props.disabled
        }
      >
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            return (
              <Fragment>
                <Typography variant="h3">
                  <b style={{ marginLeft: 10, lineHeight: '40px' }}>{scopedFormData && scopedFormData.name}</b>
                </Typography>
                <br />
                <EditForm
                  getSource={getSource}
                  record={props.record}
                  formData={formData}
                  scopedFormData={scopedFormData}
                  {...props}
                />
              </Fragment>
            );
          }}
        </FormDataConsumer>
      </SimpleFormIterator>
    </ArrayInput>
  );
}

export default BuildingBlocks;

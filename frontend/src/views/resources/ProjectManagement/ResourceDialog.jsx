import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@material-ui/core";
import React, { Fragment } from "react";
import {
    ArrayInput,
    Button, FormDataConsumer,
    minValue,
    NumberInput,
    SelectInput, SimpleFormIterator,
    TextInput
} from "react-admin";

const ResourceDialog = ({ humanResources, onSave, onClose, ...props }) => {
  const handleSave = (values) => {
    onSave(values);
    onClose();
  };

  return (
    <FormDataConsumer>
      {({ formData, scopedFormData, getSource, ...rest }) => {
        return (
          <Dialog
            fullWidth
            maxWidth={"md"}
            open
            onClose={onClose}
            style={{ overflow: "hidden" }}
          >
            <DialogTitle>Project’s Human Resources</DialogTitle>
            <DialogContent>
              <ArrayInput source="staff" label={false}>
                <SimpleFormIterator>
                  <FormDataConsumer>
                    {({ formData, scopedFormData, getSource, ...rest }) => {
                      if (scopedFormData && !scopedFormData.id) {
                        scopedFormData.id = Date.now();
                      }

                      localStorage.setItem(
                        "staff",
                        JSON.stringify(formData.staff)
                      );

                      return (
                        <Fragment>
                          <SelectInput
                            options={{ fullWidth: true }}
                            label={"Labor Category"}
                            variant="outlined"
                            margin="none"
                            source={getSource("parent")}
                            choices={humanResources}
                            optionValue="id"
                            optionText="text"
                          />
                          <TextInput
                            options={{ fullWidth: true }}
                            label={"Full Name"}
                            source={getSource("text")}
                            variant="outlined"
                            margin="none"
                          />
                          <NumberInput
                            options={{ fullWidth: true }}
                            label={"Monthly Availability"}
                            source={getSource("capacity")}
                            variant="outlined"
                            margin="none"
                            validate={[minValue(1)]}
                          />
                           {/* <NumberInput
                            options={{ fullWidth: true }}
                            label={"Resource cost (daily)"}
                            source={getSource("rate")}
                            variant="outlined"
                            margin="none"
                            validate={[minValue(1)]}
                          /> */}
                        </Fragment>
                      );
                    }}
                  </FormDataConsumer>
                </SimpleFormIterator>
              </ArrayInput>
            </DialogContent>
            <DialogActions>
              <FormDataConsumer>
                {({ formData, scopedFormData, getSource, ...rest }) => (
                  <Button
                    variant="contained"
                    onClick={() => handleSave(formData)}
                    label="Save Changes"
                  ></Button>
                )}
              </FormDataConsumer>
            </DialogActions>
          </Dialog>
        );
      }}
    </FormDataConsumer>
  );
};

export default ResourceDialog;

import React, { Fragment, useEffect } from "react";
import {
  TextInput,
  email,
  number,
  maxLength,
  useTranslate,
  required,
  minLength,
} from "react-admin";
import CustomInput from "../../../components/CustomInput";
import { ArrayInput, FormDataConsumer, SimpleFormIterator } from "react-admin";
import { checkRequired } from "../../../resources/Projects/validation";

function ResponsibleOfficer(props) {
  const translate = useTranslate();
  const phoneCode = props.hasPimisFields ? "(222)" : "+256";
  const phoneCodeCount = props.hasPimisFields ? 5 : 4;

  return (
    <Fragment>
      <ArrayInput
        validate={checkRequired("responsible_officers")}
        source="responsible_officers"
        label={translate(
          "resources.project-details.fields.responsible_officers.header"
        )}
      >
        <SimpleFormIterator
          style={{ width: "100%" }}
          disableAdd={!props.multiple}
          disableRemove={!props.multiple}
        >
          <FormDataConsumer>
            {({ getSource, scopedFormData, formData, ...rest }) => {
              const phoneFormatter = props.hasPimisFields
                ? {
                    format: (value) => {
                      if (value) {
                        const formValue = value
                          .replace("(", "")
                          .replace(")", "");
                        const phoneCode = formValue.slice(0, 3);
                        const phoneNumber = formValue.slice(
                          3,
                          formValue.length + 2
                        );
                        return `(${phoneCode})${phoneNumber}`;
                      }

                      return value;
                    },
                    parse: (value) => {
                      if (value) {
                        return value.replace("(", "").replace(")", "");
                      }
                      return value;
                    },
                    validate: [
                      number(),
                      minLength(10, "Must be 10 characters"),
                      maxLength(10, "Must be 10 characters"),
                    ],
                  }
                : props.hasDefaultPhoneCode
                ? {
                    format: (value) => {
                      if (value) {
                        if (value.slice(0, phoneCodeCount) === phoneCode) {
                          return value;
                        }

                        return `${phoneCode}${value}`;
                      }

                      return phoneCode;
                    },
                    parse: (value) => value.slice(phoneCodeCount, value.length),
                    validate: [
                      number(),
                      minLength(9, "Must be 9 characters"),
                      maxLength(9, "Must be 9 characters"),
                      required(),
                    ],
                  }
                : {
                    validate: [
                      number(),
                      minLength(10, "Must be 10 characters"),
                      maxLength(10, "Must be 10 characters"),
                      // required(),
                    ],
                  };

              return (
                <Fragment>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.responsible_officers.title"
                    }
                    fullWidth
                  >
                    <TextInput
                      source={getSource("title")}
                      validate={checkRequired("responsible_officers", "title")}
                      label={translate(
                        "resources.project-details.fields.responsible_officers.title"
                      )}
                      variant="outlined"
                      margin="none"
                      disabled={
                        scopedFormData &&
                        scopedFormData.title === "Project Coordinator / Manager"
                      }
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.responsible_officers.name"
                    }
                    fullWidth
                  >
                    <TextInput
                      source={getSource("name")}
                      validate={checkRequired("responsible_officers", "name")}
                      label={translate(
                        "resources.project-details.fields.responsible_officers.name"
                      )}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.responsible_officers.phone"
                    }
                    fullWidth
                  >
                    <TextInput
                      validate={checkRequired("responsible_officers", "phone")}
                      source={getSource("phone")}
                      label={translate(
                        "resources.project-details.fields.responsible_officers.phone"
                      )}
                      variant="outlined"
                      margin="none"
                      {...phoneFormatter}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.responsible_officers.mobile_phone"
                    }
                    fullWidth
                  >
                    <TextInput
                      source={getSource("mobile_phone")}
                      validate={checkRequired(
                        "responsible_officers",
                        "mobile_phone"
                      )}
                      label={translate(
                        "resources.project-details.fields.responsible_officers.mobile_phone"
                      )}
                      variant="outlined"
                      margin="none"
                      {...phoneFormatter}
                    />
                  </CustomInput>
                  <CustomInput
                    tooltipText={
                      "tooltips.resources.project-details.fields.responsible_officers.email"
                    }
                    fullWidth
                  >
                    <TextInput
                      source={getSource("email")}
                      label={translate(
                        "resources.project-details.fields.responsible_officers.email"
                      )}
                      validate={[
                        checkRequired("responsible_officers", "email"),
                        email(),
                      ]}
                      variant="outlined"
                      margin="none"
                    />
                  </CustomInput>
                </Fragment>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    </Fragment>
  );
}

export default ResponsibleOfficer;

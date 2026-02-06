import { minLength, required, regex } from "react-admin";

export const validatePassword = [
  required(),
  minLength(8),
  regex(
    /^(?=.[A-Z])(?=.[!@#$&%])(?=.[0-9])(?=.*[a-z]).{8,}$/gm,
    `Contain both upper- and lower-case characters (e.g., a-z, A-Z).
    Have numbers and punctuation characters as well as letters.
    At least eight alphanumeric characters long`
  ),
];

export const validateUsername = [required(), minLength(3)];

export const arrayLength = (value, allValues) => {
  if (value && value.length > 1) {
    return "Must be only 1 element";
  }
  return false;
};

// /^(?=.[A-Z])(?=.[!@#$&])(?=.[0-9])(?=.*[a-z]).{8,}$/gm,
// /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

export const validateUserCreation = (values) => {
  const errors = {};
  if (values && values.username && values.username.indexOf(" ") > -1) {
    errors.username = ["Username contains spaces"];
  }
  if (values && values.user_roles && values.user_roles.length === 0) {
    errors.user_roles = ["User must contain at least one role"];
  }
  if (values && !values.user_roles) {
    errors.user_roles = ["User must contain at least one role"];
  }

  return errors;
};

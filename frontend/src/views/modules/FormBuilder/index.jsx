import React from "react";
import CustomInput from "../../components/CustomInput";

const FormBuilder = (props) => {
  return (
    props.fields &&
    props.fields.map((item) => {
      return (
        <CustomInput tooltipText={item.tooltipText} {...item.options}>
          {React.cloneElement(props.type === "edit" ? item.input : item.view, {
            ...item,
          })}
        </CustomInput>
      );
    })
  );
};

export default FormBuilder;

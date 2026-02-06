import { Typography } from "@material-ui/core";
import React from "react";
import { Edit, SimpleForm, TextInput, SelectInput, number, useTranslate } from "react-admin";
import { PROJECT_CLASSIFICATION } from "../../../constants/common";
import {
  commasFormatter,
  commasParser,
  generateChoices,
} from "../../../helpers";
import { getFiscalYears } from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";

const redirectEdit = (basePath, id, data) => {
  return `/projects/${id}/show/${data.phase_id}`;
};

const MYCDataEntry = ({ classes, ...props }) => {
  const translate = useTranslate();

  return (
    <Edit
      undoable={false}
      actions={false}
      redirect={false}
      resource="projects"
      basePath="/projects"
      id={props.match.params.id}
    >
      <SimpleForm redirect={redirectEdit}>
        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 20}}>Description</Typography>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.funding_source"}
        >
          <TextInput
            label={translate("resources.project.myc_data.funding_source")}
            source="myc_data.funding_source"
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.start_date"}
        >
          <SelectInput
            label={translate("resources.project.myc_data.start_date")}
            options={{ fullWidth: "true" }}
            source="myc_data.start_date"
            choices={getFiscalYears(2)}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.end_date"}
        >
          <SelectInput
            label={translate("resources.project.myc_data.end_date")}
            options={{ fullWidth: "true" }}
            source="myc_data.end_date"
            choices={getFiscalYears(2)}
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.status"}
        >
          <TextInput
            label={translate("resources.project.myc_data.status")}
            source="myc_data.status"
            variant="outlined"
            margin="none"
          />
        </CustomInput>

        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 20}}>Classification</Typography>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.classification"}
        >
          <SelectInput
            label={translate("resources.project.myc_data.classification")}
            options={{ fullWidth: "true" }}
            source="myc_data.classification"
            choices={generateChoices(PROJECT_CLASSIFICATION)}
            variant="outlined"
            margin="none"
          />
        </CustomInput>

        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 20}}>
          Cummulative Expenditure to end of FY 0
        </Typography>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.start_spending"}
        >
          <TextInput
            label={translate("resources.project.myc_data.start_spending")}
            source="myc_data.start_spending"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>

        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 20}}>Approved Budget</Typography>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.approved_budget"}
        >
          <TextInput
            label={translate("resources.project.myc_data.approved_budget")}
            source="myc_data.approved_budget"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>

        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 20}}>
          Estimates for next budget year (FY21-22)
        </Typography>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.estimate_areas"}
        >
          <TextInput
            label={translate("resources.project.myc_data.estimate_areas")}
            source="myc_data.estimate_areas"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={
            "tooltips.resources.project.myc_data.counterpart_funding"
          }
        >
          <TextInput
            label={translate("resources.project.myc_data.counterpart_funding")}
            source="myc_data.counterpart_funding"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.cash_required"}
        >
          <TextInput
            label={translate("resources.project.myc_data.cash_required")}
            source="myc_data.cash_required"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={
            "tooltips.resources.project.myc_data.arrears_contractual"
          }
        >
          <TextInput
            label={translate("resources.project.myc_data.arrears_contractual")}
            source="myc_data.arrears_contractual"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>

        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 20}}>Multi Year Project estimates</Typography>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.estimate_f2"}
        >
          <TextInput
            label={translate("resources.project.myc_data.estimate_f2")}
            source="myc_data.estimate_f2"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.estimate_f3"}
        >
          <TextInput
            label={translate("resources.project.myc_data.estimate_f3")}
            source="myc_data.estimate_f3"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.estimate_f4"}
        >
          <TextInput
            label={translate("resources.project.myc_data.estimate_f4")}
            source="myc_data.estimate_f4"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.estimate_f5"}
        >
          <TextInput
            label={translate("resources.project.myc_data.estimate_f5")}
            source="myc_data.estimate_f5"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>
        <CustomInput
          fullWidth
          tooltipText={
            "tooltips.resources.project.myc_data.outstanding_commitments"
          }
        >
          <TextInput
            label={translate("resources.project.myc_data.outstanding_commitments")}
            source="myc_data.outstanding_commitments"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>

        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 20}}>
          Cummulative expenditure to end June FY0 + Approved budget + Total
          Estimates
        </Typography>
        <CustomInput
          fullWidth
          tooltipText={
            "tooltips.resources.project.myc_data.cumulative_expenditure"
          }
        >
          <TextInput
            label={translate("resources.project.myc_data.cumulative_expenditure")}
            source="myc_data.cumulative_expenditure"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>

        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 20}}>Total Project Value</Typography>
        <CustomInput
          fullWidth
          tooltipText={
            "tooltips.resources.project.myc_data.approved_project_costs"
          }
        >
          <TextInput
            label={translate("resources.project.myc_data.approved_project_costs")}
            source="myc_data.approved_project_costs"
            variant="outlined"
            margin="none"
            format={commasFormatter}
            parse={commasParser}
            validate={number()}
          />
        </CustomInput>

        <Typography variant="h4" style={{ marginLeft: 15, marginBottom: 20}}>
          Additional justification provided by the MDA
        </Typography>
        <CustomInput
          fullWidth
          tooltipText={"tooltips.resources.project.myc_data.mda_comments"}
        >
          <TextInput
            source="myc_data.mda_comments"
            variant="outlined"
            margin="none"
            label={translate("resources.project.myc_data.mda_comments")}
          />
        </CustomInput>
      </SimpleForm>
    </Edit>
  );
};

export default MYCDataEntry;

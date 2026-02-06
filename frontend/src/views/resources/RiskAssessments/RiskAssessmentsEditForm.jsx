import { Typography } from "@material-ui/core";
import moment from "moment";
import React from "react";
import {
  DateInput,
  SelectInput,
  SimpleForm,
  TextInput,
  useTranslate,
  useDataProvider,
  FormDataConsumer,
  BooleanInput,
} from "react-admin";
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const RiskAssessmentsEditForm = ({ projectDetails, project, ...props }) => {
  const [dateRange, setDateRange] = React.useState([]);
  const dataProvider = useDataProvider();

  React.useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: props.record?.project_detail_id,
      })
      .then((resp) => {
        if (resp && resp.data) {
          const { start_date, end_date } = resp.data;
          setDateRange(getFiscalYearsRangeForIntervals(start_date, end_date));
        }
      });
  }, []);

  const translate = useTranslate();
  const LEVELS = [
    {
      id: "LOW",
      name: translate(
        "resources.project_options.fields.analytical_modules.risk_evaluations.levels.low"
      ),
    },
    {
      id: "MEDIUM",
      name: translate(
        "resources.project_options.fields.analytical_modules.risk_evaluations.levels.medium"
      ),
    },
    {
      id: "HIGH",
      name: translate(
        "resources.project_options.fields.analytical_modules.risk_evaluations.levels.high"
      ),
    },
  ];

  return (
    <SimpleForm
      {...props}
      toolbar={
        <CustomToolbar projectDetailId={props.record?.project_detail_id} />
      }
      sanitizeEmptyValues={false}
      redirect={() => {
        return `/risk-assessments/${props.record?.project_detail_id}/list`;
      }}
    >
      <Typography variant="h3" style={{ margin: "5px 10px 10px 10px" }}>
        Risk Monitoring
      </Typography>
      <CustomInput
        tooltipText={"tooltips.resources.risk_assessments.fields.description"}
        fullWidth
      >
        <TextInput source="description" variant="outlined" margin="none" />
      </CustomInput>

      <CustomInput
        tooltipText={
          "tooltips.resources.risk_assessments.fields.has_risk_occurred"
        }
        bool
      >
        <BooleanInput
          label={"is risk occurred"}
          source="has_risk_occurred"
          variant="outlined"
          margin="none"
        />
      </CustomInput>

      <CustomInput
        tooltipText={"tooltips.resources.risk_assessments.fields.effects"}
        fullWidth
      >
        <TextInput source="effects" variant="outlined" margin="none" />
      </CustomInput>
      <CustomInput
        tooltipText={
          "tooltips.resources.risk_assessments.fields.mitigation_response"
        }
        fullWidth
      >
        <TextInput
          source="mitigation_response"
          variant="outlined"
          margin="none"
        />
      </CustomInput>
    </SimpleForm>
  );
};

export default RiskAssessmentsEditForm;

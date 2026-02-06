import moment from "moment";
import React from "react";
import {
  DateInput,
  SelectInput,
  SimpleForm,
  TextInput,
  useTranslate,
  useDataProvider,
} from "react-admin";
import { QUARTERS } from "../../../constants/common";
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const StakeholderEngagementsEditForm = ({
  projectDetails,
  project,
  ...props
}) => {
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
      toolbar={<CustomToolbar projectDetailId={props.record?.project_detail_id} />}
      sanitizeEmptyValues={false}
      redirect={() => {
        return `/stakeholder-engagements/${props.record?.project_detail_id}/list`;
      }}
    >
      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.reporting_date"
        }
        fullWidth
      >
        <SelectInput
          variant="outlined"
          margin="none"
          options={{
            fullWidth: "true",
          }}
          source={"reporting_date"}
          choices={dateRange}
          parse={(value) =>
            value && moment(value).startOf("year").format("YYYY-MM-DD")
          }
          format={(value) => value && moment(value).format("YYYY")}
        />{" "}
      </CustomInput>
      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.reporting_quarter"
        }
        fullWidth
      >
        <SelectInput
          variant="outlined"
          margin="none"
          options={{
            fullWidth: "true",
          }}
          source={"reporting_quarter"}
          choices={QUARTERS}
        />
      </CustomInput>
      <CustomInput
        tooltipText={"tooltips.resources.stakeholder-engagements.fields.name"}
        fullWidth
      >
        <TextInput source="name" variant="outlined" margin="none" />
      </CustomInput>
      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.interest_level"
        }
        fullWidth
      >
        <SelectInput
          variant="outlined"
          margin="none"
          options={{
            fullWidth: "true",
          }}
          source={"interest_level"}
          choices={LEVELS}
        />
      </CustomInput>
      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.influence_level"
        }
        fullWidth
      >
        <SelectInput
          variant="outlined"
          margin="none"
          options={{
            fullWidth: "true",
          }}
          source={"influence_level"}
          choices={LEVELS}
        />
      </CustomInput>
      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.engagement_status"
        }
        fullWidth
      >
        <TextInput
          source="engagement_status"
          variant="outlined"
          margin="none"
        />
      </CustomInput>
      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.engagement_level"
        }
        fullWidth
      >
        <SelectInput
          variant="outlined"
          margin="none"
          options={{
            fullWidth: "true",
          }}
          source={"engagement_level"}
          choices={LEVELS}
        />
      </CustomInput>
      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.engagement_frequency"
        }
        fullWidth
      >
        <TextInput
          source="engagement_frequency"
          variant="outlined"
          margin="none"
        />
      </CustomInput>
      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.communication_channel"
        }
        fullWidth
      >
        <TextInput
          source="communication_channel"
          variant="outlined"
          margin="none"
        />
      </CustomInput>
      <CustomInput
        tooltipText={"tooltips.resources.stakeholder-engagements.fields.issues"}
        fullWidth
      >
        <TextInput source="issues" variant="outlined" margin="none" />
      </CustomInput>

      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.mitigation_plan"
        }
        fullWidth
      >
        <TextInput source="mitigation_plan" variant="outlined" margin="none" />
      </CustomInput>

      <CustomInput
        tooltipText={
          "tooltips.resources.stakeholder-engagements.fields.responsible_entity"
        }
        fullWidth
      >
        <TextInput
          source="responsible_entity"
          variant="outlined"
          margin="none"
        />
      </CustomInput>
    </SimpleForm>
  );
};

export default StakeholderEngagementsEditForm;

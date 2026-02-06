import moment from "moment";
import React from "react";
import {
  Create,
  FormDataConsumer,
  SelectInput,
  SimpleForm,
  TextInput,
  useTranslate,
  Button,
  useRedirect,
} from "react-admin";
import axios from "axios";
import { QUARTERS } from "../../../constants/common";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";
import { API_URL } from "../../../constants/config";
import { TOKEN } from "../../../constants/auth";

const StakeholderEngagementsCreate = (props) => {
  const [dateRange, setDateRange] = React.useState([]);
  const [projectDetails, setProjectDetails] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const redirect = useRedirect();
  const projectDetailId = props.match?.params?.projectId;

  React.useEffect(() => {
    if (!projectDetailId) return;
    const token = localStorage.getItem(TOKEN);
    const headers = {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };

    axios
      .get(`${API_URL}/project-details/${projectDetailId}?missing_ok=1`, {
        headers,
        validateStatus: (status) => status === 200 || status === 404,
      })
      .then((res) => {
        if (res.status !== 200) return;
        const detailData = res.data?.data ?? res.data;
        if (!detailData) return;
        const { start_date, end_date } = detailData;
        setDateRange(getFiscalYearsRangeForIntervals(start_date, end_date));
        setProjectDetails(formatValuesToQuery({ ...detailData }));

        const projectId = detailData.project_id;
        if (projectId == null || Number.isNaN(Number(projectId))) return;
        return axios.get(`${API_URL}/projects/${projectId}`, {
          headers,
          validateStatus: (status) => status === 200 || status === 404,
        });
      })
      .then((res) => {
        if (!res || !res.config) return;
        if (res.status === 200 && res.data) {
          const data = res.data?.data ?? res.data;
          if (data) setProject(formatValuesToQuery({ ...data }));
        }
      })
      .catch(() => {});
  }, [projectDetailId]);

  function getTitle() {
    const code = projectDetails?.project?.code ?? project?.code;
    const name = projectDetails?.project?.name ?? project?.name;
    if (code && name) return <h2 style={{ width: "100%" }}>{`${code} - ${name}`}</h2>;
    return null;
  }

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
    <Create {...props} undoable={false}>
      <SimpleForm
        redirect={() => {
          return `/stakeholder-engagements/${props.match?.params?.projectId}/list`;
        }}
        toolbar={
          <CustomToolbar projectDetailId={props.match?.params?.projectId} />
        }
      >
        {/* Amon */}
        <div className="float-start">
          <Button
            onClick={() => {
              redirect(
                `/implementation-module/${Number(
                  props.match?.params?.projectId
                )}/costed-annualized-plan`
              );
            }}
            label="Back"
            color="primary"
            startIcon={<ArrowBackIcon />}
            // style={{ margin: "10px 0px" }}
          />
        </div>

            <h1>{"Create Stakeholder"}</h1>
        {getTitle()}


        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (props.match?.params?.projectId && formData) {
              formData.project_detail_id = props.match?.params?.projectId;
            }

            return null;
          }}
        </FormDataConsumer>
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
          tooltipText={
            "tooltips.resources.stakeholder-engagements.fields.issues"
          }
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
          <TextInput
            source="mitigation_plan"
            variant="outlined"
            margin="none"
          />
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
    </Create>
  );
};

export default StakeholderEngagementsCreate;

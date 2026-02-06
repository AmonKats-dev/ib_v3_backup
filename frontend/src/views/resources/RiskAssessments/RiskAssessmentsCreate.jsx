import moment from "moment";
import React from "react";
import {
  Create,
  FormDataConsumer,
  SimpleForm,
  TextInput,
  useTranslate,
  BooleanInput,
  useRedirect,
  Button,
} from "react-admin";
import axios from "axios";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { formatValuesToQuery } from "../../../helpers/dataHelpers";
import { getFiscalYearsRangeForIntervals } from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";
import { Typography } from "@material-ui/core";
import { API_URL } from "../../../constants/config";
import { TOKEN } from "../../../constants/auth";

const RiskAssessmentsCreate = (props) => {
  const [dateRange, setDateRange] = React.useState([]);
  const [details, setDetails] = React.useState([]);
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
        setDetails(formatValuesToQuery({ ...detailData }));
        setDateRange(getFiscalYearsRangeForIntervals(start_date, end_date));

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

  function getTitle() {
    const code = details?.project?.code ?? project?.code;
    const name = details?.project?.name ?? project?.name;
    if (code && name) return <h1 style={{ width: "100%" }}>{`${code} - ${name}`}</h1>;
    return null;
  }

  return (
    <Create {...props} undoable={false}>
      <SimpleForm
        redirect={() => {
          return `/risk-assessments/${props.match?.params?.projectId}/list`;
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

        {getTitle()}

        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (props.match?.params?.projectId && formData) {
              formData.project_detail_id = props.match?.params?.projectId;
            }

            return null;
          }}
        </FormDataConsumer>
        <Typography variant="h4" style={{ margin: "5px 10px 10px 10px" }}>
          Risk Monitoring
        </Typography>

        <CustomInput
          tooltipText={
            "tooltips.resources.risk_assessments.fields.has_risk_occurred"
          }
          bool
        >
          <BooleanInput
            source="has_risk_occurred"
            variant="outlined"
            margin="none"
          />
        </CustomInput>
        <FormDataConsumer>
          {({ getSource, scopedFormData, formData, ...rest }) => {
            if (props.match?.params?.projectId && formData) {
              formData.project_detail_id = props.match?.params?.projectId;
            }

            return formData.has_risk_occurred ? null : (
              <Typography variant="h4" style={{ margin: "5px 10px 10px 10px" }}>
                Additional Risk
              </Typography>
            );
          }}
        </FormDataConsumer>
        <CustomInput
          tooltipText={"tooltips.resources.risk_assessments.fields.description"}
          fullWidth
        >
          <TextInput source="description" variant="outlined" margin="none" />
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
    </Create>
  );
};

export default RiskAssessmentsCreate;

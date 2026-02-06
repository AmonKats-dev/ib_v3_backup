import moment from "moment";
import React from "react";
import {
  Create,
  DateInput,
  FormDataConsumer,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useDataProvider,
  useTranslate,
  Button,
  useRedirect, //Amon
} from "react-admin";
import { QUARTERS } from "../../../constants/common";
import ArrowBackIcon from "@material-ui/icons/ArrowBack"; //Amon
import { formatValuesToQuery } from "../../../helpers/dataHelpers"; //Amon
import {
  getFiscalYearsRangeForIntervals,
  getFiscalYearValueFromYear,
} from "../../../helpers/formatters";
import CustomInput from "../../components/CustomInput";
import CustomToolbar from "../../components/CustomToolbar";

const HumanResourcesCreate = (props) => {
  const translate = useTranslate();
  const [dateRange, setDateRange] = React.useState([]);
  const dataProvider = useDataProvider();
  //Amon
  const [projectDetails, setProjectDetails] = React.useState(null);
  const [project, setProject] = React.useState(null);
  const redirect = useRedirect();

  React.useEffect(() => {
    dataProvider
      .getOne("project-details", {
        id: props.match?.params?.projectId,
      })
      .then((resp) => {
        if (resp && resp.data) {
          const { start_date, end_date } = resp.data;
          setDateRange(getFiscalYearsRangeForIntervals(start_date, end_date));
          setProjectDetails(formatValuesToQuery({ ...resp.data })); //Amon
        }
      });

    //Amon
    dataProvider
      .getOne("projects", {
        id: props.match?.params?.projectId,
      })
      .then((res) => {
        if (res && res.data) {
          setProject(formatValuesToQuery({ ...res.data }));
        }
      });
      
  }, []);

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
    return (
      <h2 style={{ width: "100%" }}>
        {projectDetails &&
          projectDetails.project &&
          `${projectDetails.project.code} - ${projectDetails.project.name}`}
      </h2>
    );
  }

  return (
    <Create {...props} undoable={false} actions={false}>
      <SimpleForm
        redirect="show"
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
          <h1>{"Create Human Resource"}</h1>
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
            "tooltips.resources.human-resources.fields.reporting_date"
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
            validate={required()}
          />
        </CustomInput>
        <CustomInput
          tooltipText={
            "tooltips.resources.human-resources.fields.reporting_quarter"
          }
          fullWidth
        >
          <SelectInput
            validate={required()}
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
          tooltipText={"tooltips.resources.human-resources.fields.name"}
          fullWidth
        >
          <TextInput
            source="name"
            variant="outlined"
            margin="none"
            validate={required()}
          />
        </CustomInput>
        <CustomInput
          tooltipText={"tooltips.resources.human-resources.fields.position"}
          fullWidth
        >
          <TextInput
            source="position"
            variant="outlined"
            margin="none"
            validate={required()}
          />
        </CustomInput>
        <CustomInput
          tooltipText={
            "tooltips.resources.human-resources.fields.contact_details"
          }
          fullWidth
        >
          <TextInput
            source="contact_details"
            variant="outlined"
            margin="none"
            validate={required()}
          />
        </CustomInput>
        <CustomInput
          tooltipText={
            "tooltips.resources.human-resources.fields.responsible_entity"
          }
          fullWidth
        >
          <TextInput
            source="responsible_entity"
            variant="outlined"
            margin="none"
            validate={required()}
          />
        </CustomInput>
        <CustomInput
          tooltipText={
            "tooltips.resources.human-resources.fields.involvement_level"
          }
          fullWidth
        >
          <SelectInput
            variant="outlined"
            margin="none"
            options={{
              fullWidth: "true",
            }}
            source={"involvement_level"}
            choices={LEVELS}
            validate={required()}
          />
        </CustomInput>
      </SimpleForm>
    </Create>
  );
};

export default HumanResourcesCreate;

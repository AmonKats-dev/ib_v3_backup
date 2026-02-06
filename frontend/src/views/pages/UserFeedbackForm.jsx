import React, { useEffect, useState } from "react";
import { API_URL } from "../../constants/config";
import { getdata, postData } from "../../data/providers/archiveData";
import { Button, FormLabel, LinearProgress } from "@material-ui/core";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";

let selectedProgrammes = "";
let isUser = "true";
export default function UserFeedbackForm() {
  const [programmes, setProgrammes] = useState(<LinearProgress />);
  const [userRole, setUserRole] = useState(null);
  const [enrollmentYear, setEnrollmentYear] = useState(null);
  const [centralRepositoryExpectations, setCentralRepositoryExpectations] =
    useState(null);
  const [
    institutionalCoordinationExpection,
    setInstitutionalCoordinationExpection,
  ] = useState(null);
  const [timeSavingExpectation, setTimeSavingExpectation] = useState(null);
  const [resourceSavingExpectations, setResoureSavingExpectations] =
    useState(null);
  const [transparencyExpectations, setTransparencyExpectations] =
    useState(null);
  const [streamliningExpectations, setStreamliningExpextations] =
    useState(null);
  const [reliabilityExpectations, setReliabilityExpectations] = useState(null);
  const [userFriendlinessExpectations, setUserFriendlinessExpecations] =
    useState(null);
  const [securityRating, setSecurityRating] = useState(null);
  const [supportTeamRating, setSupportTeamRating] = useState(null);

  useEffect(() => {
    getdata({ endpoint: `programs` }).then((programmes) => {
      setProgrammes(
        <FormGroup>
          <FormLabel>
            Select the Programme for your Institution <Required />{" "}
          </FormLabel>
          {programmes.map((programme) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    id={programme.name}
                    onChange={(e) => {
                      e.target.checked
                        ? handleSelectProgramme(programme.name)
                        : handleUnselectProgramme(programme.name);
                    }}
                  />
                }
                label={programme.name}
              />
            );
          })}
        </FormGroup>
      );
    });
  }, []);

  return (
    <div className="user-feedback-from-div">
      <div className="form-div-title">
        <div className="ribbon"></div>
        <div className="form-heading">Evaluation on the IBP Phase one</div>
        <p dir="ltr">
          As part of the wide Public Financial Management(PFM) particularly
          Public Investment Management (PIM) reform, the Government of Uganda
          under the Ministry of Finance, Planning and Economic Development
          (MOFPED) with support from the Foreign Commonwealth Development Office
          (FCDO) and World Bank developed the Integrated Bank of Projects (IBP)
          which is an online-based software that serves as a database that
          contains information about public projects from start to closure. It
          is a central depository for public project information during project
          preparation, appraisal, selection, budget formulation,
          implementation/execution, and monitoring and evaluation. The IBP can
          be accessed at (
          <a href="https://ibp.finance.go.ug">https://ibp.finance.go.ug</a>).
        </p>
        <p dir="ltr">
          The first phase of the IBP that covers the pre-investment stage of the
          project cycle and institutional approvals during project preparation
          i.e. Concept, Profile, Pre-feasibility, and Feasibility Study was
          developed and launched to all PIM stakeholders in April 2019.
          Consequently, all Ministries, Departments and Agencies (MDAs)
          commenced preparation and submission of all project documentation
          under the pre-investment stage through the IBP for consideration by
          the Development Committee (DC).
        </p>
        <p dir="ltr">
          <b>
            This phase that has been in operation for the last four years is
            under evaluation to establish whether it achieved its set
            objectives.
          </b>
          You have been identified as a key informant/user of the IBP to
          participant in the evaluation aimed at improving the system. The
          evaluation is undertaken by Makerere University's PIM center of
          excellence in partnership with MOFPED.
        </p>
        <p>
          Your views are invaluable and will be treated with utmost
          confidentiality. Thanks for agreeing to participate in this
          evaluation.
        </p>
        <p style={{ color: "red" }}>* Indicates required question</p>
      </div>
      <div className="form-div">{programmes}</div>
      <div className="form-div">
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            Are you an IBP user? <Required />
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value="Yes"
            name="radio-buttons-group"
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            Which Role do you place on the IBP? <Required />
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setUserRole(value);
            }}
          >
            <FormControlLabel
              value="Standard User responsible for creating projects on the system"
              control={<Radio />}
              label="Standard User responsible for creating projects on the system"
            />
            <FormControlLabel
              value="Planning Department User"
              control={<Radio />}
              label="Planning Department User"
            />
            <FormControlLabel
              value="Accounting Officer"
              control={<Radio />}
              label="Accounting Officer"
            />
            <FormControlLabel
              value="Program Head"
              control={<Radio />}
              label="Program Head"
            />
            <FormControlLabel
              value="Development Committee member"
              control={<Radio />}
              label="Development Committee member"
            />
            <FormControlLabel
              value="Development Partners"
              control={<Radio />}
              label="Development Partners"
            />
            <FormControlLabel
              value="Project Analysis and Public Investment(PAP)"
              control={<Radio />}
              label="Project Analysis and Public Investment(PAP)"
            />
            <FormControlLabel
              value="Global viewer"
              control={<Radio />}
              label="Global viewer"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            Which Year did you get enrolled onto the IBP? <Required />
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setEnrollmentYear(value);
            }}
          >
            <FormControlLabel value="2019" control={<Radio />} label="2019" />
            <FormControlLabel value="2020" control={<Radio />} label="2020" />
            <FormControlLabel value="2021" control={<Radio />} label="2021" />
            <FormControlLabel value="2022" control={<Radio />} label="2022" />
            <FormControlLabel value="2023" control={<Radio />} label="2023" />
            <FormControlLabel value="2024" control={<Radio />} label="2024" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        {" "}
        According to your experience using the IBP, to what extent has the
        system met the expectation on acting as a central depository for storing
        project information <Required />
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setCentralRepositoryExpectations(value);
            }}
          >
            <FormLabel>Not at all</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>To a large extent</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        According to your experience using the IBP, to what extent has the
        system improved institutional coordination during project preparation
        and appraisal
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setInstitutionalCoordinationExpection(value);
            }}
          >
            <FormLabel>Not at all</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>To a large extent</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        According to your experience using the IBP, to what extent has the
        system assisted in saving time during project preparation and appraisal
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setTimeSavingExpectation(value);
            }}
          >
            <FormLabel>Not at all</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>To a large extent</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        According to your experience using the IBP, to what extent has the
        system assisted in saving resources(money) during project preparation
        and appraisal
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setResoureSavingExpectations(value);
            }}
          >
            <FormLabel>Not at all</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>To a large extent</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        According to your experience using the IBP, to what extent has the
        system improved transparency and accountability during project
        preparation and appraisal
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setTransparencyExpectations(value);
            }}
          >
            <FormLabel>Poor</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>Very Satisfactory</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        Has the IBP improved streamlining the Public Investment Management
        process/cycle?
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(evetn, value) => {
              setStreamliningExpextations(value);
            }}
          >
            <FormLabel>Not at all</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>To a greater extent</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        Can you rate the system in regard to its reliability
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setReliabilityExpectations(value);
            }}
          >
            <FormLabel>Unreliable</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>Very Reliable</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        Can you rate the system in regard to its user friendly
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setUserFriendlinessExpecations(value);
            }}
          >
            <FormLabel>Not user friendly</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>Very user friendly</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        Can you rate the system in regard to its security of information?
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setSecurityRating(value);
            }}
          >
            <FormLabel>Unsecure</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>Very Secure</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        Can you rate the IBP support team?
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={(event, value) => {
              setSupportTeamRating(value);
            }}
          >
            <FormLabel>Unsupportivr</FormLabel>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormLabel>Very Supportive</FormLabel>
          </RadioGroup>
        </FormControl>
      </div>
      <div className="form-div">
        How has the IBP assisted you in project development
        <Required />
        <textarea
          id="assisting-project-development-text-area"
          type="text"
          placeholder="Your Answer"
          className="form-input-field"
        />
      </div>
      <div className="form-div">
        In what ways has IBP improved institutional coordination, saved time in
        protect preparation and acted as a central depository to project
        information
        <Required />
        <textarea
          id="improved-institutional-coordination-textarea"
          type="text"
          placeholder="Your Answer"
          className="form-input-field"
        />
      </div>
      <div className="form-div">
        What challenges have you experienced while using the IBP system?
        <Required />
        <textarea
          id="challenges-text-area"
          type="text"
          placeholder="Your Answer"
          className="form-input-field"
        />
      </div>
      <div className="form-div">
        What suggestions do you propose to improve the system performance?
        <Required />
        <textarea
          id="suggestions-text-area"
          type="text"
          placeholder="Your Answer"
          className="form-input-field"
        />
      </div>
      <div className="form-div">
        Thank you for your feedback on evaluation of the IBP system and
        recommendations for improvement.
        <img alt="Thank You" src="thank-u.png" />
      </div>
      <button
        className="feedback-form-submit-button"
        onClick={() => {
          let assistingProjectDevelopment = document.getElementById(
            "assisting-project-development-text-area"
          ).value;
          let improvedInstitutionalCoordination = document.getElementById(
            "improved-institutional-coordination-textarea"
          ).value;
          let challenges = document.getElementById(
            "challenges-text-area"
          ).value;
          let suggestions = document.getElementById(
            "suggestions-text-area"
          ).value;
          let name = JSON.parse(localStorage.getItem("user")).full_name;

          if (
            selectedProgrammes === "" ||
            userRole === null ||
            enrollmentYear === null ||
            centralRepositoryExpectations === null ||
            institutionalCoordinationExpection === null ||
            timeSavingExpectation === null ||
            resourceSavingExpectations === null ||
            transparencyExpectations === null ||
            streamliningExpectations === null ||
            reliabilityExpectations === null ||
            userFriendlinessExpectations === null ||
            securityRating === null ||
            supportTeamRating === null ||
            assistingProjectDevelopment === "" ||
            improvedInstitutionalCoordination === "" ||
            challenges === "" ||
            suggestions === ""
          ) {
            alert("Please fill in all mandatory fields");
          } else {
            postData({
              endpoint: "evaluation",
              data: {
                name: name,
                programme: selectedProgrammes,
                role: userRole,
                is_user: isUser,
                year_enrolled: enrollmentYear,
                central_repository: centralRepositoryExpectations,
                institutional_coordination: institutionalCoordinationExpection,
                time_saving: timeSavingExpectation,
                resource_saving: resourceSavingExpectations,
                transpanrency: transparencyExpectations,
                streamlining_pims: streamliningExpectations,
                reliability: reliabilityExpectations,
                user_frienliness: userFriendlinessExpectations,
                security_rating: securityRating,
                support_rating: supportTeamRating,
                assisted_project_development: assistingProjectDevelopment,
                coordination_time_preparation:
                  improvedInstitutionalCoordination,
                challenges: challenges,
                suggestions: suggestions,
              },
            });
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}

function handleSelectProgramme(programme) {
  selectedProgrammes = selectedProgrammes.concat(`${programme}, `);
}

function handleUnselectProgramme(programme) {
  selectedProgrammes = selectedProgrammes.replace(`${programme}, `, "");
}

const Required = () => <label style={{ color: "red" }}>*</label>;

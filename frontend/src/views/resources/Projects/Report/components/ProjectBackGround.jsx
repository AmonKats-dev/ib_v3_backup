import { Button, useDataProvider, useTranslate } from "react-admin";
// import CustomMap from '../../../components/customMap';
import HTML2React from "html2react";
import Map from "@material-ui/icons/Map";
import React from "react";
// import { Table } from 'reactstrap';
import lodash from "lodash";
import { GOOGLE_MAP_API_KEY } from "../../../../../constants/common";
import { romanize } from "../../../../../helpers/formatters";
import { Stakeholders } from "./Stakeholders";
import { checkFeature } from "../../../../../helpers/checkPermission";
import { useRef } from "react";
import { useSelector } from "react-redux";

export const ProjectBackGround = (props) => {
  const phaseId = props.customRecord.phase_id;
  const { customRecord } = props;
  const [locationsData, setLocationsData] = React.useState([]);
  const [interventions, setInterventions] = React.useState([]);
  const translate = useTranslate();
  const hasPimisFields = checkFeature("has_pimis_fields");
  const dataProvider = useDataProvider();
  const { isExporting } = useSelector((state) => state.ui);

  const mapRef = useRef();
  const mapContainer = mapRef?.current;

  React.useEffect(() => {
    dataProvider.getListOfAll("locations", {}).then((response) => {
      setLocationsData(response.data);
    });
    dataProvider.getListOfAll("interventions", {}).then((response) => {
      setInterventions(response.data);
    });
  }, []);

  const getLocationName = (customRecord) => {
    const location = lodash.find(
      locationsData,
      (item) => Number(item.id) === Number(customRecord.location_id)
    );

    return location ? location.name : null;
  };

  const counter = props.counter || 1;
  let markersCoords = [];

  if (!customRecord) return null;

  if (hasPimisFields)
    return (
      <div className="Section2">
        <div className="content-area">
          <h2>
            {romanize(counter)}. {translate("printForm.background.title")}
          </h2>
          <div>
            <p>
              <strong>
                {romanize(counter + ".1.")}{" "}
                {translate("printForm.background.stakeholder_consultation")}
              </strong>
            </p>
            {HTML2React(customRecord.stakeholder_consultation)}
          </div>
          <div>
            <p>
              <strong>
                {romanize(counter + ".1.")}{" "}
                {translate("printForm.background.situation_analysis")}
              </strong>
            </p>
            {HTML2React(customRecord.situation_analysis)}
          </div>
          <div>
            <p>
              <strong>
                {romanize(counter + ".1.")}{" "}
                {translate("printForm.background.problem_statement")}
              </strong>
            </p>
            {HTML2React(customRecord.problem_statement)}
          </div>
          <div>
            <p>
              <strong>
                {romanize(counter + ".1.")}{" "}
                {translate("printForm.background.problem_cause")}
              </strong>
            </p>
            {HTML2React(customRecord.problem_cause)}
          </div>
          <div>
            <p>
              <strong>
                {romanize(counter + ".1.")}{" "}
                {translate("printForm.background.problem_effects")}
              </strong>
            </p>
            {HTML2React(customRecord.problem_effects)}
          </div>
          <div>
            <p>
              <strong>
                {romanize(counter + ".1.")}{" "}
                {translate("printForm.background.justification")}
              </strong>
            </p>
            {HTML2React(customRecord.justification)}
          </div>
          <div>
            <p>
              <strong>
                {romanize(counter + ".1.")}{" "}
                {translate("printForm.background.me_strategies")}
              </strong>
            </p>
            {HTML2React(customRecord.me_strategies)}
          </div>
          <div>
            <p>
              <strong>
                {romanize(counter + ".8.")}{" "}
                {translate("printForm.background.risk_assessment")}
              </strong>
            </p>
            {HTML2React(customRecord.risk_assessment)}
          </div>
          <div>
            <p>
              <strong>
                {romanize(counter + ".1.")}{" "}
                {translate("printForm.background.governance")}
              </strong>
            </p>
            {HTML2React(customRecord.governance)}
          </div>
          <div>
            <p>
              <strong>
                {romanize(counter + ".7.")}{" "}
                {translate("printForm.background.technical_description")}
              </strong>
            </p>
            {HTML2React(customRecord.summary)}
          </div>
        </div>
      </div>
    );

  var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap";
  staticMapUrl += "?center=" + 0.18 + "," + 32.37;
  staticMapUrl += "&size=700x300&scale=2";
  staticMapUrl += "&maptype=roadmap";
  staticMapUrl += "&zoom=" + 6;
  //key
  staticMapUrl += "&key=" + GOOGLE_MAP_API_KEY;

  if (customRecord && customRecord.geo_location) {
    if (customRecord.geo_location.indexOf(",") > -1) {
      try {
        markersCoords = [
          ...markersCoords,
          ...JSON.parse(customRecord.geo_location).map(
            (item) => `${String(item.lat)},${String(item.lng)}`
          ),
        ];
      } catch (error) {
        console.log(error);
      }
      staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap";
      staticMapUrl += "?center=" + 0.18 + "," + 32.37;
      staticMapUrl += "&size=700x300&scale=2";
      staticMapUrl += "&maptype=roadmap";
      staticMapUrl += "&zoom=" + 6;
      staticMapUrl += "&markers=" + markersCoords.join("|");
      //key
      staticMapUrl += "&key=" + GOOGLE_MAP_API_KEY;
    }
  }

  return (
    <div className="Section2">
      <div className="content-area" ref={mapRef}>
        <h2>
          {romanize(counter)}. {translate("printForm.background.title")}
        </h2>
        <div>
          <p>
            <strong>
              {romanize(counter + ".1.")}{" "}
              {translate("printForm.background.situation_analysis")}
            </strong>
          </p>
          {HTML2React(customRecord.situation_analysis)}
        </div>
        <div>
          <p>
            <strong>
              {romanize(counter + ".2.")}{" "}
              {translate("printForm.background.problem_statement")}
            </strong>
          </p>
          {HTML2React(customRecord.problem_statement)}
        </div>
        <div>
          <p>
            <strong>
              {romanize(counter + ".2.1.")}{" "}
              {translate("printForm.background.problem_cause")}
            </strong>
          </p>
          {HTML2React(customRecord.problem_cause)}
        </div>
        <div>
          <p>
            <strong>
              {romanize(counter + ".2.2.")}{" "}
              {translate("printForm.background.problem_effects")}
            </strong>
          </p>
          {HTML2React(customRecord.problem_effects)}
        </div>
        <div>
          <p>
            <strong>
              {romanize(counter + ".3.")}{" "}
              {translate("printForm.background.strategic_fit")}
            </strong>
          </p>
          {HTML2React(customRecord.strategic_fit)}
        </div>
        <div>
          {customRecord && customRecord.in_ndp ? (
            <RenderNdp {...props} interventions={interventions} />
          ) : (
            <RenderNdpOther {...props} interventions={interventions} />
          )}
        </div>
        <div>
          <p>
            <strong>
              {romanize(counter + ".4.")}{" "}
              {translate("printForm.background.justification")}
            </strong>
          </p>
          {HTML2React(customRecord.justification)}
        </div>
        <div>
          <p>
            <strong>
              {romanize(counter + ".5.")}{" "}
              {translate("printForm.background.stakeholders")}
            </strong>
          </p>
          {(customRecord.stakeholders || []).map((item, idx) => (
            <div key={item?.id || `stakeholder-${idx}`}>
              <p>Name: </p>
              <p>{item.name}</p>
              {item.responsibilities && (
                <div style={{ fontStyle: "italic" }}>
                  <p>Responsibilities:</p>
                  {HTML2React(item.responsibilities)}
                </div>
              )}
            </div>
          ))}
          <br />
          <div>
            <p>
              <strong>
                {translate("printForm.background.affected_population")}
              </strong>
            </p>
            {HTML2React(customRecord.affected_population)}
          </div>
        </div>
        <div>
          <p>
            <strong>
              {romanize(counter + ".6.")}{" "}
              {translate("printForm.background.location")}
            </strong>
            {checkFeature("project_has_google_map") && (
              <Button
                label={
                  props.showMap
                    ? translate("buttons.hide_map")
                    : translate("buttons.show_map")
                }
                onClick={props.onShowMap}
                className="static_map_btn"
                style={{ marginLeft: "15px" }}
              >
                <Map />
              </Button>
            )}
          </p>
          {(props.showMap || isExporting) && (
            <p>
              <img
                id="map_img"
                className="static_map"
                width="650px"
                height="400px"
                src={staticMapUrl}
                alt="GeoMap of Project Location"
              />
            </p>
          )}
          {!lodash.isEmpty(customRecord.locations)
            ? customRecord.locations.map((item, idx) => (
                <p key={item?.id || item?.location?.id || `loc-${idx}`}>
                  {item && item.location
                    ? `${item.location.parent?.name + " - " || ""} ${
                        item.location.name
                      }`
                    : "-"}
                </p>
              ))
            : customRecord.additional_data &&
              customRecord.additional_data.location
            ? HTML2React(customRecord.additional_data.location)
            : null}
        </div>
        <div>
          <p>
            <strong>
              {romanize(counter + ".7.")}{" "}
              {translate("printForm.background.technical_description")}
            </strong>
          </p>
          {HTML2React(customRecord.summary)}
        </div>

        {/* <div>
          <p>
            <strong>
              {romanize(counter + ".8.")}{" "}
              {translate("printForm.background.expected_fund_source")}
            </strong>
          </p>
          {HTML2React(customRecord.expected_fund_source)}
        </div> */}
        {phaseId === 5? <div>
          <p>
            <strong>
              {romanize(counter + ".9.")}{" "}
              {translate("printForm.background.national_scope")}
            </strong>
          </p>
          {HTML2React(customRecord.national_scope)}
        </div> : <></>}
        
        {phaseId === 5? <div>
          <p>
            <strong>
              {romanize(counter + ".10.")}{" "}
              {translate("printForm.background.procurement_plan_description")}
            </strong>
          </p>
          {HTML2React(customRecord.procurement_plan_description)}
        </div> : <></>}
        
        {phaseId === 5?<div>
          <p>
            <strong>
              {romanize(counter + ".11.")}{" "}
              {translate("printForm.background.work_plan_description")}
            </strong>
          </p>
          {HTML2React(customRecord.work_plan_description)}
        </div> : <></>}
        
      </div>
    </div>
  );
};

const RenderNdp = (props) => {
  const { customRecord, interventions } = props;
  const translate = useTranslate();

  if (!customRecord) return null;

  if (customRecord.ndp_type === "core") {
    return (
      <div>
        <p style={{ fontWeight: "bold" }}>
          {translate("printForm.background.ndp_project_name")}:
        </p>
        <p>{customRecord.ndp_name}</p>
        <p style={{ fontWeight: "bold" }}>
          {translate("printForm.background.ndp_page_no")}:
        </p>
        <p>{customRecord.ndp_page_no}</p>
        <p style={{ fontWeight: "bold" }}>
          {translate("printForm.background.details")}:
        </p>
        {HTML2React(customRecord.ndp_plan_details)}
      </div>
    );
  }
  return (
    <div>
      <div>
        <p style={{ fontWeight: "bold" }}>
          {translate("printForm.background.ndp_focus_area")}:
        </p>
        <p>{customRecord.ndp_focus_area}</p>
      </div>
      <div>
        <p style={{ fontWeight: "bold" }}>
          {translate("printForm.background.ndp_intervention")}:
        </p>
        <p>{customRecord.ndp_intervention}</p>
        {interventions
          .filter((item) =>
            customRecord.intervention_ids
              ? customRecord.intervention_ids.includes(item.id)
              : false
          )
          .map((item) => (
            <p key={item.id}>{item.name}</p>
          ))}
      </div>
      <div>
        <p style={{ fontWeight: "bold" }}>
          {translate("printForm.background.details")}:
        </p>
        {HTML2React(customRecord.ndp_plan_details)}
      </div>
    </div>
  );
};

const RenderNdpOther = (props) => {
  const { customRecord } = props;
  const translate = useTranslate();

  if (!customRecord) return null;

  return (
    <div>
      <p>{translate("printForm.background.strategic")}</p>
      {HTML2React(customRecord.ndp_strategic_directives)}
      <p>{translate("printForm.background.details")}</p>
      {HTML2React(customRecord.ndp_plan_details)}
    </div>
  );
};

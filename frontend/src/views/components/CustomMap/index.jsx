import React, { Component, useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import {
  GOOGLE_MAP_API_KEY,
  PROJECT_PHASES_COLORS,
} from "../../../constants/common";
import lodash from "lodash";
import Tooltip from "@material-ui/core/Tooltip";
import { useFormState } from "react-final-form";
import { useChangeField } from "../../../helpers/checkPermission";
import { useInput } from "react-admin";
import Geocode from "react-geocode";

Geocode.setApiKey(GOOGLE_MAP_API_KEY);

const getSelectedAddress = (lat, lng, callBack) => {
  Geocode.fromLatLng(String(lat), String(lng)).then(
    (response) => {
      let city, state, country;
      for (let i = 0; i < response.results[0].address_components.length; i++) {
        for (
          let j = 0;
          j < response.results[0].address_components[i].types.length;
          j++
        ) {
          switch (response.results[0].address_components[i].types[j]) {
            case "locality":
              city = response.results[0].address_components[i].long_name;
              break;
            case "administrative_area_level_1":
              state = response.results[0].address_components[i].long_name;
              break;
            case "country":
              country = response.results[0].address_components[i].long_name;
              break;
          }
        }
      }

      if (city || state || country) {
        callBack(`${city || ""}, ${state || ""}, ${country || ""}`);
      }
      callBack(null);
    },
    (error) => {
      console.error(error);
    }
  );
};

const markerStyle = {
  position: "relative",
  textAlign: "center",
  color: "#000",
  fontSize: 14,
  fontWeight: "bold",
  padding: 4,
};

const Marker = (props) => {
  const handleClick = () => {
    window.location.href = props.link;
  };

  const { text, color } = props;

  return (
    <Tooltip title={text} placement="right">
      <svg
        onClick={handleClick}
        x="0px"
        y="0px"
        width="8.6444445mm"
        height="9.847393mm"
        viewBox="0 0 512 512"
        enableBackground="new 0 0 512 512"
        style={{ transform: "translate(-25px, -60px)" }}
      >
        <g>
          <path
            fill={color}
            stroke="#000"
            strokeWidth="10px"
            d="M256.292,12.781c-98.628,0-178.585,79.955-178.585,178.585c0,42.256,13.724,77.289,34.268,113.638
                c48.065,85.042,144.533,193.714,144.533,193.714c64.417-69.391,147.02-206.308,147.02-206.308s31.351-63.531,31.351-101.044
                C434.877,92.736,354.921,12.781,256.292,12.781z M256.292,297.159c-66.021,0-119.546-53.523-119.546-119.546
                S190.271,58.067,256.292,58.067s119.546,53.522,119.546,119.546S322.313,297.159,256.292,297.159z"
          />
          <circle fill={color} cx="256.292" cy="177.613" r="72.107" />
        </g>
      </svg>
    </Tooltip>
  );
};

const SimpleMarker = ({ text, onClick, item }) => (
  <Tooltip title={text} placement="right">
    <svg
      x="0px"
      y="0px"
      width="8.6444445mm"
      height="9.847393mm"
      viewBox="0 0 512 512"
      enableBackground="new 0 0 512 512"
      style={{ transform: "translate(-15px, -35px)" }}
      onClick={onClick(item)}
    >
      <g>
        <path
          fill="#ff4646"
          d="M256.292,12.781c-98.628,0-178.585,79.955-178.585,178.585c0,42.256,13.724,77.289,34.268,113.638
            c48.065,85.042,144.533,193.714,144.533,193.714c64.417-69.391,147.02-206.308,147.02-206.308s31.351-63.531,31.351-101.044
            C434.877,92.736,354.921,12.781,256.292,12.781z M256.292,297.159c-66.021,0-119.546-53.523-119.546-119.546
            S190.271,58.067,256.292,58.067s119.546,53.522,119.546,119.546S322.313,297.159,256.292,297.159z"
        />
        <circle fill="#ff4646" cx="256.292" cy="177.613" r="72.107" />
      </g>
    </svg>
  </Tooltip>
);

const CustomMap = (props) => {
  const { values } = useFormState();
  const [state, setState] = useState({
    center: {
      lat: 0.18,
      lng: 32.37,
    },
    lng: "",
    lat: "",
    markers: [],
  });
  const defaultProps = {
    height: "300px",
    width: "100%",
    center: {
      lat: 0.18,
      lng: 32.37,
    },
    zoom: 7,
  };

  const changeGeoMap = useChangeField({ name: props.source });

  useEffect(() => {
    if (!props.isReport) {
      const { geo_location } = props.scopedFormData;

      if (geo_location) {
        if (geo_location && lodash.isString(geo_location)) {
          let markers = [];

          try {
            markers = JSON.parse(geo_location).map((item) => ({
              lng: String(item.lng),
              lat: String(item.lat),
              text: item.text,
            }));
          } catch (error) {
            console.log(error);
          }

          setState({ ...state, markers: markers });
        }
      }
    }
  }, []);

  const handleClick = async ({ x, y, lat, lng, event }) => {
    if (!props.isDisable) {
      const markers = lodash.cloneDeep(state.markers);
      getSelectedAddress(lat, lng, (text) => {
        if (text) {
          markers.push({
            lat,
            lng,
            text,
          });
          setState({ ...state, markers: markers });
          changeGeoMap(JSON.stringify(markers));
        }
      });
    }
  };

  const handleDeleteMarker = (marker) => (event) => {
    event.stopPropagation();

    const { markers } = state;
    if (lodash.find(markers, marker)) {
      const markersFiltered = lodash.filter(
        markers,
        (item) => !lodash.isEqual(marker, item)
      );
      setState({ ...state, markers: markersFiltered });
    }
  };

  function renderReportMap() {
    return (
      // Important! Always set the container height explicitly
      <div
        id="location_map"
        style={{ height: props.height, width: props.width }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
          defaultCenter={props.center}
          defaultZoom={props.zoom}
          onClick={handleClick}
        >
          {!lodash.isEmpty(props.data) &&
            lodash
              .keys(props.data)
              .map((phase_id) =>
                props.data[phase_id]
                  ? props.data[phase_id].map((item) =>
                      item.markers.map((marker) => (
                        <Marker
                          lat={marker.lat}
                          lng={marker.lng}
                          text={item.title}
                          link={`#/projects/${item.id}/show/${item.phase_id}`}
                          color={PROJECT_PHASES_COLORS[item.phase_id]}
                        />
                      ))
                    )
                  : null
              )}
        </GoogleMapReact>
      </div>
    );
  }

  function renderMap() {
    return (
      // Important! Always set the container height explicitly
      <div
        id="location_map"
        style={{ height: defaultProps.height, width: defaultProps.width }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAP_API_KEY }}
          defaultCenter={defaultProps.center}
          center={state.center || defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onClick={handleClick}
        >
          {state.markers.length !== 0 &&
            state.markers.map((item, idx) => (
              <SimpleMarker
                lat={item.lat}
                lng={item.lng}
                item={item}
                text={item.text}
                onClick={handleDeleteMarker}
              />
            ))}
        </GoogleMapReact>
      </div>
    );
  }

  return props.isReport ? renderReportMap() : renderMap();
};

export default CustomMap;

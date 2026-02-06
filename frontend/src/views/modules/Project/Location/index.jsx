import React, { Fragment, useEffect, useMemo, useRef } from "react";
import {
  TextInput,
  useTranslate,
  ArrayInput,
  SimpleFormIterator,
  FormDataConsumer,
  ReferenceArrayInput,
  required,
  ReferenceInput,
  SelectInput,
  SelectArrayInput,
  AutocompleteArrayInput,
  useDataProvider,
} from "react-admin";
import CustomMap from "../../../components/CustomMap";
import { Button } from "@material-ui/core";
import CustomInput from "../../../components/CustomInput";
import { useState } from "react";
import OrganisationalStructure from "../../OrganisationalStructure";
import useCheckFeature from "../../../../hooks/useCheckFeature";
import {
  checkFeature,
  useChangeField,
} from "../../../../helpers/checkPermission";
import { DEFAULT_SORTING } from "../../../../constants/common";
import lodash from "lodash";
import { checkRequired } from "../../../resources/Projects/validation";

function LocationsAutocomplete({
  scopedFormData,
  getSource,
  locationsData,
  formData,
}) {
  const translate = useTranslate();
  const refLink = useRef();
  const changeUpdate = useChangeField({ name: "check_update" });

  useEffect(() => {
    if (scopedFormData && scopedFormData.location_parent_id) {
      if (Number(scopedFormData.location_parent_id) === 77) {
        scopedFormData.location_ids = [77];
      } else {
        const childs = getLocationsByParent(
          Number(scopedFormData.location_parent_id)
        );

        if (childs && childs.length) {
          scopedFormData.location_ids = getLocationsByParent(
            Number(scopedFormData.location_parent_id)
          );
        }
      }

      changeUpdate(!formData.check_update);
    }
  }, [scopedFormData?.location_parent_id]);

  function getLocationsByParent(parentId) {
    const filtered = lodash.filter(
      locationsData,
      (item) => item.parent_id === parentId
    );
    return filtered ? filtered.map((item) => item.id) : [];
  }

  const islandWideLocation =
    locationsData && lodash.find(locationsData, (it) => it.code === "00");

  const notRequired =
    scopedFormData &&
    islandWideLocation &&
    Number(scopedFormData.location_parent_id) === Number(islandWideLocation.id);

  if (notRequired) return null;

  return (
    <div ref={refLink}>
      <CustomInput
        fullWidth
        tooltipText={"tooltips.resources.locations.fields.province"}
      >
        <ReferenceArrayInput
          sort={DEFAULT_SORTING}
          validate={!notRequired && required()}
          perPage={-1}
          source={getSource("location_ids")}
          reference="locations"
          filter={{
            level: 2,
            parent_id: scopedFormData && scopedFormData.location_parent_id,
          }}
          allowNull
          format={(v) => (!v ? null : v)}
          label={translate("resources.locations.fields.province")}
        >
          <AutocompleteArrayInput
            optionText="name"
            margin="none"
            variant="outlined"
            fullWidth
            shouldRenderSuggestions={true}
            autoFocus
          />
        </ReferenceArrayInput>
      </CustomInput>
    </div>
  );
}

function Location(props) {
  const { record, initialRecord, fromCreate } = props;
  const [locationsData, setLocationsData] = useState([]);
  const [showMap, setShowMap] = useState([]);
  const translate = useTranslate();
  const hasMultipleLocations = useCheckFeature("project_locations_multiple");
  const hasGeoMap = useCheckFeature("project_locations_geomap");
  const hasMultInput = useCheckFeature("project_locations_multiselect_input");

  const hasDefaultArrayInputValue = useCheckFeature(
    "has_default_array_input_value"
  );
  const changeLocations = useChangeField({ name: "locations" });

  const dataProvider = useDataProvider();

  useEffect(() => {
    if (checkFeature("has_pimis_fields") || checkFeature("has_esnip_fields"))
      dataProvider
        .getListOfAll("locations", { sort_field: "id" })
        .then((response) => {
          if (response && response.data) {
            setLocationsData(response.data);
          }
        });
  }, []);

  // When saved locations exist on the record but form is empty, push into form once
  // so Region name and Location name display. Use ref so we don't overwrite after user adds rows.
  const hasSyncedLocationsRef = useRef(false);
  // Reset sync ref when opening a different project detail so saved values display.
  const prevInitialRecordIdRef = useRef(initialRecord?.id);
  useEffect(() => {
    if (prevInitialRecordIdRef.current !== initialRecord?.id) {
      prevInitialRecordIdRef.current = initialRecord?.id;
      hasSyncedLocationsRef.current = false;
    }
  }, [initialRecord?.id]);
  const savedLocations =
    initialRecord?.locations &&
    Array.isArray(initialRecord.locations) &&
    initialRecord.locations.length > 0;
  const formLocations =
    record?.locations &&
    Array.isArray(record.locations) &&
    record.locations.length > 0;
  useEffect(() => {
    if (
      !hasSyncedLocationsRef.current &&
      savedLocations &&
      !formLocations &&
      initialRecord?.locations
    ) {
      changeLocations(initialRecord.locations);
      hasSyncedLocationsRef.current = true;
    }
  }, [savedLocations, formLocations, initialRecord?.locations?.length, initialRecord?.id]);

  // Only initialize with one empty row when array is empty on initial load.
  // Upon project creation (fromCreate), always show one empty field ready for input.
  const initialEmptyLocationsRef = useRef(false);
  const savedLocationsCount =
    initialRecord?.locations && Array.isArray(initialRecord.locations)
      ? initialRecord.locations.length
      : 0;
  useMemo(() => {
    const isEmpty =
      record &&
      record.locations &&
      Array.isArray(record.locations) &&
      record.locations.length === 0;
    const shouldAddOne =
      isEmpty &&
      !initialEmptyLocationsRef.current &&
      ((fromCreate && savedLocationsCount === 0) ||
        !hasMultipleLocations ||
        hasDefaultArrayInputValue);
    if (shouldAddOne) {
      changeLocations([{}]);
      initialEmptyLocationsRef.current = true;
    } else if (record?.locations?.length > 0) {
      initialEmptyLocationsRef.current = true;
    }
  }, [record, fromCreate, savedLocationsCount]);

  if (!record) return null;
  if (!record.phase_id && !props.isNewProject) return null;

  const handleShowMap = (location_id) => () => {
    if (showMap.includes(location_id)) {
      setShowMap(showMap.filter((item) => item !== location_id));
    } else {
      setShowMap([...showMap, location_id]);
    }
  };

  function renderGeoMap(source, scopedFormData) {
    const { location_id } = scopedFormData;
    return (
      <>
        <Button onClick={handleShowMap(location_id)} variant="text">
          {!showMap.includes(location_id) ? `Show Map` : "Hide Map"}
        </Button>
        {showMap.includes(location_id) && (
          <CustomMap
            {...props}
            scopedFormData={scopedFormData}
            source={source}
          />
        )}
      </>
    );
  }

  if (hasMultInput) {
    return (
      <ReferenceArrayInput
        validate={checkRequired("locations")}
        label="Locations"
        reference="locations"
        source="locations"
      >
        <AutocompleteArrayInput
          margin="none"
          variant="outlined"
          fullWidth
          source="location_id"
          parse={(v) => ({ location_id: v })}
        />
      </ReferenceArrayInput>
    );
  }

  return (
    <Fragment>
      <FormDataConsumer>
        {({ formData, scopedFormData, getSource, ...rest }) =>
          checkFeature("project_has_google_map") &&
          formData &&
          renderGeoMap("geo_location", formData)
        }
      </FormDataConsumer>

      <ArrayInput
        source="locations"
        label={translate("resources.project-details.fields.locations")}
        validate={[checkRequired("locations")]}
      >
        <SimpleFormIterator
          disableAdd={!hasMultipleLocations}
          disableRemove={!hasMultipleLocations}
        >
          <FormDataConsumer>
            {({ formData, scopedFormData, getSource, ...rest }) => {
              if (hasMultipleLocations && !formData.locations) {
                formData.locations[0] = {
                  location: {},
                  geo_location: "",
                  location_id: "",
                };
              }

              return (
                <Fragment>
                  <>
                    <CustomInput
                      fullWidth
                      tooltipText={
                        "tooltips.resources.locations.fields.central"
                      }
                    >
                      <ReferenceInput
                        sort={DEFAULT_SORTING}
                        label={translate("resources.locations.fields.central")}
                        validate={checkRequired(
                          "locations",
                          "location_parent_id"
                        )}
                        perPage={-1}
                        source={getSource("location_parent_id")}
                        reference="locations"
                        filter={{
                          level: 1,
                        }}
                      >
                        <SelectInput
                          validate={required()}
                          optionText="name"
                          margin="normal"
                          variant="outlined"
                        />
                      </ReferenceInput>
                    </CustomInput>

                    <LocationsAutocomplete
                      getSource={getSource}
                      scopedFormData={scopedFormData}
                      locationsData={locationsData}
                      formData={formData}
                    />
                  </>


                  {/* <OrganisationalStructure
                      {...props}
                      source={getSource("location_id")}
                      title="Locations"
                      config="location_config"
                      reference="locations"
                      field={getSource("location")}
                      level={3}
                    /> */}

                  {hasGeoMap && (
                    <Fragment>
                      <TextInput
                        style={{ display: "none" }}
                        options={{ disabled: true }}
                        source={getSource("geo_location")}
                        variant="outlined"
                        margin="none"
                        label={translate(
                          "resources.project-details.fields.geo_location"
                        )}
                      />
                    </Fragment>
                  )}
                </Fragment>
              );
            }}
          </FormDataConsumer>
        </SimpleFormIterator>
      </ArrayInput>
    </Fragment>
  );
}

export default Location;

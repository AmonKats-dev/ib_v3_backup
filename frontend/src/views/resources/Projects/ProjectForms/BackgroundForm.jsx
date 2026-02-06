import React, { Fragment } from "react";
import ProjectBackground from "../../../modules/Project/ProjectBackground";
import CoordinationGA from "../../../modules/Project/CoordinationGA";
import StrategicAlignment from "../../../modules/Project/StrategicAlignment";
import Stakeholders from "../../../modules/Project/Stakeholders";
import { checkFeature } from "../../../../helpers/checkPermission";

function BackgroundForm(props) {
  const hasPimisFields = checkFeature("has_pimis_fields");
  const hasEsnipFields = checkFeature("has_esnip_fields");

  return (
    <Fragment>
      {hasPimisFields && <Stakeholders {...props} />}
      <ProjectBackground {...props} />
      {!hasPimisFields && !hasEsnipFields && <Stakeholders {...props} />}
      <CoordinationGA {...props} />
      <StrategicAlignment {...props} />
    </Fragment>
  );
}

export default BackgroundForm;

import React from "react";
import { Edit } from "react-admin";
import { checkFeature } from "../../../helpers/checkPermission";
import ProjectDetailsForm from "./ProjectDetailsForm";

const redirectEdit = (basePath, id, data) => {
  return `/projects/${data.project_id || id}/show/${data.phase_id}`;
};

const transform = (data, hasBudgetData) => {
  const {
    budget_code,
    signed_date,
    financing_agreement_date,
    budget_allocation,
    id,
    phase_id
  } = data;

  if (hasBudgetData) {
    return {
      budget_code,
      signed_date,
      financing_agreement_date,
      budget_allocation,
      phase_id,
      id
    };
  }

  return data;
};

const ProjectEdit = ({ classes, ...props }) => {
  const hasBudgetInitiation = (phaseId) =>
    checkFeature("has_budget_initiation", phaseId);

  return (
    <Edit
      {...props}
      undoable={false}
      actions={false}
      redirect={false}
      transform={(data) => transform(data, hasBudgetInitiation(data.phase_id))}
    >
      <ProjectDetailsForm {...props} redirect={redirectEdit} />
    </Edit>
  );
};

export default ProjectEdit;

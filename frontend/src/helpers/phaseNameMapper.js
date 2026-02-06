/**
 * Maps phase names so the project starts from Profile (Project Concept omitted as initial stage).
 * "Project Concept" and "Concept" are displayed as "Profile" for consistency.
 */
export const mapPhaseName = (phaseName) => {
  if (!phaseName) return phaseName;
  if (phaseName === "Project Concept" || phaseName === "Concept" || phaseName === "Project Profile") {
    return "Profile";
  }
  return phaseName;
};

/**
 * Maps phase object to ensure name is transformed
 */
export const mapPhase = (phase) => {
  if (!phase) return phase;
  
  return {
    ...phase,
    name: mapPhaseName(phase.name)
  };
};


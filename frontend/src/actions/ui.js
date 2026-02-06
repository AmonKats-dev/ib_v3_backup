export const setRigtPanelContent = (data) => ({
  type: "RIGHT_PANEL_CONTENT",
  payload: { data },
});

export const setRigtPanelVisibility = (data) => ({
  type: "SHOW_RIGHT_PANEL",
  payload: { data },
});

export const setPopupContent = (data) => ({
  type: "POPUP_CONTENT",
  payload: { data },
});

export const setPopupVisibility = (data) => ({
  type: "SHOW_POPUP",
  payload: { data },
});

export const setProjectGanttChartContent = (data) => ({
  type: "SAVE_GANTT_DATA",
  payload: { data },
});

export const setProjectTitleHeader = (data) => ({
  type: "SET_PROJECT_TITLE_HEADER",
  payload: { data },
});

export const setBreadCrumps = (data) => ({
  type: "SET_BREADCRUMPS",
  payload: { data },
});

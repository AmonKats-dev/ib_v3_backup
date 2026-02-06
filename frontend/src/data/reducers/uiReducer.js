const initialState = {
  popupVisible: false,
  popupContent: null,
  rightPanelVisible: false,
  rightPanelContent: null,
  ganttData: null,
  headerTitle: null,
  breadCrumps: [],
  isExporting: false,
};

const uiReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_IS_EXPORTING":
      return {
        ...state,
        isExporting: payload.data,
      };
    case "SET_BREADCRUMPS":
      return {
        ...state,
        breadCrumps: payload.data,
      };
    case "SET_PROJECT_TITLE_HEADER":
      return {
        ...state,
        headerTitle: payload.data,
      };
    case "SHOW_POPUP":
      return {
        ...state,
        popupVisible: payload.data,
      };
    case "POPUP_CONTENT":
      return {
        ...state,
        popupContent: payload.data,
      };
    case "SHOW_RIGHT_PANEL":
      return {
        ...state,
        rightPanelVisible: payload.data,
      };
    case "RIGHT_PANEL_CONTENT":
      return {
        ...state,
        rightPanelContent: payload.data,
      };
    case "SAVE_GANTT_DATA":
      return {
        ...state,
        ganttData: payload.data,
      };
    default:
      return state;
  }
};

export default uiReducer;

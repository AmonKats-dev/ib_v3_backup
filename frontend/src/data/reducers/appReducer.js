import { getApplicationConfig } from "../../constants/config";

const config = getApplicationConfig();

const initialState = {
    appConfig: config,
};

const appReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'UPDATE_CONFIG':
            return {
                ...state,
                appConfig: payload
            }
        default:
            return state;
    }
}

export default appReducer;

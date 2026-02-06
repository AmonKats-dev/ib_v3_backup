import { USER } from "../../constants/auth";

const initialState = {
    userInfo: JSON.parse(localStorage.getItem(USER)),
};

const userReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case 'SET_USER_INFORMATION':
            return {
                ...state,
                userInfo: payload
            }
        default:
            return state;
    }
}

export default userReducer;

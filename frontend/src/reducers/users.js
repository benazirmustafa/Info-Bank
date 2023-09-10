import { ALL_USERS, SEARCH_USER } from "../actions/types";

const initialState = {
    allusers: null,
    searchuser: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ALL_USERS:
            return {
                ...state,
                allusers: action.payload,
            };
        case SEARCH_USER:
            return {
                ...state,
                searchuser: action.payload,
            };
        default:
            return state;
    }
}

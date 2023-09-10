import { LOADING, SKELETONLOADING } from "../actions/types";

const initialState = {
  loading: false,
  fetching: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SKELETONLOADING:
      return {
        ...state,
        fetching: action.payload
      };
    default:
      return state;
  }
}

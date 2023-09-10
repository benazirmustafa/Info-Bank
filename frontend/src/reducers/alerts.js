import { ALERT_MESSAGE } from "../actions/types";

const initialState = {
  msg: null,
  type: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ALERT_MESSAGE:
      return {
        ...state,
        msg: action.payload,
        type: action.payload,
      };
    default:
      return state;
  }
}

import { ALERT_MESSAGE } from "./types";

export const InIt = () => (dispatch, getState) => {
  dispatch({ type: ALERT_MESSAGE, payload: null });
};

// CREATE MESSAGE
export const createMessage = (msg, type) => {
  return {
    type: ALERT_MESSAGE,
    payload: { msg, type },
  };
};

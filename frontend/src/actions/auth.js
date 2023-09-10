import axios from "axios";
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  SPLASH_LOAD,
  PAGE_LOADED,
  PASSWORD_VALIDATION,
  UPLOAD_PROGRESS,
  WRONG_CREDENTIALS,
  REQUESTING_PASSWORD_RESET,
  SUCCESS_PASSWORD_REQUEST,
  FAILURE_PASSWORD_REQUEST,
  SUCCESS_TOKEN_VALIDATION,
  FAILED_TOKEN_VALIDATION,
  VALIDATING_RESET_TOKEN,
  GROUPS,
  DESIGNATIONS
} from "./types";
import store from "../store";
import { createMessage } from "./alerts";
// Login
export const login = (email, password) => (dispatch) => {
  //HEADERS
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  dispatch({
    type: SPLASH_LOAD,
  });
  var qs = require('querystring');
  //REQUEST BODY
  const body = JSON.stringify({ email, password });
  axios
    .post("/auth/login/", body, config)
    .then((res) => {
      dispatch({
        type: PAGE_LOADED,
      });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(createMessage("Login Success", "success"));
    })
    .catch((err) => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
        dispatch({
          type: PAGE_LOADED,
        });
      } else {
        // dispatch(createMessage("Invalid ID/ Password Entered...", "error"));
        dispatch({
          type: LOGIN_FAIL,
        });
        dispatch({
          type: WRONG_CREDENTIALS,
        });
        dispatch({
          type: PAGE_LOADED,
        });
      }
    });
};

export const logout = () => (dispatch, getState) => {
  axios
    .post("/auth/logout/", null, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
  // USER LOADING
  dispatch({ type: USER_LOADING });
  axios
    .get("/auth/user/", tokenConfig(getState))
    .then((res) => {
      setTimeout(() => {
        dispatch({
          type: USER_LOADED,
          payload: res.data,
        });
      }, 1250);
    })
    .catch((err) => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch({
          type: AUTH_ERROR,
        });
      }
    });
};

// All Groups
export const get_groups = () => (dispatch, getState) => {
  axios
    .get("/auth/groups/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GROUPS,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `Wrong Attempt`,
            "error"
          )
        );
      }
    });
};

// All Designations
export const get_designations = () => (dispatch, getState) => {
  axios
    .get("/auth/designations/", tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: DESIGNATIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `Wrong Attempt`,
            "error"
          )
        );
      }
    });
};

export const updateProfile = (id, body) => (dispatch, getState) => {
  axios
    .put(`/auth/manage-user/${id}`, body, tokenConfigUpload(getState))
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (Array.isArray(err.response.data)) {
        err.response.data.map((msg, i) => {
          if (Object.keys(msg).length !== 0) {
            dispatch(
              createMessage(
                `${Object.keys(msg)[0]} ${Object.values(msg)[0][0]}`,
                "error"
              )
            );
          }
          return null;
        });
      } else {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      }
    });
};

// Password Confrmation

export const confirmPassword = (password) => (dispatch, getState) => {
  const body = JSON.stringify({ password });
  axios
    .post(`/auth/password/`, body, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: PASSWORD_VALIDATION,
        payload: true,
      });
      dispatch(createMessage(res.data.message, "success", "top right"));
    })
    .catch((err) => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage("Something Goes Wrong", "error"));
      }
    });
};

export const resetPasswordRequest = (body) => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  dispatch({
    type: REQUESTING_PASSWORD_RESET,
  });

  axios
    .post(`/auth/password-reset/`, body, config)
    .then((res) => {
      dispatch({
        type: SUCCESS_PASSWORD_REQUEST,
      });
      dispatch(
        createMessage("Password Reset Link Sent", "success", "top right")
      );
    })
    .catch((err) => {
      if (err.response.data) {
        if (Array.isArray(err.response.data)) {
          err.response.data.map((msg, i) => {
            if (Object.keys(msg).length !== 0) {
              dispatch(
                createMessage(
                  `${Object.keys(msg)[0]} ${Object.values(msg)[0][0]}`,
                  "error"
                )
              );
            }
            return null;
          });
        } else {
          dispatch(
            createMessage(
              `${Object.keys(err.response.data)[0]}: ${Object.values(err.response.data)[0][0]
              }`,
              "error"
            )
          );
        }
      } else {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      }
      dispatch({
        type: FAILURE_PASSWORD_REQUEST,
      });
    });
};

export const validateResetToken = (body) => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  dispatch({
    type: VALIDATING_RESET_TOKEN,
  });
  axios
    .post(`/auth/password-reset/validate_token/`, body, config)
    .then((res) => {
      dispatch({
        type: SUCCESS_TOKEN_VALIDATION,
      });
    })
    .catch((err) => {
      if (err.response.data) {
        dispatch(
          createMessage("Invalid/Expired Password Reset Request!", "error")
        );
      } else {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      }
      dispatch({
        type: FAILED_TOKEN_VALIDATION,
      });
    });
};

export const resetPassword = (body) => (dispatch, getState) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  dispatch({
    type: REQUESTING_PASSWORD_RESET,
  });

  axios
    .post(`/auth/password-reset/confirm/`, body, config)
    .then((res) => {
      dispatch({
        type: SUCCESS_PASSWORD_REQUEST,
      });
      dispatch(
        createMessage(
          "Password Reset Successful. Please Login with Your New Password.",
          "success",
          "top right"
        )
      );
    })
    .catch((err) => {
      if (err.response.data) {
        if (Array.isArray(err.response.data)) {
          err.response.data.map((msg, i) => {
            if (Object.keys(msg).length !== 0) {
              dispatch(
                createMessage(
                  `${Object.keys(msg)[0]} ${Object.values(msg)[0][0]}`,
                  "error"
                )
              );
            }
            return null;
          });
        } else {
          dispatch(
            createMessage(
              `${Object.keys(err.response.data)[0]}: ${Object.values(err.response.data)[0][0]
              }`,
              "error"
            )
          );
        }
      } else {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      }
      dispatch({
        type: FAILURE_PASSWORD_REQUEST,
      });
    });
};

// SETUP CONFIG WITH TOKEN - HELPER FUNCTION
export const tokenConfig = (getState) => {
  //GET TOKEN FROM STATE
  const token = getState().auth.token;

  //HEADERS
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // IF TOKEN AVAILABLE, ADD TO HEADER (AUTHORIZATION)
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};
export const tokenConfigUpload = (getState) => {
  //GET TOKEN FROM STATE
  const token = getState().auth.token;
  store.dispatch({
    type: UPLOAD_PROGRESS,
    payload: 0,
  });

  //HEADERS
  const config = {
    headers: {
      "Content-Type": "application/form-data",
    },
    onUploadProgress: function (progressEvent) {
      var percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      if (percentCompleted === 100) {
        store.dispatch({
          type: UPLOAD_PROGRESS,
          payload: percentCompleted,
        });
      }
    },
  };

  // IF TOKEN AVAILABLE, ADD TO HEADER (AUTHORIZATION)
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }
  return config;
};

import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  PAGE_LOAD,
  PAGE_LOADED,
  SPLASH_LOAD,
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
} from "../actions/types";

const initialState = {
  password_valid: false,
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: true,
  isSplash: false,
  user: null,
  percentCompleted: 0,
  credentials: true,
  loadingRequest: false,
  isSuccess: null,
  validatingToken: false,
  tokenValidated: null,
  groups: null,
  designations: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
    case PAGE_LOAD:
      return {
        ...state,
        isLoading: true,
      };
    case SPLASH_LOAD:
      return {
        ...state,
        isSplash: true,
      };
    case PAGE_LOADED:
      return {
        ...state,
        isLoading: false,
        isSplash: false,
      };
    case USER_LOADED:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case PASSWORD_VALIDATION:
      return {
        ...state,
        password_valid: action.payload,
      };
    case WRONG_CREDENTIALS:
      return {
        ...state,
        credentials: false,
      };
    case UPLOAD_PROGRESS:
      return {
        ...state,
        percentCompleted: action.payload,
      };
    case REQUESTING_PASSWORD_RESET:
      return {
        ...state,
        loadingRequest: true,
        isSuccess: null,
      };
    case SUCCESS_PASSWORD_REQUEST:
      return {
        ...state,
        loadingRequest: false,
        isSuccess: true,
      };
    case FAILURE_PASSWORD_REQUEST:
      return {
        ...state,
        loadingRequest: false,
        isSuccess: false,
      };

    case VALIDATING_RESET_TOKEN:
      return {
        ...state,
        validatingToken: true,
        tokenValidated: null,
      };
    case SUCCESS_TOKEN_VALIDATION:
      return {
        ...state,
        validatingToken: false,
        tokenValidated: true,
      };
    case FAILED_TOKEN_VALIDATION:
      return {
        ...state,
        validatingToken: false,
        tokenValidated: false,
      };
    case GROUPS:
      return {
        ...state,
        groups: action.payload
      }
    case DESIGNATIONS:
      return {
        ...state,
        designations: action.payload
      }
    default:
      return state;
  }
}

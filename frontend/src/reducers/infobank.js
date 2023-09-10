import { Details, SharedWith, LoadingSharedWith } from "../actions/types";

const initialState = {
  details: null,
  sharewith: null,
  loading_sharewith: false,

  // folderdetails: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case Details:
      return {
        ...state,
        details: action.payload,
      };
    case SharedWith:
      return {
        ...state,
        sharewith: action.payload,
        loading_sharewith: false
      };
    case LoadingSharedWith:
      return {
        ...state,
        loading_sharewith: true
      };

    default:
      return state;
  }
}

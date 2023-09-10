import axios from "axios";
import {
  Details,
  LoadingSharedWith,
  SharedWith,
} from "./types";
import { createMessage } from "./alerts";
import { tokenConfig, tokenConfigUpload } from "./auth";

// File Download
export const filetokenConfig = (getState) => {
  //GET TOKEN FROM STATE
  const token = getState().auth.token;

  let config = {
    responseType: "blob",
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  return config;
};

export const downloadFile = (path, filename) => (dispatch, getState) => {
  axios
    .get(path, filetokenConfig(getState))
    .then((response) => {
      console.log(response)
      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}.${path.split('.').pop()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
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
export const get_share_details = (id, type) => (dispatch, getState) => {
  dispatch({ type: LoadingSharedWith });
  axios
    .get(`/api/share-content/?id=${id}&type=${type}`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: SharedWith,
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

export const share = (body, type, details_type, details_value) => (dispatch, getState) => {
  console.log(body, type, details_type, details_value)
  axios
    .put(`/api/share-content/?type=${type}`, body, tokenConfig(getState))
    .then((res) => {
      dispatch(
        createMessage(
          `Successfully Shared ${type}`,
          "success"
        )
      );
      if (details_type == "category") {
        dispatch(category_details(details_value));
      }
      if (details_type == "folder") {
        dispatch(folder_details(details_value));
      }

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
export const category_details = (slug) => (dispatch, getState) => {
  dispatch({
    type: Details,
    payload: null,
  });
  axios
    .get(`/api/category/${slug}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: Details,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else if (err.response.status === 401) {
        dispatch(
          createMessage("Unauthorized access!", "error")
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

export const folder_details = (id) => (dispatch, getState) => {
  dispatch({
    type: Details,
    payload: null,
  });
  axios
    .get(`/api/folder/${id}/`, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: Details,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else if (err.response.status === 401) {
        dispatch(
          createMessage("Unauthorized access!", "error")
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
export const addFolder = (body, content_type, content_value) => (dispatch, getState) => {
  dispatch({
    type: Details,
    payload: null,
  });
  axios
    .post(`/api/manage-folder/`, body, tokenConfig(getState))
    .then((res) => {
      dispatch(
        createMessage(
          `Successfully Folder Added`,
          "success"
        )
      )
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
    })
    .catch((err) => {
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
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
export const addFile = (body, content_type, content_value) => (dispatch, getState) => {
  dispatch({
    type: Details,
    payload: null,
  });
  axios
    .post(`/api/manage-file/`, body, tokenConfigUpload(getState))
    .then((res) => {
      dispatch(
        createMessage(
          `Successfully File Added`,
          "success"
        )
      )
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
    })
    .catch((err) => {
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
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
export const editFile = (body, id, content_type, content_value) => (dispatch, getState) => {
  dispatch({
    type: Details,
    payload: null,
  });
  axios
    .put(`/api/manage-file/?id=${id}`, body, tokenConfig(getState))
    .then((res) => {
      dispatch(
        createMessage(
          `Successfully File Updated`,
          "success"
        )
      )
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
    })
    .catch((err) => {
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
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
export const editFolder = (body, id, content_type, content_value) => (dispatch, getState) => {
  dispatch({
    type: Details,
    payload: null,
  });
  axios
    .put(`/api/manage-folder/?id=${id}`, body, tokenConfig(getState))
    .then((res) => {
      dispatch(
        createMessage(
          `Successfully Folder Updated`,
          "success"
        )
      )
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
    })
    .catch((err) => {
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
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
export const deleteFolder = (id, content_type, content_value) => (dispatch, getState) => {
  dispatch({
    type: Details,
    payload: null,
  });
  axios
    .delete(`/api/manage-folder/?id=${id}`, tokenConfig(getState))
    .then((res) => {
      dispatch(
        createMessage(
          `Successfully Folder Deleted`,
          "success"
        )
      )
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
    })
    .catch((err) => {
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
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
export const deleteFile = (id, content_type, content_value) => (dispatch, getState) => {
  dispatch({
    type: Details,
    payload: null,
  });
  axios
    .delete(`/api/manage-file/?id=${id}`, tokenConfig(getState))
    .then((res) => {
      dispatch(
        createMessage(
          `Successfully File Deleted`,
          "success"
        )
      )
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
    })
    .catch((err) => {
      if (content_type === "category") {
        dispatch(
          category_details(content_value)
        );
      }
      if (content_type === "folder") {
        dispatch(
          folder_details(content_value)
        );
      }
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

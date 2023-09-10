import axios from "axios";
import {
    ALL_USERS,
    SEARCH_USER
} from "./types";
import { createMessage } from "./alerts";
import { tokenConfig, tokenConfigUpload } from "./auth";

export const usersearch = (search) => (dispatch, getState) => {
    axios
        .get(`/auth/search/?search=${search}`, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: SEARCH_USER,
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

export const get_users = (limit, offset) => (dispatch, getState) => {
    axios
        .get(`/auth/manage-user/?limit=${limit}&offset=${offset}`, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: ALL_USERS,
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

// Excel Upload
export const uploadExcel = (body) => (dispatch, getState) => {
    axios
        .post(`/auth/upload/users/`, body, tokenConfigUpload(getState))
        .then((res) => {
            dispatch(createMessage("Uploaded Successfully", "success"));
            dispatch(get_users(0, 5));
        })
        .catch((err) => {
            if (!err.response) {
                dispatch(
                    createMessage("Network Error. Something went wrong!", "error")
                );
            } else {
                dispatch(
                    createMessage(
                        err.response.data.message,
                        "error"
                    )
                );
            }
        });
};
export const create_user = (body, limit, offset) => (dispatch, getState) => {

    axios
        .post(`/auth/manage-user/?limit=${limit}&offset=${offset}`, body, tokenConfig(getState))
        .then((res) => {
            dispatch(
                get_users(limit, offset)
            );
            dispatch(
                createMessage("User Created Successfully", "success")
            );
        })
        .catch((err) => {
            dispatch(
                get_users(limit, offset)
            );
            if (!err.response) {
                dispatch(
                    createMessage("Network Error. Something went wrong!", "error")
                );
            } else {
                if (typeof err.response.data === 'object') {
                    for (const [key, value] of Object.entries(err.response.data)) {
                        dispatch(
                            createMessage(
                                `${key} ${value}`,
                                "error"
                            )
                        );
                    }
                }
                else {
                    dispatch(
                        createMessage(
                            `Wrong Attempt`,
                            "error"
                        )
                    );
                }
            }
        });
};
export const edit_user = (id, body, limit, offset) => (dispatch, getState) => {
    axios
        .put(`/auth/manage-user/${id}?limit=${limit}&offset=${offset}`, body, tokenConfig(getState))
        .then((res) => {
            dispatch(
                get_users(limit, offset)
            );
        })
        .catch((err) => {
            dispatch(
                get_users(limit, offset)
            );
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
export const deleteuser = (id, limit, offset) => (dispatch, getState) => {

    axios
        .delete(`/auth/manage-user/${id}?limit=${limit}&offset=${offset}`, tokenConfig(getState))
        .then((res) => {
            dispatch(
                get_users(limit, offset)
            );
        })
        .catch((err) => {
            dispatch(
                get_users(limit, offset)
            );
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

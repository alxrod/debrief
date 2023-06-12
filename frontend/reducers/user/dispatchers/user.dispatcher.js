import UserService from "../../../services/user.service";

import * as userActions from "../user.actions";
import * as helpers from "../../helpers"

export const register = (email,password) => {
    return dispatch => {
        return UserService.register(email, password).then(
            (response) => {
                dispatch({
                    type: userActions.SET_USER,
                    payload: {
                        user: response.user,
                        creds: response.creds,
                    }
                });
                return Promise.resolve();
            },
            (error) => {
                const message = 
                    (error.response &&
                     error.response.data &&
                     error.response.data.message) ||
                    error.message ||
                    error.toString();
                dispatch({
                    type: userActions.CLEAR_USER,
                });
                return Promise.reject(message);
            }
        );
    }
};

export const login = (email, password, remember) => {
    return dispatch => {
        return UserService.login(email, password, remember).then(
            (data) => {
                dispatch({
                    type: userActions.SET_USER,
                    payload: {
                        user: data.user,
                        creds: data.creds,
                    },
                });
                return Promise.resolve();
            },
            (error) => {
                const message = 
                    (error.response &&
                     error.response.data &&
                     error.response.data.message) ||
                    error.messsage ||
                    error.toString();
                dispatch({
                    type: userActions.CLEAR_USER,
                });
                return Promise.reject(message);
            }
        );
    }
};

export const logout = () => {
    return dispatch => {
        return helpers.authCheck(dispatch).then(
            (creds) => {
                UserService.logout(creds.access_token);
                dispatch({
                    type: userActions.CLEAR_USER,
                });
            },
            () => {
                localStorage.removeItem("user");
                localStorage.removeItem("creds");
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("creds");
                dispatch({
                    type: userActions.CLEAR_USER,
                });
                dispatch({
                    type: userActions.CLEAR_USER,
                });
            }
        )
    }
}

export const setUser = (user, creds) => {
    return dispatch => {
        dispatch({
            type: userActions.SET_USER,
            payload: {user: user, creds: creds},
        });
        return Promise.resolve();
    }
}
export const pullUser = () => {
    return dispatch => {
        return helpers.authCheck(dispatch).then(
            (creds) => {
                return UserService.pull_user(creds.access_token, creds.user_id).then(
                    (data) => {
                        dispatch({
                            type: userActions.SET_USER,
                            payload: {user: data, creds: creds},
                        });
                        return Promise.resolve();
                    },
                    (error) => {
                        const message = 
                            (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                            error.messsage ||
                            error.toString();
                        dispatch({
                            type: userActions.CLEAR_USER,
                        });
                        return Promise.reject(message);
                    }
                );
            },
            () => {
                return Promise.reject("Auth chekc failed")
            }
        )
    }
};

export const forgotPassword = (email) => {
    return dispatch => {
        return UserService.forgotPassword(email).then(
            (resp) => {
                return Promise.resolve();
            },
            (error) => {
                const message = 
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.messsage ||
                    error.toString();
                return Promise.reject(message);
            }
        )
    }
}

export const confirmResetId = (reset_id) => {
    return dispatch => {
        return UserService.confirmResetId(reset_id).then(
            (valid) => {
                return Promise.resolve(valid);
            },
            (error) => {
                const message = 
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.messsage ||
                    error.toString();
                return Promise.reject(message);
            }
        )
    }
}

export const changePassword = (reset_id, new_password) => {
    return dispatch => {
        return UserService.changePassword(reset_id, new_password).then(
            (data) => {
                dispatch({
                    type: userActions.SET_USER,
                    payload: {
                        user: data.user,
                        creds: data.creds,
                    },
                });
                return Promise.resolve();
            },
            (error) => {
                const message = 
                    (error.response &&
                     error.response.data &&
                     error.response.data.message) ||
                    error.messsage ||
                    error.toString();
                dispatch({
                    type: userActions.CLEAR_USER,
                });
                return Promise.reject(message);
            }
        );
    }
};
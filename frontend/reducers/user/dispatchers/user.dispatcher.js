import UserService from "../../../services/user.service";

import * as userActions from "../user.actions";

export const register = (email,password) => {
    return dispatch => {
        return UserService.register(email, password).then(
            (response) => {
                dispatch({
                    type: userActions.SET_USER,
                    payload: {
                        user: response.user,
                    }
                });
                return Promise.resolve();
            },
            (error) => {
                dispatch({
                    type: userActions.CLEAR_USER,
                });
                return Promise.reject(error.response.data.detail);
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
                    },
                });
                return Promise.resolve();
            },
            (error) => {
                dispatch({
                    type: userActions.CLEAR_USER,
                });
                return Promise.reject(error.response.data.detail);
            }
        );
    }
};

export const logout = () => {
    return dispatch => {
        return UserService.logout().then(
        dispatch({
            type: userActions.CLEAR_USER,
        }))
    }
}

export const setUser = (user) => {
    return dispatch => {
        dispatch({
            type: userActions.SET_USER,
            payload: {user: user},
        });
        return Promise.resolve();
    }
}


export const pullUser = () => {
    return dispatch => {
        return UserService.pullUser().then(
            (data) => {
                const user = data.user;
                user.feeds = data.feeds;
                dispatch({
                    type: userActions.SET_USER,
                    payload: {user},
                });
                return Promise.resolve(user);
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
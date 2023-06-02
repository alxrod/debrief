import UserService from "../services/user.service";
import { LOGOUT } from "./user/user.actions"

export const authCheck = (dispatch) => {
    return UserService.authChecker(true).then(
        (creds) => {
            return Promise.resolve(creds)
        },
        (err) => {
            console.log(err.message)
            bailAuth(dispatch)
            return Promise.reject(err.message)
        },
    )
}

const bailAuth = (dispatch) => {
    localStorage.removeItem("creds");
    sessionStorage.removeItem("creds");

    dispatch({
        type: LOGOUT,
    })
}

export const parseError = (error, dispatch) => {
    const message = 
        (error.response &&
        error.response.data &&
        error.response.data.message) ||
        error.message ||
        error.toString();

    console.log("ERROR CAUGHT IN PARSE ERROR: " + message)
    return Promise.reject(message);
}
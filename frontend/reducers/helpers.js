import UserService from "../services/user.service";
import { LOGOUT } from "./user/user.actions"

export const authCheck = (dispatch) => {
    return UserService.authChecker(true).then(
        (creds) => {
            return Promise.resolve(creds)
        },
        (err) => {
            return Promise.reject(err.message)
        },
    )
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
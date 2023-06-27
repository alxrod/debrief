import * as userActions from "./user.actions";


const initialState = {
    isLoggedIn: false,
    user: null,
} 
export default (state = initialState, action) => {
    switch (action.type) {
        case userActions.SET_USER:
            return {
                ...state,
                user: action.payload.user,
                isLoggedIn: true,
            }

        case userActions.CLEAR_USER:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };

        default:
            return state
    }
}
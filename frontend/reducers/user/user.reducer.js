import * as userActions from "./user.actions";
import * as userHelpers from "./user.helpers"

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
        
        case userActions.ADD_FEED_TO_USER:
            return {
                ...state,
                user: {
                    ...state.user,
                    feeds: userHelpers.addFeed(state.user.feeds, action.payload)
                }
            }

        default:
            return state
    }
}
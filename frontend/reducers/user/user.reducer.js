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
        
        case userActions.ADD_FEED_TO_USER:
            console.log(state.user.feeds)
            return {
                ...state,
                user: {
                    ...state.user,
                    feeds: [...state.user.feeds, action.payload]
                }
            }

        default:
            return state
    }
}
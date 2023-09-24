import * as userActions from "./user.actions";
import * as userHelpers from "./user.helpers"

const initialState = {
    isLoggedIn: false,
    user: null,
    feedsChanged: false,
    gettingUser: false,
    anonymousUser: false,
} 

export default (state = initialState, action) => {
    switch (action.type) {
        case userActions.SET_USER:
            return {
                ...state,
                anonymousUser: false,
                user: action.payload.user,
                isLoggedIn: true,
                gettingUser: false,
            }

        case userActions.CLEAR_USER:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
                anonymousUser: true,
            };
        case userActions.GETTING_USER:
            return {
                ...state,
                gettingUser: true,
            }
        case userActions.SET_UNAUTHED:
            return {
                ...state,
                anonymousUser: true,
            }
        
        case userActions.ADD_FEED_TO_USER:
            return {
                ...state,
                user: {
                    ...state.user,
                    feeds: userHelpers.addFeed(state.user.feeds, action.payload)
                },
                feedsChanged: !state.feedsChanged
            }
        
        case userActions.CHANGE_INTEREST_QUERY_CONTENT:
            return {
                ...state,
                user: {
                    ...state.user,
                    feeds: userHelpers.changeInterestQueryContent(state.user.feeds, action.payload)
                },
                feedsChanged: !state.feedsChanged
            }

        case userActions.CHANGE_INTEREST_PRIVATE_STATUS:
            return {
                ...state,
                user: {
                    ...state.user,
                    feeds: userHelpers.changeInterestPrivateStatus(state.user.feeds, action.payload)
                },
                feedsChanged: !state.feedsChanged
            }
        
        case userActions.DELETE_FEED:
            return {
                ...state,
                user: {
                    ...state.user,
                    feeds: userHelpers.deleteFeed(state.user.feeds, action.payload.feed_id)
                },
                feedsChanged: !state.feedsChanged
            }
        
        case userActions.CHANGE_PLAYBACK_SPEED:
            return {
                ...state,
                user: {
                    ...state.user,
                    playback_speed: action.payload.speed
                }
            }

        default:
            return state
    }
}
import * as summaryActions from "./summary.actions";
import * as summaryHelpers from "./summary.helpers";

const initialState = {
  websites: [],
  websitesChanged: false,
} 

export default (state = initialState, action) => {
    switch (action.type) {
        case summaryActions.LOAD:
            return {
                ...state,
                websites: action.payload,
                websitesChanged: !state.websitesChanged
            }

        case summaryActions.CLEAR:
            return {
                ...state,
                websites: [],
                websitesChanged: !state.websitesChanged
            };
        
        case summaryActions.TOGGLE_FLAG:
            return {
                ...state,
                websites: summaryHelpers.toggleFlag(
                    state.websites, 
                    action.payload.website_id, 
                    action.payload.name,
                    action.payload.status
                ),
                websitesChanged: !state.websitesChanged
            };

        default:
            return state
    }
}
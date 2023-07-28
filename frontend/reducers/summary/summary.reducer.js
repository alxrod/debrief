import * as summaryActions from "./summary.actions";
import * as summaryHelpers from "./summary.helpers";

const initialState = {
  articles: [],
  articlesChanged: false,
} 

export default (state = initialState, action) => {
    switch (action.type) {
        case summaryActions.LOAD:
            return {
                ...state,
                articles: action.payload,
                articlesChanged: !state.articlesChanged
            }
        case summaryActions.ADD_FEED:
            return {
                ...state,
                articles: [...state.articles, ...action.payload.articles]
            }
        case summaryActions.CLEAR:
            return {
                ...state,
                articles: [],
                articlesChanged: !state.articlesChanged
            };
        
        case summaryActions.TOGGLE_FLAG:
            return {
                ...state,
                articles: summaryHelpers.updateMetadata(
                    state.articles, 
                    action.payload.website_id, 
                    action.payload.metadata
                ),
                articlesChanged: !state.articlesChanged
            };

        default:
            return state
    }
}
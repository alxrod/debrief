import * as summaryActions from "./summary.actions";
import * as summaryHelpers from "./summary.helpers";

const initialState = {
  articles: [],
  articlesChanged: false,
  
  curPage: 1,
  pageLimit: 10,
  totalArticles: 0,

  curFeed: {
    id: "",
    name: ""
  }
} 

export default (state = initialState, action) => {
    switch (action.type) {
        case summaryActions.LOAD_FEED:
            return {
                ...state,
                curFeed: action.payload.feed,
                curPage: summaryHelpers.resetPage(state.curPage, state.curFeed, action.payload.feed),
                articles: summaryHelpers.loadArticles(
                    state.curFeed,
                    action.payload.feed,
                    state.articles, 
                    action.payload.articles
                ),
                articlesChanged: !state.articlesChanged,
                totalArticles: action.payload.total_articles
            }
            
        case summaryActions.CLEAR:
            return {
                ...state,
                articles: [],
                articlesChanged: !state.articlesChanged,
                totalArticles: 0
            };
        
        case summaryActions.CHANGE_PAGE:
            return {
                ...state,
                curPage: summaryHelpers.changePage(state.totalArticles, state.pageLimit, state.curPage, action.payload.page)
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

        case summaryActions.REMOVE_ARTICLE:
            return {
                ...state,
                articles: summaryHelpers.removeArticle(
                    state.articles, 
                    action.payload.article_id
                ),
            }

        case summaryActions.REORDER_ARTICLES:
            return {
                ...state,
                articles: action.payload.articles,
                articlesChanged:  action.payload.noRefresh ? state.articlesChanged : !state.articlesChanged

            }
        
        case summaryActions.ADD_ARTICLES_TO_FEED:
            return {
                ...state,
                articles: [...state.articles, ...action.payload.articles],
                articlesChanged: !state.articlesChanged
            }
        case summaryActions.CLEAR_FEED_ARTICLES:
            return {
                ...state,
                articles: state.articles.filter(article => article.feed_id !== action.payload.feed_id),
                articlesChanged: !state.articlesChanged
            }
        default:
            return state
    }
}
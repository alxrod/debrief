import SummaryService from "../../../services/summary.service";

import * as summaryActions from "../summary.actions";

export const toggleFlag = (website_id, metadata) => {
  return dispatch => {
    return SummaryService.toggleFlag(metadata).then(
      () => {
        dispatch({
          type: summaryActions.TOGGLE_FLAG,
          payload: {
            website_id: website_id,
            metadata: metadata,
          },
        });
        return Promise.resolve();
      },
      (error) => {
        const message = 
            (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.messsage ||
            error.toString();
        return Promise.reject(message);
      }
    );
  }
};


export const addUserToFeed = (feed_id, user_id) => {
  return dispatch => {
    return SummaryService.addUserToFeed(feed_id, user_id).then(
      () => {
  
        return Promise.resolve();
      },
      (error) => {
        const message = 
            (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.messsage ||
            error.toString();
        return Promise.reject(message);
      }
    );
  }
}


export const reorderArticles = (new_articles, noRefresh) => {
  return dispatch => {
    dispatch({
      type: summaryActions.REORDER_ARTICLES,
      payload: {
        articles: new_articles,
        noRefresh: noRefresh,
      },
    });
  }
}

export const removeArticle = (article_id) => {
  return dispatch => {
    dispatch({
      type: summaryActions.REMOVE_ARTICLE,
      payload: {
        article_id: article_id,
      },
    });
  }
}
import SummaryService from "../../../services/summary.service";

import * as summaryActions from "../summary.actions";

const parseArticle = (article) => {
  article.id = article._id
  article.metadata.save_time = new Date(article.metadata.save_time)
  return article
}

export const getFeeds = (feed_ids) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      (async () => {
        let articles = []
        for (const feed_id of feed_ids) {
          const feed_articles = await SummaryService.pullFeed(feed_id)
          for (const article of feed_articles) {
            articles.push(parseArticle(article))
          }
        }
        dispatch({
          type: summaryActions.LOAD,
          payload: articles,
        });
        resolve(articles);
      })()
    })
  }
};

export const clearWebsites = () => {
  return dispatch => {
    dispatch({
      type: summaryActions.LOAD,
      payload: sites,
    });
    return Promise.resolve(sites);
  }       
};

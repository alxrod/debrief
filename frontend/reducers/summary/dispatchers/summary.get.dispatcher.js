import SummaryService from "../../../services/summary.service";

import * as summaryActions from "../summary.actions";

const parseArticle = (article, feed_id) => {
  article.id = article._id
  article.feed_id = feed_id
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
          console.log("Pulled for ", feed_id)
          console.log(feed_articles)
          for (const article of feed_articles) {
            let exists = false
            for (const existing_article of articles) {
              if (existing_article.id === article._id) {
                exists = true
                break
              }
            }
            if (!exists) {
              articles.push(parseArticle(article, feed_id))
            }
          }
        }
        console.log(articles)
        dispatch({
          type: summaryActions.LOAD,
          payload: articles,
        });
        resolve(articles);
      })()
    })
  }
};


export const getFeed = (feed_id) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      (async () => {
        let articles = []
        
        const feed_articles = await SummaryService.pullFeed(feed_id)
        for (const article of feed_articles) {
          articles.push(parseArticle(article, feed_id))
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


export const getAllFeeds = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      (async () => {
        const feeds = await SummaryService.pullAllFeeds()
        resolve(feeds);
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

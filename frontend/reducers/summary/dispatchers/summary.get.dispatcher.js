import SummaryService from "../../../services/summary.service";

import * as summaryActions from "../summary.actions";
import * as userActions from "../../user/user.actions";


const QUERY_SIZE = 50

const parseArticle = (article, feed_id) => {
  article.id = article._id
  article.feed_id = feed_id
  article.metadata.save_time = new Date(article.metadata.save_time)
  return article
}


export const getFeed = (feed_id, feed_name, timestamp) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      (async () => {
        let articles = []

        const resp = await SummaryService.pullFeed(feed_id, 0, QUERY_SIZE, timestamp)
        const feed_articles = resp.articles
        for (const article of feed_articles) {
          articles.push(parseArticle(article, feed_id))
        }

        // indiciated not authed
        if (feed_id !== feed_name) {
          dispatch({
            type: userActions.ADD_FEED_TO_USER,
            payload: {
              id: feed_id,
              name: feed_name
            }
          });
        }
        dispatch({
          type: summaryActions.LOAD_FEED,
          payload: {
            articles: articles,
            total_articles: resp.total_articles,
            feed: {
              id: feed_id,
              name: feed_name,
            }
          }
        });
        resolve(articles);
      })()
    })
  }
};

export const updateFeed = (feed_id, timestamp) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      (async () => {
        let articles = []
        
        const resp = await SummaryService.pullFeed(feed_id, 0, QUERY_SIZE, timestamp)
        if (!resp?.articles) {
          reject()
          return
        }
        const feed_articles = resp.articles
        for (const article of feed_articles) {
          articles.push(parseArticle(article, feed_id))
        }

        dispatch({
          type: summaryActions.ADD_ARTICLES_TO_FEED,
          payload: {
            articles: articles,
          }
        });
        resolve(articles);
      })()
    })
  }
};

export const getDigest = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      (async () => {
        // console.log("GETTING")

        const raw_digest = await SummaryService.pullDigest()
        // console.log("raw_digest: ", raw_digest)
        let articles = []
        for (const raw_art of raw_digest) {
          // console.log(raw_art)
          articles.push(parseArticle(raw_art, raw_art.feed_id))
        }

        dispatch({
          type: summaryActions.LOAD_FEED,
          payload: {
            articles: articles,
            total_articles: articles.length,
            feed: {
              id: "",
              name: "digest",
            }
          }
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

export const changePage = (page) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: summaryActions.CHANGE_PAGE,
        payload: {page}
      }); 
    })
  }
};

export const clearArticles = () => {
  return dispatch => {
    dispatch({
      type: summaryActions.CLEAR,
    });
    return Promise.resolve();
  }       
};

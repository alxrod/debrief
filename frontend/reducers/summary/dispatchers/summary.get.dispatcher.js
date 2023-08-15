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


export const getFeed = (feed_id, feed_name) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      (async () => {
        let articles = []

        const resp = await SummaryService.pullFeed(feed_id, 0, QUERY_SIZE)
        const feed_articles = resp.articles
        for (const article of feed_articles) {
          articles.push(parseArticle(article, feed_id))
        }

        dispatch({
          type: userActions.ADD_FEED_TO_USER,
          payload: {
            id: feed_id,
            name: feed_name
          }
        });
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

export const getDigest = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      (async () => {

        const raw_digest = await SummaryService.pullDigest()

        let articles = []
        for (const id in raw_digest) {
          if (raw_digest.hasOwnProperty(id)) {
            for (const article of raw_digest[id]) {
              articles.push(parseArticle(article, id))
            }
          }
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

export const clearWebsites = () => {
  return dispatch => {
    dispatch({
      type: summaryActions.LOAD,
      payload: sites,
    });
    return Promise.resolve(sites);
  }       
};

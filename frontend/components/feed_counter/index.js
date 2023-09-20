import {useState, useEffect, createContext, useMemo} from 'react';
import { bindActionCreators } from 'redux'
import { connect } from "react-redux";

export const FeedCounterContext = createContext()

export const FeedCounter = (props) => {
  const feedCountTable = useMemo(() => {
    let countTable = {}

    for (let i = 0; i < props.articles.length; i++) {
      const article = props.articles[i]
      if (countTable[article.feed_id] && !article.metadata.read) {
        countTable[article.feed_id] += 1
      } else if (!article.metadata.read) {
        countTable[article.feed_id] = 1
      }
    }
    let finalTable = {}
    for (let i = 0; i < props.user.feeds.length; i++) {
      const feed = props.user.feeds[i]
      if (countTable[feed.id]) {
        if (feed?.query_content) {
          finalTable[feed.query_content] = countTable[feed.id]
        } else {
          finalTable[feed.name] = countTable[feed.id]
        }
      }
    }
    console.log("FINAL TABLE: ", props.user.feeds)
    return finalTable
  }, [props.articlesChanged, props.feedsChanged])

  return (
    <FeedCounterContext.Provider value={feedCountTable}>
      {props.children}
    </FeedCounterContext.Provider>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  user: user.user,
  feedsChanged: user.feedsChanged,
  articlesChanged: summary.articlesChanged,
  articles: summary.articles
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedCounter)

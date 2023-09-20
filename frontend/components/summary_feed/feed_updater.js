import { Fragment, useState, useEffect, createContext } from 'react'

import { updateFeed } from '../../reducers/summary/dispatchers/summary.get.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

export const FeedUpdaterContext = createContext()

const FeedUpdater = (props) => {
  const [feedIds, setFeedIds] = useState([])
  const [feedChangeFlag, setFeedChangeFlag] = useState(false)
  const [feedTimestamp, setFeedTimestamp] = useState(Math.floor(Date.now() / 1000))
  const [delay, setIntDelay] = useState(5000)

  const setIds = (ids) => {
    setIntDelay(5000)
    setFeedChangeFlag(!feedChangeFlag)
    setFeedIds(ids)
  }

  const [updateInterval, setUpdateInterval] = useState(null)
  const [restartFlag, setRestartFlag] = useState(false)

  useEffect(() => {
    if (updateInterval) {
      clearTimeout(updateInterval)
    }

    if (feedIds.length > 0) {
      // console.log("Updater configured w ", feedIds, " ", feedTimestamp)
      const int = setTimeout(() => {
        let arts_found = 0
        for (let i = 0; i < feedIds.length; i++) {
          props.updateFeed(feedIds[i], feedTimestamp).then(
            (articles) => {
              // console.log("ADDDING ARTICLES: ", articles)
              if (articles.length > 0) {
                setFeedTimestamp(Math.floor(Date.now() / 1000))
                arts_found += articles.length
              } 
            },
            (err) => {
              console.log("Error updating feed ", err)
              return
            }
          )
        }
        if (arts_found == 0) {
          console.log("Changing delay: ", delay)
          setIntDelay(delay => Math.min(delay * 1.5, 120000))
        } else {
          setIntDelay(5000)
        }
        setRestartFlag(!restartFlag)
      }, delay); 
      setUpdateInterval(int)
    } else {
      setUpdateInterval(null)
    }
  }, [feedChangeFlag, restartFlag])


  return (
    <FeedUpdaterContext.Provider value={setIds}>
      {props.children}
    </FeedUpdaterContext.Provider>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  pageLimit: summary.pageLimit,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateFeed,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedUpdater)

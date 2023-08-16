

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { useState, useEffect, createContext } from "react";
import StatsService from "../../services/stats.service";

export const PlayerStatContext = createContext()

function PlayerStatTracker(props) {
  const [sessionStartTime, setSessionStartTime] = useState(Date.now())

  const completeArticle = (article) => {
    const event = constructEvent(article, "complete")
    addEvent(event)
  }

  const skipForward = (article) => {
    const event = constructEvent(article, "skipForward", article.percComplete())
    addEvent(event)
  }
  const skipBackward = (article) => {
    const event = constructEvent(article, "skipBackward")
    addEvent(event)
  }

  const constructEvent = (article, type, percComplete) => {
    const event = {
      user_id: props.user._id,
      article_id: article.id,

      session_start_time: sessionStartTime,
      event_time: Date.now(),

      event_type: type,
    
    }
    if (percComplete) {
      event.percent_complete = percComplete
    }
    return event
  }

  const addEvent = (event) => {
    // if (process.env.NEXT_PUBLIC_MODE === 'dev') {
    //   console.log("Registering event: ", event)
    // } else {
    StatsService.addEvent(event)
    // }
  }


  return (
    <PlayerStatContext.Provider value={{
      completeArticle, 
      skipForward, 
      skipBackward,
      }}
    >
      {props.children}
    </PlayerStatContext.Provider>
  )
}


const mapStateToProps = ({user, summary}) => ({
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerStatTracker)
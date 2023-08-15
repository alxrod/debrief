import { PlusIcon } from '@heroicons/react/outline'
import { useState, useEffect, useContext, useMemo, Fragment} from 'react'

import { FastForwardIcon, RewindIcon, PauseIcon, PlayIcon, RefreshIcon } from '@heroicons/react/solid'
import ArticleView from './article_view'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import {AudioPlayerContext} from "../summary_feed/audio_player";
import { FeedCounterContext } from '../feed_counter';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const FeedTag = (props) => {
  return (
    <b
      className={classNames(
        props.bgColor,
        'rounded-md mt-0.5 px-1.5 py-0.5 text-xs font-medium',
        props.textColor
      )}
    >
      {props.text}
    </b>
  )
}
const MainView = (props) => {
  const {
    queueEmpty,
    unreadCount,
    restart,
    skipBackward,
    skipForward,
    playFromStart,
    articles,
    articlesChanged,
    playSingle, 
    pause, 
    resume,
    playing, 
    current
  } = useContext(AudioPlayerContext);

  const feedCountTable = useContext(FeedCounterContext)

  const curArticle = useMemo(() => {
    const art = articles.filter(article => article.id === current.id)[0]
    console.log("Cur: ", art)
    return art
  }, [current.id, articlesChanged])


  return (
    <>
    {curArticle ? (
      <ArticleView 
        article={curArticle} 
        playSingleAudio={playSingle} 
        pauseAudio={pause} 
        resumeAudio={resume}
        curAudioPlaying={playing} 
        curAudio={current}
      />
    ) : (
      <div className="max-w-[300px] sm:max-w-[600px] min-w-md p-3 text-sm text-gray-500 font-medium">
        <h3>You have{" "}
          {Object.keys(feedCountTable).map((key, index) => (
            <Fragment key={index}>
              <b className="text-gray-700">{feedCountTable[key]}</b>{" articles from "}<FeedTag bgColor="bg-green-100" textColor="text-green-700" text={key}/>
              {Object.keys(feedCountTable).length == 2 && index === 0 ? ", " :
                Object.keys(feedCountTable).length > 2 && index < Object.keys(feedCountTable).length - 2 ? ", " :
                Object.keys(feedCountTable).length > 1 && index === Object.keys(feedCountTable).length - 2 ? ", and " : "."}
            </Fragment>
          ))}
        </h3>
      </div>
    )}
    </>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  user: user.user,
  articles: summary.articles,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainView)
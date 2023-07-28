import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/outline'

import { toggleFlag } from '../../reducers/summary/dispatchers/summary.edit.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import SummaryEntry from './summary_entry'
import FeedHeader from './feed_header'
import EntryPagination from './entry_pagination';


const SummaryFeed = (props) => {

  const [windowIsActive, setWindowIsActive] = useState(true)

  function handleActivity(forcedFlag) {
    if (typeof forcedFlag === 'boolean') {
      return forcedFlag ? setWindowIsActive(true) : setWindowIsActive(false)
    }

    return document.hidden ? setWindowIsActive(false) : setWindowIsActive(true)
  }

  useEffect(() => {
    const handleActivityFalse = () => handleActivity(false)
    const handleActivityTrue = () => handleActivity(true)

    document.addEventListener('visibilitychange', handleActivity)
    document.addEventListener('blur', handleActivityFalse)
    window.addEventListener('blur', handleActivityFalse)
    window.addEventListener('focus', handleActivityTrue )
    document.addEventListener('focus', handleActivityTrue)

    return () => {
      window.removeEventListener('blur', handleActivity)
      document.removeEventListener('blur', handleActivityFalse)
      window.removeEventListener('focus', handleActivityFalse)
      document.removeEventListener('focus', handleActivityTrue )
      document.removeEventListener('visibilitychange', handleActivityTrue )
    }
  }, [])


  const pauseAudio = () => {
    if (curAudio.cur != null) {
      setCurAudioPlaying(false)
      console.log("PAUSING AUDIO for ", curAudio.id)
      curAudio.cur.pause();
    }
  }

  const resumeAudio = () => {
    if (curAudio.cur != null) {
      setCurAudioPlaying(true)
      console.log("RESUMING AUDIO for ", curAudio.id)
      curAudio.cur.play();
    }
  }

  const filters = {
    feed: (articles) => {
      return [
        ...(articles.filter(function (article) {
          return !article.metadata.read && !article.metadata.archived && article.feed_id === curFeedId;
        }).sort((a, b) => (a.metadata.save_time.getTime() < b.metadata.save_time.getTime()) ? 1 : -1)),
        ...(articles.filter(function (article) {
          return article.metadata.read && !article.metadata.archived && article.feed_id === curFeedId;
        }).sort((a, b) => (a.metadata.save_time.getTime() < b.metadata.save_time.getTime()) ? 1 : -1)),
      ]
    },
    unread: (articles) => {
      return articles.filter(function (article) {
        return !article.metadata.read;
      }).sort((a, b) => (a.metadata.save_time.getTime() < b.metadata.save_time.getTime()) ? 1 : -1)
    },
    archived: (articles) => {
      return articles.filter(function (article) {
        return article.metadata.archived;
      }).sort((a, b) => (a.metadata.save_time.getTime() < b.metadata.save_time.getTime()) ? 1 : -1)
    },
    saved: (articles) => {
      return articles.filter(function (article) {
        return article.metadata.saved;
      }).sort((a, b) => (a.metadata.save_time.getTime() < b.metadata.save_time.getTime()) ? 1 : -1)
    },

  }
  

  const playAllAudio = () => {
    console.log("STARTING")
    pauseAudio()
    setAllAudioPlaying(true)
    setAllAudioFilter(curFilter)
    let prev = null;
    let next = null;
    let start = null
    let order_count = 0;

    const all_audios = []
    filters[curFilter](props.articles).filter(function (article) {
      return !article.metadata.read && article.summary_uploaded;
    }).sort((a, b) => (a.metadata.save_time.getTime() < b.metadata.save_time.getTime()) ? 1 : -1).forEach((article) => {
      const audio = { 
        id: article.id,
        upload_path: article.upload_path,
        cur: makeAudio(article.upload_path),
        next: next,
        prev: prev,
        order: order_count,
      }
      order_count++
      if (prev != null) {
        prev.next = audio
      }
      prev = audio
      if (start == null) {
        start = audio
      }
      audio.cur.onended = function() {
        console.log("Calling end for ", audio.id, " ord num ", audio.order)
        markRead(audio.id, true)
        if (audio.next != null) {
          setCurAudioPlaying(true)
          setCurAudio(audio.next)
          console.log("Transitioning to next audio order ", audio.order)
          audio.next.cur.play()
          setCurOrderNum(audio.next.order)
        } else {
          setCurAudioPlaying(false)
        }
      };
      all_audios.push(audio)
    })
    if (start === null) {
      return
    }
    setCurAudio(start)
    setAllAudios(all_audios)
    setCurOrderNum(start.order)
    console.log("STARTING PLAY ALL")
    console.log(all_audios)
    start.cur.play()
    setCurAudioPlaying(true)
  }

  const refreshAudio = (audio) => {
    audio.cur.pause()
    const endFunc = audio.cur.onended
    audio.cur = makeAudio(audio.upload_path)
    audio.cur.onended = endFunc
    setCurAudio(audio)
    console.log("REFRESHIG AUDIO ", audio.id)
    audio.cur.play()
    setCurAudioPlaying(true)
  }

  const skipForward = () => {
    pauseAudio()
    markRead(curAudio.id, true)
    if (curAudio.next != null) {
      refreshAudio(curAudio.next)
      console.log("SKIPPIGN AHEAD TO ", curAudio.next.id)
      curAudio.next.cur.play()
      setCurAudioPlaying(true)
      setCurAudio(curAudio.next)
    } else {
      setCurAudioPlaying(false)
      setAllAudioPlaying(false)
      setAllAudioFilter("")
      setCurAudio(
        { 
          id: "",
          cur: null,
          next: null,
          prev: null,
        }
      )
    }
    
  }

  const skipBackward = () => {
    pauseAudio()
    if (curAudio.prev != null) {
      refreshAudio(curAudio.prev)
      console.log("SKIPPIGN BACK TO ", curAudio.prev.id)
      curAudio.prev.cur.play()
      setCurAudio(curAudio.prev)
      setCurAudioPlaying(true)
    } else {
      refreshAudio(curAudio)
    }
    
  }


  const playSingleAudio = (article) => {
    pauseAudio()
    setAllAudioPlaying(false)
    const audio = { 
      id: article.id,
      cur: makeAudio(article.upload_path),
      next: null,
      prev: null,
    }
    audio.cur.onended = function() {
      markRead(audio.id, true)
      setCurAudioPlaying(false)
    };
    setCurAudio(audio)
    console.log("PLAYING A SINGLE AUDIO ", audio.id)
    audio.cur.play()
    setCurAudioPlaying(true)
  }

  const markRead = (website_id, read) => {
    let new_meta = {}
    for (let i = 0; i < props.articles.length; i++) {
      if (props.articles[i].id === website_id) {
        new_meta = props.articles[i].metadata
      }
    }
    new_meta.read = read
    props.toggleFlag(website_id, new_meta).then(
      console.log("Marked article as read"),
    )
  }

  const [curAudio, setCurAudio] = useState({id: "", cur: null, next: null, prev: null})
  const [mostRecentId, setMostRecentId] = useState("")
  const [curAudioPlaying, setCurAudioPlaying] = useState(false)
  const [allAudioPlaying, setAllAudioPlaying] = useState(false)
  const [allAudioFilter, setAllAudioFilter] = useState("")
  const [playbackSpeed, setPlaybackSpeed] = useState(1.2)

  const [allAudios, setAllAudios] = useState([])
  const [curOrderNum, setCurOrderNum] = useState(-1)
  useEffect(() => {
    if (allAudioPlaying && windowIsActive) {
      console.log("Pausing all prevs")
      for (let i = 0; i < allAudios.length; i++) {
        if (allAudios[i].order < curOrderNum) {
          console.log("Pausing ", allAudios[i].id)
          allAudios[i].cur.pause()
          allAudios[i].cur.src = ""
        }
      }
      console.log("HALT")
    }
  }, [windowIsActive])


  const [curFeedId, setCurFeedId] = useState("")
  useEffect(() => {
    if (curFeedId === "") {
      for(let i = 0; i < props.user?.feeds.length; i++) {
        if (props.user.feeds[i].name.toLowerCase() === "inbox") {
          setCurFeedId(props.user.feeds[i].id)
          break
        }
      }
    }
  }, [props.user])

  const [curFilter, setCurFilter] = useState("feed")
  const makeAudio = (upload_path) => {
    const url = "https://debrief-summaries.s3.amazonaws.com/" + upload_path
    var a = new Audio(url);
    a.playbackRate=playbackSpeed;
    return a
  }

  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full">
        <FeedHeader 
          playAllAudio={playAllAudio}
          pauseAudio={pauseAudio}
          resumeAudio={resumeAudio}
          refreshAudio={refreshAudio}
          curAudio={curAudio}
          curAudioPlaying={curAudioPlaying} 
          allAudioPlaying={allAudioPlaying}
          allAudioFilter={allAudioFilter}
          curFilter={curFilter}
          skipForward={skipForward}
          skipBackward={skipBackward}
          readCount={filters[curFilter](props.articles).filter(function (article) {
            return !article.metadata.read && article.summary_uploaded;
          }).length}
          setCurFilter={setCurFilter}

          feeds={props.user?.feeds ? props.user.feeds : []}
          setCurFeedId={setCurFeedId}
        />
      </div>
      <div className="w-full">
        <ul role="list" className="divide-y divide-gray-100 min-w-md max-w-md">
          {filters[curFilter](props.articles).length > 0 && filters[curFilter](props.articles).length < 20 ? (
            <>
            {filters[curFilter](props.articles).map((article) => (
              <SummaryEntry 
              article={article} 
              key={article.id} 
              playSingleAudio={playSingleAudio} 
              pauseAudio={pauseAudio} 
              resumeAudio={resumeAudio}
              curAudioPlaying={curAudioPlaying} 
              curAudio={curAudio}
              />
            ))}
            </>
          ) : filters[curFilter](props.articles).length > 20 ? (
            <EntryPagination 
              articles={filters[curFilter](props.articles)}
              playSingleAudio={playSingleAudio} 
              pauseAudio={pauseAudio} 
              resumeAudio={resumeAudio}
              curAudioPlaying={curAudioPlaying} 
              curAudio={curAudio}
            />
          ) : (
            <li key={"no-articles"} className="flex items-start justify-between gap-x-6 py-5">
              <div className="min-w-0">
                <div className="flex justify-between items-center gap-x-3">
                    <p 
                      target="_blank" 
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      No articles in this feed yet
                    </p>
                </div>
  
                <div 
                  className="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500"
                  style={{
                    "overflow": "hidden",
                    "transition": "0.4s max-height",
                  }}>
                  Email links to debrief.later@gmail.com and we will automatically generate audio summaries or add a feed.
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  articles: summary.articles,
  articlesChanged: summary.articlesChanged,
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleFlag
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryFeed)
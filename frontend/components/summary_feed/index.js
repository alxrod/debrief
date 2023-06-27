import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/outline'

import { toggleFlag } from '../../reducers/summary/dispatchers/summary.edit.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import SummaryEntry from './summary_entry'
import FeedHeader from './feed_header'
 
const SummaryFeed = (props) => {
  const pauseAudio = () => {
    if (curAudio.cur != null) {
      setCurAudioPlaying(false)
      curAudio.cur.pause();
    }
  }

  const resumeAudio = () => {
    if (curAudio.cur != null) {
      setCurAudioPlaying(true)
      curAudio.cur.play();
    }
  }

  const filters = {
    all: (articles) => {
      return [
        ...(articles.filter(function (article) {
          return !article.metadata.read && !article.metadata.archived;
        }).sort((a, b) => (a.metadata.save_time.getTime() < b.metadata.save_time.getTime()) ? 1 : -1)),
        ...(articles.filter(function (article) {
          return article.metadata.read && !article.metadata.archived;
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
    pauseAudio()
    setAllAudioPlaying(true)
    let prev = null;
    let next = null;
    let start = null
    props.articles.filter(function (article) {
      return !article.metadata.read && article.summary_uploaded;
    }).sort((a, b) => (a.metadata.save_time.getTime() < b.metadata.save_time.getTime()) ? 1 : -1).forEach((article) => {
      const audio = { 
        id: article.id,
        upload_path: article.upload_path,
        cur: makeAudio(article.upload_path),
        next: next,
        prev: prev,
      }
      if (prev != null) {
        prev.next = audio
      }
      prev = audio
      if (start == null) {
        start = audio
      }
      audio.cur.onended = function() {
        markRead(audio.id, true)
        if (audio.next != null) {
          setCurAudioPlaying(true)
          audio.next.cur.play()
        } else {
          setCurAudioPlaying(false)
        }
      };
    })
    if (start === null) {
      return
    }
    setCurAudio(start)
    start.cur.play()
    setCurAudioPlaying(true)
  }

  const refreshAudio = (audio) => {
    audio.cur.pause()
    const endFunc = audio.cur.onended
    audio.cur = makeAudio(audio.upload_path)
    audio.cur.onended = endFunc
    setCurAudio(audio)
    audio.cur.play()
    setCurAudioPlaying(true)
  }

  const skipForward = () => {
    pauseAudio()
    markRead(curAudio.id, true)
    if (curAudio.next != null) {
      refreshAudio(curAudio.next)
      curAudio.next.cur.play()
      setCurAudioPlaying(true)
      setCurAudio(curAudio.next)
    } else {
      setCurAudioPlaying(false)
      setAllAudioPlaying(false)
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
  const [curAudioPlaying, setCurAudioPlaying] = useState(false)
  const [allAudioPlaying, setAllAudioPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.2)

  const [curFilter, setCurFilter] = useState("all")
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
          skipForward={skipForward}
          skipBackward={skipBackward}
          readCount={props.articles.filter(function (article) {
            return !article.metadata.read && article.summary_uploaded;
          }).length}
          setCurFilter={setCurFilter}
        />
      </div>
      <div className="w-full">
        <ul role="list" className="divide-y divide-gray-100 min-w-md max-w-md">
          {filters[curFilter](props.articles).length !== 0 ? (
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
          ) : (
            <li key={"no-articles"} className="flex items-start justify-between gap-x-6 py-5">
              <div className="min-w-0">
                <div className="flex justify-between items-center gap-x-3">
                    <p 
                      target="_blank" 
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      No articles saved yet
                    </p>
                </div>
  
                <div 
                  className="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500"
                  style={{
                    "overflow": "hidden",
                    "transition": "0.4s max-height",
                  }}>
                  Email links to debrief.later@gmail.com and we will automatically generate audio summaries and show them here.
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
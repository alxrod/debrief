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
    if (curAudio.audio != null) {
      setCurAudioPlaying(false)
      curAudio.audio.pause();
    }
  }

  const resumeAudio = () => {
    if (curAudio.audio != null) {
      setCurAudioPlaying(true)
      curAudio.audio.play();
    }
  }

  const [curFilter, setCurFilter] = useState("all")
  const filters = {
    all: (websites) => {
      return [
        ...(websites.filter(function (site) {
          return !site.read && !site.archived;
        }).sort((a, b) => (a.saveTime.getTime() < b.saveTime.getTime()) ? 1 : -1)),
        ...(websites.filter(function (site) {
          return site.read && !site.archived;
        }).sort((a, b) => (a.saveTime.getTime() < b.saveTime.getTime()) ? 1 : -1)),
      ]
    },
    unread: (websites) => {
      return websites.filter(function (site) {
        return !site.read;
      }).sort((a, b) => (a.saveTime.getTime() < b.saveTime.getTime()) ? 1 : -1)
    },
    archived: (websites) => {
      return websites.filter(function (site) {
        return site.archived;
      }).sort((a, b) => (a.saveTime.getTime() < b.saveTime.getTime()) ? 1 : -1)
    },
    saved: (websites) => {
      return websites.filter(function (site) {
        return site.saved;
      }).sort((a, b) => (a.saveTime.getTime() < b.saveTime.getTime()) ? 1 : -1)
    },
  }

  // const playAllAudio = () => {
  //   pauseAudio()
  //   setAllAudioPlaying(true)
  //   let prev = null;
  //   let next = null;
  //   let start = null
  //   props.websites.filter(function (site) {
  //     return !site.read && site.summaryUploaded;
  //   }).sort((a, b) => (a.saveTime.getTime() < b.saveTime.getTime()) ? 1 : -1).forEach((website) => {
  //     const audio = { 
  //       id: website.id,
  //       cur: makeAudio(website.id),
  //       next: next,
  //       prev: prev,
  //     }
  //     if (prev != null) {
  //       prev.next = audio
  //     }
  //     prev = audio
  //     if (start == null) {
  //       start = audio
  //     }
  //     audio.cur.onended = function() {
  //       markRead(audio.id, true)
  //       if (audio.next != null) {
  //         setCurAudioPlaying(true)
  //         audio.next.cur.play()
  //       } else {
  //         setCurAudioPlaying(false)
  //       }
  //     };
  //   })
  //   if (start === null) {
  //     return
  //   }
  //   setCurAudio(start)
  //   start.cur.play()
  //   setCurAudioPlaying(true)
  // }

  // const refreshAudio = (audio) => {
  //   audio.cur.pause()
  //   const endFunc = audio.cur.onended
  //   audio.cur = makeAudio(audio.id)
  //   audio.cur.onended = endFunc
  //   setCurAudio(audio)
  //   audio.cur.play()
  //   setCurAudioPlaying(true)
  // }

  // const skipForward = () => {
  //   pauseAudio()
  //   markRead(curAudio.id, true)
  //   if (curAudio.next != null) {
  //     refreshAudio(curAudio.next)
  //     curAudio.next.cur.play()
  //     setCurAudioPlaying(true)
  //     setCurAudio(curAudio.next)
  //   } else {
  //     setCurAudioPlaying(false)
  //     setAllAudioPlaying(false)
  //     setCurAudio(
  //       { 
  //         id: "",
  //         cur: null,
  //         next: null,
  //         prev: null,
  //       }
  //     )
  //   }
    
  // }

  // const skipBackward = () => {
  //   pauseAudio()
  //   if (curAudio.prev != null) {
  //     refreshAudio(curAudio.prev)
  //     curAudio.prev.cur.play()
  //     setCurAudio(curAudio.prev)
  //     setCurAudioPlaying(true)
  //   } else {
  //     refreshAudio(curAudio)
  //   }
  // }


  const playSingleAudio = (website) => {
    pauseAudio()
    setAllAudioPlaying(false)
 
    const audio = { 
      id: website.id,
      audio: curAudio.audio,
    }
    audio.audio.src = "https://debrief-summaries.s3.amazonaws.com/" + website.id

    audio.audio.onended = function() {
      markRead(audio.id, true)
      setCurAudioPlaying(false)
    };
    
    setCurAudioPlaying(true)
    setCurAudio(audio)
    
  }

  const markRead = (website_id, read) => {
    props.toggleFlag(website_id, "read", read).then(
      console.log("Marked article as read"),
    )
  }

  const [curAudio, setCurAudio] = useState({id: "", audio: null})
  useEffect(() => {
    if (curAudio.id === "") {
      curAudio.audio = new Audio()
      console.log("Created audio as ", curAudio)
      setCurAudio(curAudio)
    }
  }, [curAudio])

  const [curAudioPlaying, setCurAudioPlaying] = useState(false)
  const [allAudioPlaying, setAllAudioPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.2)


  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full">
        {/* <FeedHeader 
          playAllAudio={playAllAudio}
          pauseAudio={pauseAudio}
          resumeAudio={resumeAudio}
          refreshAudio={refreshAudio}
          curAudio={curAudio}
          curAudioPlaying={curAudioPlaying} 
          allAudioPlaying={allAudioPlaying}
          skipForward={skipForward}
          skipBackward={skipBackward}
          readCount={props.websites.filter(function (site) {
            return !site.read && site.summaryUploaded;
          }).length}
          setCurFilter={setCurFilter}
        /> */}
        <p className="text-red-400">v1.0</p>
      </div>
      <div className="w-full">
        <ul role="list" className="divide-y divide-gray-100 min-w-md max-w-md">
          {filters[curFilter](props.websites).length !== 0 ? (
            <>
            {filters[curFilter](props.websites).map((website) => (
              <SummaryEntry 
              website={website} 
              key={website.id} 
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
  websites: summary.websites,
  websitesChanged: summary.websitesChanged,
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleFlag
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryFeed)
import { PlusIcon } from '@heroicons/react/outline'
import { useState, useEffect, useContext } from 'react'

import { FastForwardIcon, RewindIcon, PauseIcon, PlayIcon, RefreshIcon, CheckIcon} from '@heroicons/react/solid'
import { ClockIcon} from '@heroicons/react/outline'

import {AudioPlayerContext} from "../summary_feed/audio_player";
import PlaybackButton from "./playback_button"
import DigestSlider from "./digest_slider"
import {Oval} from 'react-loading-icons'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



export default function PlayMenu(props) {
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
    current,
    clearQueue,
  } = useContext(AudioPlayerContext);

  useEffect(() => {
    if (props.autostart) {
      playFromStart()
      props.setAutostart(false)
    }
    
  }, [props.autostart])

  return (

        <div className="-mt-px flex divide-x divide-gray-200 text-gray-500">
        {!queueEmpty ? (
          <>
            <div className="flex w-0 flex-1">
              <button
                type="button"
                onClick={() => skipBackward()}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
              >
                <RewindIcon className="h-8 w-8 text-gray-500" aria-hidden="true" />
              </button>
            </div>

            <div className="flex w-0 flex-1">
              <button
                type="button"
                onClick={() => clearQueue()}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
              >
                <RefreshIcon className="h-8 w-8 text-gray-500" aria-hidden="true" />
              </button>
            </div>

            <div className="flex w-0 flex-1">
            {playing ? (
              <button
                type="button"
                onClick={() => pause()}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
              >
                <PauseIcon className="h-8 w-8 text-gray-500" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => resume()}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
              >
                <PlayIcon className="h-8 w-8 text-gray-500" aria-hidden="true" />
              </button>
            )}
            </div>

            <div className="flex w-0 flex-1 justify-center">
              <PlaybackButton/>
            </div>
            
            <div className="flex w-0 flex-1">
              <button
                type="button"
                onClick={() => skipForward()}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
              >
                <FastForwardIcon className="h-8 w-8 text-gray-500" aria-hidden="true" />
              </button>
            </div>
          </>
        ) : (unreadCount > 0 && !props.waitingForNext) ? (
          <div className="flex flex-col items-center flex-1">
            <DigestSlider digestSize={props.digestSize} setDigestSize={props.setDigestSize} maxSize={props.maxSize}/>
            <div className="flex w-full">
              <button
                type="button"
                onClick={() => {
                  if (props.moreLeft) {
                    // console.log("GOT SOME IN THE TANK")
                    props.setWaitingForNext(true)
                  }
                  playFromStart()
                }}
                className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent pb-3 text-sm font-semibold text-gray-900"
              >
                <p className="text-gray-600">Start Digest</p> <PlayIcon className="ml-1 h-8 w-8 text-gray-500" aria-hidden="true" />
              </button>
            </div>
          </div>
       ) : props.waitingForNext ? (
        <div className="flex flex-col items-center flex-1">
          <DigestSlider digestSize={props.digestSize} setDigestSize={props.setDigestSize} maxSize={props.maxSize}/>
          <div className="flex w-full">
            <button
              type="button"
              onClick={props.nextDigest}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
            >
              <p className="text-gray-600">Want to hear more?</p> <PlayIcon className="my-2 ml-1 h-5 w-5 text-gray-500" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : !props.generating ? (
        <div className="flex w-0 flex-1">
          <button
            type="button"
            disabled
            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
          >
            <p className="text-gray-600">You're up to date</p> <CheckIcon className="my-2 ml-1 h-5 w-5 text-gray-500" aria-hidden="true" />
          </button>
        </div>
       ) : (
        <div className="flex w-0 flex-1 py-8">
          <button
            type="button"
            disabled
            className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
          >
            <p className="text-gray-600">Generating your digest...</p> <Oval className="w-4 h-4" stroke={"#7993A0"} fill={"#7993A0"} strokeWidth={4}/>
          </button>
        </div>
       )}
        </div>


  )
}

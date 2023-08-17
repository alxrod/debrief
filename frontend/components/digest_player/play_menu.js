import { PlusIcon } from '@heroicons/react/outline'
import { useState, useEffect, useContext } from 'react'

import { FastForwardIcon, RewindIcon, PauseIcon, PlayIcon, RefreshIcon, CheckIcon} from '@heroicons/react/solid'

import {AudioPlayerContext} from "../summary_feed/audio_player";

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
        ) : (unreadCount > 0) ? (
          <div className="flex w-0 flex-1">
            <button
              type="button"
              onClick={() => playFromStart()}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
            >
              <p className="text-gray-600">Start Digest</p> <PlayIcon className="ml-1 h-8 w-8 text-gray-500" aria-hidden="true" />
            </button>
          </div>
       ) : (
        <div className="flex w-0 flex-1">
        <button
          type="button"
          disabled
          className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-2 text-sm font-semibold text-gray-900"
        >
          <p className="text-gray-600">You're up to date</p> <CheckIcon className="my-2 ml-1 h-5 w-5 text-gray-500" aria-hidden="true" />
        </button>
      </div>
       )}
        </div>


  )
}
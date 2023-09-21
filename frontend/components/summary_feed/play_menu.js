import { PlusIcon } from '@heroicons/react/outline'
import { useState, useEffect, useContext } from 'react'

import { FastForwardIcon, RewindIcon, PauseIcon, PlayIcon, RefreshIcon } from '@heroicons/react/solid'

import {AudioPlayerContext} from "./audio_player";
import PlaybackButton from '../digest_player/playback_button';

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
    current
  } = useContext(AudioPlayerContext);

  return (
    <div className="flex items-center w-full justify-center">
        {!queueEmpty ? (
          <div className='flex items-center'>
            <button
              type="button"
              className="mx-2 text-gray-500 hover:text-gray-600"
              onClick={() => skipBackward()}
            >
              <RewindIcon className="h-10 w-10" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="mx-2 text-gray-500 hover:text-gray-600"
              onClick={() => restart()}
            >
              <RefreshIcon className="h-10 w-10" aria-hidden="true" />
            </button>
            {playing ? (
              <button
                type="button"
                className="mx-2 text-gray-500 hover:text-gray-600"
                onClick={() => {
                  console.log("Pausing audio")
                  pause()
                }}
              >
                <PauseIcon className="h-10 w-10" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                className="mx-2 text-gray-500 hover:text-gray-600"
                onClick={() => resume()}
              >
                <PlayIcon className="h-10 w-10" aria-hidden="true" />
              </button>
            )}
            
            <PlaybackButton size={"10"}/>
            <button
              type="button"
              className="mx-2 text-gray-500 hover:text-gray-600"
              onClick={() => skipForward()}
            >
              <FastForwardIcon className="h-10 w-10" aria-hidden="true" />
            </button>
          </div>
        ) : (unreadCount > 0) ? (
          <button
            type="button"
            className="group inline-flex items-center px-3 py-2 font-semibold text-3xl text-gray-600 hover:text-white hover:bg-primary6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary6"
            onClick={() => playFromStart()}
          >
            Play New Articles

            <PlayIcon className="ml-2 -mr-0.5 h-10 w-10 text-gray-500 group-hover:text-white" aria-hidden="true" />
          </button>
        ) : (
          <h1 className="font-semibold text-3xl text-gray-500">You are up to date</h1>
        )}
    </div>
  )
}

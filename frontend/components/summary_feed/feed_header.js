/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { useState } from 'react'

import { FastForwardIcon, RewindIcon, PauseIcon, PlayIcon, RefreshIcon } from '@heroicons/react/solid'
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function FeedHeader(props) {
  const [curTab, setCurTab] = useState("Inbox")

  const tabs = [
    { name: 'Inbox', onClick: () => {
      props.setCurFilter("all")
      setCurTab("Inbox")
    }},
    { name: 'Unread', onClick: () => {
      props.setCurFilter("unread")
      setCurTab("Unread")
    }},
    { name: 'Saved', onClick: () => {
      props.setCurFilter("saved")
      setCurTab("Saved")
    }},
    { name: 'Archived', onClick: () => {
      props.setCurFilter("archived")
      setCurTab("Archived")
    }},
    
  ]

  return (
    <div className="relative border-b border-gray-200 py-5 sm:pb-0 flex flex-col justify-center justify-between">
      <div className="flex items-center w-full justify-center">
        {props.readCount > 0 ? (<>
          {props.allAudioPlaying ? (
            <div className='flex items-center'>
              <button
                type="button"
                className="mx-2 text-gray-500 hover:text-gray-600"
                onClick={() => props.skipBackward()}
              >
                <RewindIcon className="h-10 w-10" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="mx-2 text-gray-500 hover:text-gray-600"
                onClick={() => props.refreshAudio(props.curAudio)}
              >
                <RefreshIcon className="h-10 w-10" aria-hidden="true" />
              </button>
              {props.curAudioPlaying ? (
                <button
                  type="button"
                  className="mx-2 text-gray-500 hover:text-gray-600"
                  onClick={() => props.pauseAudio()}
                >
                  <PauseIcon className="h-10 w-10" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  className="mx-2 text-gray-500 hover:text-gray-600"
                  onClick={() => props.resumeAudio()}
                >
                  <PlayIcon className="h-10 w-10" aria-hidden="true" />
                </button>
              )}
              
              <button
                type="button"
                className="mx-2 text-gray-500 hover:text-gray-600"
                onClick={() => props.skipForward()}
              >
                <FastForwardIcon className="h-10 w-10" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="group inline-flex items-center px-3 py-2 font-semibold text-3xl text-gray-600 hover:text-white hover:bg-primary6 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary6"
              onClick={() => props.playAllAudio()}
            >
              Play New Articles
              <PlayIcon className="ml-2 -mr-0.5 h-10 w-10 text-gray-500 group-hover:text-white" aria-hidden="true" />
            </button>
          )}
        </>) : (
          <h1
              className="group inline-flex items-center px-3 py-2 font-semibold text-3xl text-gray-600"
          >
            You're up to date
          </h1>
        )}
      </div>

      <div className="mt-4">
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary6"
            defaultValue={tabs.find((tab) => tab.name === curTab).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={tab.onClick}
                className={classNames(
                  (tab.name == curTab)
                    ? 'border-primary5 text-primary6'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

    </div>
  )
}

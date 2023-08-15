import { PlusIcon } from '@heroicons/react/outline'
import { useState, useMemo } from 'react'

import { FastForwardIcon, RewindIcon, PauseIcon, PlayIcon, RefreshIcon } from '@heroicons/react/solid'
import AddFeedPanel from "../add_feed_panel"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function capWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}


export default function FeedHeader(props) {
  const [curTab, setCurTab] = useState("Inbox")

  const [addPanelOpen, setAddPanelOpen] = useState(false)

  const tabs = useMemo(() => [
    ...props.feeds.map((feed) => {
      return { name: capWord(feed.name), onClick: () => {
        props.loadNewFeed(feed.id, feed.name)
        setCurTab(capWord(feed.name))
      }}
    }),
    // { name: 'Unread', onClick: () => {
    //   props.setCurFilter("unread")
    //   setCurTab("Unread")
    // }},
    // { name: 'Saved', onClick: () => {
    //   props.setCurFilter("saved")
    //   setCurTab("Saved")
    // }},
    // { name: 'Archived', onClick: () => {
    //   props.setCurFilter("archived")
    //   setCurTab("Archived")
    // }},
  ])

  return (
    <div className="relative border-b border-gray-200 py-5 sm:pb-0 flex flex-col justify-center justify-between">
      <div className="mt-4 max-w-md overflow-x-scroll">
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary6"
            defaultValue={tabs.find((tab) => tab.name === curTab)?.name}
            onChange={(e) => {
              tabs.find((tab) => tab.name === e.target.value).onClick()
            }}
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
            <button
                key="add-feed"
                // onClick={tab.onClick}

                className={classNames(
                  'hover:border-primary5 hover:text-primary6',
                  'border-transparent text-gray-500',
                  'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium flex items-center'
                )}
                onClick={() => setAddPanelOpen(true)}
              >
                <PlusIcon className="w-4 h-4 mr-1"/>
                Add Feed
              </button>
          </nav>
        </div>
      </div>
      <AddFeedPanel open={addPanelOpen} setOpen={setAddPanelOpen}/>
    </div>
  )
}

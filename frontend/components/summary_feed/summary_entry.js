import { Fragment, useState, useEffect, useMemo } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/outline'

import { toggleFlag } from '../../reducers/summary/dispatchers/summary.edit.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import { PauseIcon, PlayIcon, RefreshIcon, StarIcon } from '@heroicons/react/solid'
import { StarIcon as StarOutlineIcon, ExternalLinkIcon } from '@heroicons/react/outline'

import {Oval} from 'react-loading-icons'

const statuses = {
  Unread: 'text-green-700 bg-green-50 ring-green-600/20',
  Old: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function truncateString(str, num) {
  let words = str.split(" ");
  if (words.length <= num) {
    return str;
  }
  let truncated = words.slice(0, num).join(" ");
  return truncated + "...";
}

const SummaryEntry = (props) => {
  const isAuthed = useMemo(() => {
    if (props.user?.feeds) {
      return true
    } else {
      return false
    }
  }, [props.user?.feeds])

  const genTimeString = (date) => {
    return date.toLocaleTimeString([], {timeStyle: 'short'}) + " " + date.toLocaleDateString() 
  }

  return (
    <div key={props.article.id} className="flex items-start justify-between w-full grow" reloadattr={props.articlesChanged.toString()}>
      <div className="w-full">
        <div className="flex justify-between items-center gap-x-3">
            <a 
              href={props.article.raw_link} 
              target="_blank" 
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {props.article.title}
            </a>
            {isAuthed && (
              <div className="flex gap-x-3 justify-start items-center">
                <p
                  className={classNames(
                    props.article.metadata.read ? statuses["Old"] : statuses["Unread"],
                    'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                  )}
                >
                  {props.article.metadata.read ? "old" : "unread"}
                </p>
                
                <button
                  onClick={() => {
                    props.article.metadata.saved = !props.article.metadata.saved
                    props.toggleFlag(props.article.id, props.article.metadata)
                  }}
                >
                  {props.article.metadata.saved ? (
                    <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  ) : (
                    <StarOutlineIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}
        </div>
        <div className="mt-1 flex justify-between items-center gap-x-2 text-xs leading-5 text-gray-500">
          <div className={"flex grow gap-x-1 "  + (props.curAudio.id !== props.article.id ? "flex-row items-center" : "flex-col items-start")}>
            <p className="whitespace-nowrap">
              Added on{" "}
              <time dateTime={props.article.metadata.save_time}>
                {genTimeString(props.article.metadata.save_time)}
              </time>
            </p>
            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
              <circle cx={1} cy={1} r={1} />
            </svg>
            <a 
              href={props.article.raw_link} 
              target="_blank" 
              className="truncate text-secondary4 hover:text-secondary5 font-medium flex gap-x-1 items-center"
            >
              Read More
              <ExternalLinkIcon className="h-3 w-3 inline-block" aria-hidden="true" />
            </a>
          </div>
          <div className="grow"></div>

          {props.article.summary_uploaded && (<>
            {props.curAudio.id !== props.article.id  ? (
              <button
                className='p-1'
                onClick={() => props.playSingleAudio(props.article)}
              >
                <PlayIcon className="h-8 w-8 text-gray-600 hover:text-gray-700" aria-hidden="true" />
              </button>
            ) : (props.curAudio.id === props.article.id && !props.curAudioPlaying) ? (
              <>
              <button
                className='p-1'
                onClick={() => props.playSingleAudio(props.article)}
              >
                <RefreshIcon className="h-8 w-8 text-gray-600 hover:text-gray-700" aria-hidden="true" />
              </button>
              <button
                className='p-1'
                onClick={() => props.resumeAudio()}
              >
                <PlayIcon className="h-8 w-8 text-gray-600 hover:text-gray-700" aria-hidden="true" />
              </button>
              </>
            ) : (
              <>
                <button
                  className='p-1'
                  onClick={() => props.playSingleAudio(props.article)}
                >
                  <RefreshIcon className="h-8 w-8 text-gray-600 hover:text-gray-700" aria-hidden="true" />
                </button>
                <button
                  className='p-1'
                  onClick={() => props.pauseAudio()}
                >
                  <PauseIcon className="h-8 w-8 text-gray-600 hover:text-gray-700" aria-hidden="true" />
                </button>
              </>
            )}
            {isAuthed && (
            <div className="flex flex-none items-center gap-x-4">
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                          onClick={() => {
                            props.article.metadata.read = !props.article.metadata.read
                            props.toggleFlag(props.article.id, props.article.metadata)
                          }}
                        >
                          {"Mark " + (props.article.metadata.read ? "Unread" : "Read")}<span className="sr-only">, {props.article.id}</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                    {({ active }) => (
                        <button
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                          onClick={() => {
                            props.article.metadata.saved = !props.article.metadata.saved
                            props.toggleFlag(props.article.id, props.article.metadata)
                          }}
                        >
                          {(props.article.metadata.saved ? "Unsave" : "Save")}<span className="sr-only">, {props.article.id}</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                    {({ active }) => (
                        <button
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                          onClick={() => {
                            props.article.metadata.archived = !props.article.metadata.archived
                            props.toggleFlag(props.article.id, props.article.metadata)
                          }}
                        >
                          {(props.article.metadata.archived ? "Unarchive" : "Archive")}<span className="sr-only">, {props.article.id}</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            )}
          </>
        )}
        </div>
        {props.article.summary_uploaded ? (
          <div 
            className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500"
            style={{
              "overflow": "hidden",
              "transition": "0.4s max-height",
              "maxHeight": (props.curAudio.id === props.article.id) ? "400px" : "52px"
            }}>
            {(props.curAudio.id === props.article.id && props.curAudioPlaying) ? (
              <p>{props.article.summary}</p>
            ) : (
              <p>{truncateString(props.article.summary, 20)}</p>
            )}
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-x-2 leading-5 text-gray-500">
            <h3 className="text-gray-400 font-medium">Generating Summary...</h3>
            <Oval className="w-4 h-4" stroke={"#7993A0"} fill={"#7993A0"} strokeWidth={4}/>
          </div>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  articlesChanged: summary.articlesChanged,
  user: user.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleFlag
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryEntry)
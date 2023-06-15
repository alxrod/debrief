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

  const genTimeString = (date) => {
    return date.toLocaleTimeString([], {timeStyle: 'short'}) + " " + date.toLocaleDateString() 
  }

  
  return (
    <li key={props.website.id} className="flex items-start justify-between gap-x-6 py-5" reloadattr={props.websitesChanged.toString()}>
      <div className="min-w-0">
        <div className="flex justify-between items-center gap-x-3">
            <a 
              href={props.website.rawLink} 
              target="_blank" 
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {props.website.title}
            </a>

            <div className="flex gap-x-3 justify-start items-center">
              <p
                className={classNames(
                  props.website.read ? statuses["Old"] : statuses["Unread"],
                  'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {props.website.read ? "old" : "unread"}
              </p>
              
              <button
                onClick={() => props.toggleFlag(props.website.id, "saved", !props.website.saved)}
              >
                {props.website.saved ? (
                  <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                ) : (
                  <StarOutlineIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                )}
              </button>
            </div>
        </div>
        <div className="mt-1 flex justify-between items-center gap-x-2 text-xs leading-5 text-gray-500">
          <div className={"flex grow gap-x-1 "  + (props.curAudio.id !== props.website.id ? "flex-row items-center" : "flex-col items-start")}>
            <p className="whitespace-nowrap">
              Added on{" "}
              <time dateTime={props.website.saveTime}>
                {genTimeString(props.website.saveTime)}
              </time>
            </p>
            <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
              <circle cx={1} cy={1} r={1} />
            </svg>
            <a 
              href={props.website.rawLink} 
              target="_blank" 
              className="truncate text-secondary4 hover:text-secondary5 font-medium flex gap-x-1 items-center"
            >
              Read More
              <ExternalLinkIcon className="h-3 w-3 inline-block" aria-hidden="true" />
            </a>
          </div>

          {props.website.summaryUploaded && (<>
            {props.curAudio.id !== props.website.id  ? (
              <button
                className='p-1'
                onClick={() => props.playSingleAudio(props.website)}
              >
                <PlayIcon className="h-8 w-8 text-gray-600 hover:text-gray-700" aria-hidden="true" />
              </button>
            ) : (props.curAudio.id === props.website.id && !props.curAudioPlaying) ? (
              <>
              <button
                className='p-1'
                onClick={() => props.playSingleAudio(props.website)}
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
                  onClick={() => props.playSingleAudio(props.website)}
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
                          onClick={() => props.toggleFlag(props.website.id, "read", !props.website.read)}
                        >
                          {"Mark " + (props.website.read ? "Unread" : "Read")}<span className="sr-only">, {props.website.id}</span>
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
                          onClick={() => props.toggleFlag(props.website.id, "saved", !props.website.saved)}
                        >
                          {(props.website.saved ? "Unsave" : "Save")}<span className="sr-only">, {props.website.id}</span>
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
                          onClick={() => props.toggleFlag(props.website.id, "archived", !props.website.archived)}
                        >
                          {(props.website.archived ? "Unarchive" : "Archive")}<span className="sr-only">, {props.website.id}</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </>
        )}
        </div>
        {props.website.summaryUploaded ? (
          <div 
            className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500"
            style={{
              "overflow": "hidden",
              "transition": "0.4s max-height",
              "maxHeight": (props.curAudio.id === props.website.id) ? "400px" : "52px"
            }}>
            {(props.curAudio.id === props.website.id && props.curAudioPlaying) ? (
              <p>{props.website.summary}</p>
            ) : (
              <p>{truncateString(props.website.summary, 20)}</p>
            )}
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-x-2 leading-5 text-gray-500">
            <h3 className="text-gray-400 font-medium">Generating Summary...</h3>
            <Oval className="w-4 h-4" stroke={"#7993A0"} fill={"#7993A0"} strokeWidth={4}/>
          </div>
        )}
      </div>
    </li>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  websitesChanged: summary.websitesChanged,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleFlag
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryEntry)
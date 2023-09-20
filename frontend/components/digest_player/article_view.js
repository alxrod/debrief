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

const ArticleView = (props) => {

  const genTimeString = (date) => {
    return date.toLocaleTimeString([], {timeStyle: 'short'}) + " " + date.toLocaleDateString() 
  }

  const feedNamesTable = useMemo(() => {
    let table = {}
    if (props.user?.feeds) {
      props.user.feeds.forEach(feed => {
        table[feed.id] = feed.name
        if (feed?.query_content) {
          table[feed.id] = feed.query_content
        }
      })
    }
    return table
  }, [props.user?.feeds])

  return (
    <div className="flex items-start justify-between p-4 w-full grow" reloadattr={props.articlesChanged.toString()}>
      <div className="max-w-[225px] sm:max-w-[100%] sm:grow min-w-md">
        <a 
          href={props.article.raw_link} 
          target="_blank" 
          className="text-sm font-semibold leading-6 text-gray-900 flex flex-wrap"
        >
          {props.article.title}
        </a>
        <div className="mt-1 flex w-full justify-between items-center gap-x-2 text-xs leading-5 text-gray-500">
          <div className={"flex grow gap-x-1 "  + (props.curAudio.id !== props.article.id ? "flex-row items-center" : "flex-col items-start")}>
            <p className="whitespace-nowrap">
              Added on{" "}
              <time dateTime={props.article.metadata.save_time}>
                {genTimeString(props.article.metadata.save_time)}
              </time>
            </p>
            <div className="flex justify-between w-full flex-wrap-reverse">
              <a 
                href={props.article.raw_link} 
                target="_blank" 
                className="truncate text-secondary4 hover:text-secondary5 font-medium flex gap-x-1 items-center"
              >
                Read More
                <ExternalLinkIcon className="h-3 w-3 inline-block" aria-hidden="true" />
              </a>
              <div className='flex'>
                <p
                  className={classNames(
                    statuses["Unread"],
                    'rounded-md whitespace-nowrap mt-0.5 mr-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                  )}
                >
                  {feedNamesTable[props.article.feed_id]}
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
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  articlesChanged: summary.articlesChanged,
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleFlag
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleView)
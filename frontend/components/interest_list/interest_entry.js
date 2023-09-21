import { PlayIcon } from '@heroicons/react/solid'
import { PlusIcon, PencilIcon, CheckIcon, XIcon, TrashIcon} from '@heroicons/react/outline'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import AddInterestPanel from "./add_interest_panel"
import {changeInterestQueryContent, deleteInterest} from "../../reducers/user/dispatchers/user.dispatcher"

import {useState, useContext, useEffect, useRef} from "react";
import { FeedCounterContext } from '../feed_counter';
import { Check } from 'heroicons-react';
import {Oval} from 'react-loading-icons'
import useAutosizeTextArea from "../use_resizeable"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const InterestEntry = (props) => {
  useEffect(() => {
    setLink("/feed/"+props.feed.unique_name)
    setNewText(props.feed.query_content)
    setOrigText(props.feed.query_content)
  }, [props.feed.unique_name, props.feedsChanged])

  const [link, setLink] = useState()

  const [editMode, setEditMode] = useState(false)
  const [origText, setOrigText] = useState(props.feed.query_content)
  const [newText, setNewText] = useState(props.feed.query_content)

  const textAreaRef = useRef(null);
  useAutosizeTextArea(textAreaRef.current, newText);

  return (
    <li key={props.feed.id} className="col-span-1 flex flex-col rounded-md shadow-sm rounded-md border border-gray-200 bg-white min-w-[225px]">
      <div className="flex-1 px-4 py-2 text-sm flex justify-between items-center border-b border-gray-200">
        
        {props.feed?.isNewInterest && props.unread === "0" ? (
          <div className="flex items-center">
            <p className="text-gray-500">Generating articles</p>
            <Oval className="w-3.5 h-3.5 ml-2" stroke={"#7993A0"} fill={"#7993A0"} strokeWidth={5}/>
          </div>
        ) : (
          <p className="text-gray-500">{props.unread} Unread</p>
        )}
        {!(props.feed?.isNewInterest && props.unread === "0") && (
          <a 
            href={link} 
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlayIcon className="h-6 w-6" aria-hidden="true" />
          </a>
        )}
      </div>
      <div className="relative">
        <textarea
          rows={1}
          name="comment"
          id="comment"
          disabled={!editMode}
          className="block w-full resize-none border-0 bg-transparent px-6 py-8 text-primary7 disabled:text-primary7 text-center placeholder:text-gray-400 focus:ring-0 sm:text-2xl font-semibold sm:leading-6"
          placeholder="Describe an interest you want to hear about..."
          ref={textAreaRef}
          value={newText}
          onChange={(event) => setNewText(event.target.value)}
        />
        {!editMode ? (
          <div className="absolute right-2 bottom-1.5 flex mt-1">
            {props.feed.author_id === props.user._id && (
              <button className="mr-2" onClick={() => setEditMode(true)}>
                <PencilIcon
                  className="h-4 w-4 text-gray-400 hover:text-primary5"
                  aria-hidden="true"
                />
              </button>
            )}
            <button onClick={() => props.deleteInterest(props.feed.id)}>
              <TrashIcon
                className="h-4 w-4 text-gray-400 hover:text-primary5"
                aria-hidden="true"
              />
            </button>
          </div>
        ) : (
          <div className="absolute right-2 bottom-1.5 flex mt-1">
            <button>
              <XIcon
                className="h-5 w-5 text-gray-400 hover:text-primary5"
                aria-hidden="true"
                onClick={() => {
                  setEditMode(false)
                  setNewText(origText)
                }}
              />
            </button>
            <button className="mr-2">
              <CheckIcon
                className="h-6 w-6 text-gray-400 hover:text-primary5"
                aria-hidden="true"
                onClick={() => {
                  props.changeInterestQueryContent(props.feed.id, newText).then(() => {
                    setEditMode(false)
                    setOrigText(newText)
                  })
                }}
              />
            </button>
          </div>
        )}
      </div>
    </li>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  feeds: user.user?.feeds ? user.user.feeds : [],
  feedsChanged: user.feedsChanged,
  articles: summary.articles,
  user: user.user

})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeInterestQueryContent,
  deleteInterest
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterestEntry)

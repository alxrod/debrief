import { PlayIcon  } from '@heroicons/react/solid'
import { MailIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import AddFeedPanel from "../add_feed_panel"

import {useState, useContext} from "react";
import { FeedCounterContext } from '../feed_counter';

import { deleteFeed } from '../../reducers/user/dispatchers/user.dispatcher';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const FeedGrid = (props) => {

  const [addPanelOpen, setAddPanelOpen] = useState(false)
  const feedCountTable = useContext(FeedCounterContext)

  return (
    <div>
      <AddFeedPanel open={addPanelOpen} setOpen={setAddPanelOpen}/>

      <h2 className="text-sm font-medium text-gray-500">Your Feeds</h2>
      <ul role="list" className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {props.user?.feeds.filter(feed => feed.name !== 'interest').map((feed) => (
          <li key={feed.id} className="col-span-1 flex rounded-md shadow-sm">
            <div
              className={classNames(
                "bg-primary5",
                'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
              )}
            >
              <MailIcon className="h-6 w-6"/>
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white min-w-[225px]">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <a href={"/feed/"+feed.name} className="font-medium text-gray-900 hover:text-gray-600">
                  {feed.name}
                </a>
                <p className="text-gray-500">{feedCountTable[feed.name] ? feedCountTable[feed.name].toString() : "0"} Unread</p>
              </div>
              <div className="flex-shrink-0 pr-2">
                <div
                  className="inline-flex items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className="flex gap-x-3 mt-1">
                    <a href={"/feed/"+feed.name}>
                      <PlayIcon className="h-6 w-6" aria-hidden="true" />
                    </a>
                    {feed.name !== "inbox" && (
                      <button onClick={() => props.deleteFeed(feed.id)}>
                        <TrashIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}


        <li key={"add"} className="col-span-1 flex rounded-md shadow-sm">
          <button 
            onClick={() => setAddPanelOpen(true)}
            className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white min-w-[225px]"
          >
            <div className="flex-1 truncate px-4 py-2 text-sm flex items-center justify-center">
              <PlusIcon className="h-4 w-4 text-gray-400 mr-2"/>
              <p className="font-medium text-gray-900 hover:text-gray-600">
                Add New Feed
              </p>
              {/* <p className="text-gray-500">Add feeds to receive more content</p> */}
            </div>
          </button>
        </li>


      </ul>
    </div>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  deleteFeed
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedGrid)

import { PlayIcon } from '@heroicons/react/solid'
import { PlusIcon, PencilIcon } from '@heroicons/react/outline'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import AddInterestPanel from "./add_interest_panel"
import InterestEntry from "./interest_entry"

import {useState, useContext, useEffect, useMemo, Fragment} from "react";
import { FeedCounterContext } from '../feed_counter';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const InterestList = (props) => {

  const [addPanelOpen, setAddPanelOpen] = useState(false)
  const feedCountTable = useContext(FeedCounterContext)

  const interests = useMemo(() => {
    return props.user?.feeds.filter(feed => feed.name === 'interest')
  }, [props.feedsChanged])


  return (
    <div>
      <AddInterestPanel open={addPanelOpen} setOpen={setAddPanelOpen}/>

      <h2 className="text-sm font-medium text-gray-500">Your Interests</h2>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6" refresh-attr={props.feedsChanged.toString()}>
        {interests.map((feed) => (
          <Fragment key={feed.id}>
            <InterestEntry feed={feed} unread={feedCountTable[feed.query_content] ? feedCountTable[feed.query_content].toString() : "0"} refresh-attr={props.feedsChanged.toString()}/>
          </Fragment>
        ))}

        <li key={"add"} className="col-span-1 flex rounded-md shadow-sm">
          <button 
            onClick={() => setAddPanelOpen(true)}
            className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white min-w-[225px]"
          >
            <div className="flex-1 truncate px-4 py-2 text-sm flex items-center justify-center">
              <PlusIcon className="h-4 w-4 text-gray-400 mr-2"/>
              <p className="font-medium text-gray-900 hover:text-gray-600">
                Add New Interest
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
  feedsChanged: user.feedsChanged
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InterestList)

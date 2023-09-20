import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/outline'

import { toggleFlag} from '../../reducers/summary/dispatchers/summary.edit.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import AudioPlayer from './audio_player';
import WindowMonitor from './window_monitor';
import { getFeed } from '../../reducers/summary/dispatchers/summary.get.dispatcher';
import SummaryContent from './summary_content';
import PlayMenu from './play_menu';
import PlayerStatTracker from './player_stat_tracker';

const SummaryFeed = (props) => {
  const onAudioEnd = (article) => {
    markRead(article.id, article.metadata_id, true)
  }
  const onAudioStart = (article) => {
    // markRead(article.id, article.metadata._id, false)
  }

  const markRead = (website_id, metadata_id, read) => {
    props.toggleFlag(website_id, {_id: metadata_id, read: read})
  }

  useEffect(() => {
    if (props.feedName !== "" && feedExists === false) {
      for(let i = 0; i < props.user?.feeds.length; i++) {
        if (props.user.feeds[i].name.toLowerCase() === props.feedName || props.user.feeds[i]?.unique_name === props.feedName) {
          loadNewFeed(props.user.feeds[i].id, props.user.feeds[i].name, props.pageLimit)
          setFeedExists(true)
          break
        }
      }
    }

  }, [props.user, props.feedName])


  const loadNewFeed = (id, name) => {
    props.getFeed(id, name)
  }

  const [feedExists, setFeedExists] = useState(false)

  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full">
        {feedExists ? (
        <WindowMonitor>
          <PlayerStatTracker>
            <AudioPlayer 
              articles={props.articles}
              onAudioEnd={onAudioEnd}
              onAudioStart={onAudioStart}
            >
              <PlayMenu/>
              <SummaryContent />
            </AudioPlayer>
          </PlayerStatTracker>
        </WindowMonitor>
        ) : (
          <h1 className="text-red-800">We're sorry, either you have not added this feed or it does not exist</h1>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  articles: summary.articles,
  articlesChanged: summary.articlesChanged,
  user: user.user,
  curFeedId: summary.curFeed.id,
  pageLimit: summary.pageLimit,

  queryIndex: summary.queryIndex,
  querySize: summary.querySize,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleFlag,
  getFeed,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryFeed)


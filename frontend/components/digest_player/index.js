import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { MailIcon, PhoneIcon } from '@heroicons/react/outline'

import { toggleFlag, removeArticle } from '../../reducers/summary/dispatchers/summary.edit.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

// import SummaryEntry from './summary_entry'
// import FeedHeader from './feed_header'
// import EntryPagination from './entry_pagination';
import AudioPlayer from '../summary_feed/audio_player';
import WindowMonitor from '../summary_feed/window_monitor';

import MainView from './main_view';
import PlayMenu from './play_menu';
import { getDigest } from '../../reducers/summary/dispatchers/summary.get.dispatcher';
import PlayerStatTracker from '../summary_feed/player_stat_tracker';
// import { sortArticles } from '../../reducers/summary/summary.helpers';

const DigestPlayer = (props) => {
  const onAudioEnd = (article) => {
    markRead(article.id, article.metadata_id, true)
    props.removeArticle(article.id)
  }
  const onAudioStart = (article) => {
    // markRead(article.id, article.metadata._id, false)
  }

  const markRead = (website_id, metadata_id, read) => {
    props.toggleFlag(website_id, {_id: metadata_id, read: read})
  }

  useEffect(() => {
    if (props.articles.length == 0 && props.user) {
      loadDigest()
    }

  }, [props.user, props.feedName])
  


  const loadDigest = (id, name) => {
    console.log("ID: ", id, " NAME: ", name)
    props.getDigest().then((arts) => {
      console.log("Compelte w ", arts)
    })
  }
  return (
    <WindowMonitor>
      <PlayerStatTracker>
        <AudioPlayer 
          articles={props.articles}
          onAudioEnd={onAudioEnd}
          onAudioStart={onAudioStart}
        >
          <div className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
            {/* <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">Test</h3>
                  <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Test
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">title</p>
                
                    
                  
              </div>
            </div> */}
            <MainView/>
            <div>
              <PlayMenu/>
            </div>
          </div>
        </AudioPlayer>
      </PlayerStatTracker>
    </WindowMonitor>
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
  getDigest,
  removeArticle,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DigestPlayer)
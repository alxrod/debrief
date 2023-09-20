import { Fragment, useState, useEffect, useContext } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { MailIcon, PhoneIcon } from '@heroicons/react/outline'

import { toggleFlag, removeArticle} from '../../reducers/summary/dispatchers/summary.edit.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

// import SummaryEntry from './summary_entry'
// import FeedHeader from './feed_header'
// import EntryPagination from './entry_pagination';
import AudioPlayer from '../summary_feed/audio_player';
import WindowMonitor from '../summary_feed/window_monitor';

import MainView from './main_view';
import PlayMenu from './play_menu';
import { getDigest, updateFeed } from '../../reducers/summary/dispatchers/summary.get.dispatcher';
import PlayerStatTracker from '../summary_feed/player_stat_tracker';
// import { sortArticles } from '../../reducers/summary/summary.helpers';
import {FeedUpdaterContext} from '../summary_feed/feed_updater';

import { Slider } from "@material-tailwind/react";


const DigestPlayer = (props) => {
  const setFeedIds = useContext(FeedUpdaterContext);

  const onAudioEnd = (article) => {
    markRead(article.id, article.metadata_id, true)
    // props.removeArticle(article.id)
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

  useEffect(() => {
    setFeedIds(props.user.feeds.map((feed) => feed.id))
  }, [props.feedsChanged])
  


  const loadDigest = (id, name) => {
    props.getDigest().then((arts) => {
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
  feedsChanged: user.feedsChanged,
  user: user.user,
  curFeedId: summary.curFeed.id,
  pageLimit: summary.pageLimit,

  queryIndex: summary.queryIndex,
  querySize: summary.querySize,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleFlag,
  getDigest,
  updateFeed,
  updateFeed,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DigestPlayer)
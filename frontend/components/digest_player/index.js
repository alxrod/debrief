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
import { getDigest, updateFeed, clearArticles} from '../../reducers/summary/dispatchers/summary.get.dispatcher';
import PlayerStatTracker from '../summary_feed/player_stat_tracker';
// import { sortArticles } from '../../reducers/summary/summary.helpers';
import {FeedUpdaterContext} from '../summary_feed/feed_updater';

const DigestPlayer = (props) => {
  const setFeedIds = useContext(FeedUpdaterContext);
  const [digestArticles, setDigestArticles] = useState([])
  const [digestPointer, setDigestPointer] = useState(0)
  const [digestCountTable, setDigestCountTable] = useState({})

  const [digestSize, setDigestSize] = useState(10)
  const [generating, setGenerating] = useState(true)
  const [waitingForNext, setWaitingForNext] = useState(false)

  const [autostart, setAutostart] = useState(false)

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
    if (props.user) {
      if (props.feed?.name !== "digest") {
        props.clearArticles().then(
          loadDigest()
        )
      }
    }
  }, [props.user, props.feed?.name])

  useEffect(() => {
    setFeedIds(props.user.feeds.map((feed) => feed.id))
  }, [props.feedsChanged])
  

  const nextDigest = () => {
    const newPointer = digestPointer + digestSize
    if (newPointer < props.articles.length) {
      const arts = props.articles.slice(newPointer, Math.min(props.articles.length, newPointer + digestSize))
      fillTable(arts)
      setDigestPointer(newPointer)
      setDigestArticles(arts)
      setWaitingForNext(false)
      setAutostart(true)
    }
  }

  const loadDigest = (id, name) => {
    props.getDigest().then((arts) => {
      arts = arts.slice(digestPointer, Math.min(arts.length, digestPointer + digestSize))
      setDigestArticles(arts)
      fillTable(arts)
      setGenerating(false)
      setDigestSize(Math.min(digestSize, arts.length))
    })
  }

  const fillTable = (arts) => {
    let countTable = {}
    for (let i = 0; i < arts.length; i++) {
      const article = arts[i]
      if (countTable[article.feed_id] && !article.metadata.read) {
        countTable[article.feed_id] += 1
      } else if (!article.metadata.read) {
        countTable[article.feed_id] = 1
      }
    }
    let finalTable = {}
    for (let i = 0; i < props.user.feeds.length; i++) {
      const feed = props.user.feeds[i]
      if (countTable[feed.id]) {
        if (feed?.query_content) {
          finalTable[feed.query_content] = countTable[feed.id]
        } else {
          finalTable[feed.name] = countTable[feed.id]
        }
      }
    }
    setDigestCountTable(finalTable)
  }

  useEffect(() => {
    if (digestPointer < props.articles.length) {
      let size = digestSize
      if (size == 0) {
        size = props.articles.length/2
        setDigestSize(size)
      }
      const arts = props.articles.slice(digestPointer, Math.min(props.articles.length, digestPointer + size))
      fillTable(arts)
      setDigestArticles(arts)
    } else if (props.articles.length === 0) {
      console.log("ZERO case")
      setDigestArticles([])
      setDigestPointer(0)
      setDigestCountTable({})
      
    }
  }, [digestSize, props.articlesChanged, props.feedsChanged])

  return (
    <WindowMonitor>
      <PlayerStatTracker>
        <AudioPlayer 
          articles={digestArticles}
          onAudioEnd={onAudioEnd}
          onAudioStart={onAudioStart}
        >
          <div className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
            <MainView digestCountTable={digestCountTable} moreLeft={digestPointer + digestSize < props.articles.length} />
            <div>
              <PlayMenu 
                nextDigest={nextDigest}
                digestSize={digestSize}
                moreLeft={digestPointer + digestSize < props.articles.length}
                maxSize={props.articles.length}
                generating={generating}
                setDigestSize={setDigestSize}

                waitingForNext={waitingForNext}
                setWaitingForNext={setWaitingForNext}

                autostart={autostart}
                setAutostart={setAutostart}
              />
            </div>
          </div>
        </AudioPlayer>
        {/* <DigestSlider/> */}
      </PlayerStatTracker>
    </WindowMonitor>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  articles: summary.articles,
  articlesChanged: summary.articlesChanged,
  feedsChanged: user.feedsChanged,
  user: user.user,
  feed: summary.curFeed,
  curFeedId: summary.curFeed.id,
  pageLimit: summary.pageLimit,

  queryIndex: summary.queryIndex,
  querySize: summary.querySize,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleFlag,
  getDigest,
  updateFeed,
  clearArticles,
  updateFeed,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DigestPlayer)
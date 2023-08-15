import { Fragment, useState, useEffect, useContext, createContext } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/outline'

import { toggleFlag } from '../../reducers/summary/dispatchers/summary.edit.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import ArticleLinkedList, {ArticleNode} from './article_linked_list';

import {WindowMonitorContext} from "./window_monitor";

export const AudioPlayerContext = createContext()

const AudioPlayer = (props) => {
  
  // STATE
  
  const windowIsActive = useContext(WindowMonitorContext);
  const [readArticleCache, setReadArticleCache] = useState([])

  const emptyArticle = {
    id: "",
    upload_path: "",
  }

  const onAudioEnd = (article) => {
    // if (windowIsActive) {
      props.onAudioEnd(article)
    // } else {
    //   setReadArticleCache([...readArticleCache, article])
    // }

    if (article.next === null) {
      setPlaying(false)
      setCurrent(new ArticleNode(emptyArticle))
      queue.empty()
      console.log("QUEUE IS EMPTY: ", queue.isEmpty())
      setQueue(queue)
    } else {
      setCurrent(article.next)
      setQueue(queue)
    }
  }
  
  const onAudioStart = (article) => {
    props.onAudioStart(findArticle(article.id))
  }

  const [queue, setQueue] = useState(new ArticleLinkedList(
    onAudioEnd
  ))

  const [current, setCurrent] = useState(new ArticleNode(emptyArticle))
  const [playing, setPlaying] = useState(false)

  const findArticle = (id) => {
    const art = props.articles.find((article) => {
      return article._id === id
    })
    return art
  }

  // PLAY FUNCTIONS
  const play = (provided) => {
    if (provided !== undefined) {
      const cur = queue.insertAt(provided, 0);
      onAudioStart(cur)
      cur.play()
      setCurrent(cur)
      setQueue(queue)
    } else if (current.id === "") {
      queue.head.play()
      onAudioStart(queue.head)
      setCurrent(queue.head)
      setQueue(queue)
    } else {
      current.play()
    }
    setPlaying(true)
  }

  const pause = () => {
    if (current.cur !== "") {
      current.pause();
      setPlaying(false)
    }
  }

  const resume = () => {
    if (current.id !== "") {
      current.resume();
      setPlaying(true)
    }
  }

  const restart = () => {
    if (current.id !== "") {
      current.reset()
      setCurrent(current)
      setPlaying(true)
    }
  }

  const skipForward = () => {
    current.pause()
    onAudioEnd(current)
    if (current.next != null) {
      current.next.reset()
      setPlaying(true)
      setCurrent(current.next)
    } else {
      setPlaying(false)
      setCurrent(new ArticleNode(emptyArticle))
    }
    
  }

  const skipBackward = () => {
    pause()
    if (current.prev !== null) {
      current.prev.reset()
      props.onAudioStart(current.prev)
      setCurrent(current.prev)
      setPlaying(true)
    } else {
      restart()
    }
  }

  // QUEUE RELATED FUNCTIONS
  const playSingle = (article) => {
    queue.empty()
    play(article)
  }

  const playFromStart = () => {
    for (let i = 0; i < props.articles.length; i++) {
      const art = props.articles[i]
      if (art.metadata.read === false) {
        queue.add(art, 0);
      }
    }
    queue.printList()
    if (queue.head !== null) {
      play()
    }
  }

  const clearQueue = () => {
    current.pause()
    setPlaying(false)
    setCurrent(new ArticleNode(emptyArticle))
    queue.empty()
    setQueue(queue)
  }
  useEffect(() => {
    if (playing && windowIsActive) {
      queue.haltPrior(current)
      setQueue(queue)
    }

    // When refocusing, clear cache of any articles that didn't get marked read when device was off
    // Addresses issues of tokens timing off while phone is off
    // console.log("Clearing old articles in cache")
    // if (windowIsActive) {
    //   for (let i = 0; i < readArticleCache.length; i++) {
    //     console.log("Clearing ", readArticleCache[i].id)
    //     const art = readArticleCache[i]
    //     props.onAudioEnd(art)
    //   }
    //   setReadArticleCache([])
    // }
  }, [windowIsActive])

  return (
    <AudioPlayerContext.Provider value={{
      queueEmpty: queue.size === 0,
      unreadCount: props.articles.filter((article) => {return article.metadata.read === false}).length,
      restart,
      skipBackward,
      skipForward,
      pause,
      resume,
      playFromStart,
      playSingle,
      articles: props.articles,
      articlesChanged: props.articlesChanged,
      playing, 
      current,
      clearQueue,
    }}>
      {props.children}
    </AudioPlayerContext.Provider>
  )
}

const mapStateToProps = ({ user, summary}) => ({
  articlesChanged: summary.articlesChanged,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioPlayer)
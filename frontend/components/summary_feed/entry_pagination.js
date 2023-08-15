import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid'
import { useState, useMemo, useEffect } from 'react'
import SummaryEntry from './summary_entry'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import { getFeed, changePage } from '../../reducers/summary/dispatchers/summary.get.dispatcher';
import { sortArticles } from '../../reducers/summary/summary.helpers';

function EntryPagination(props) {


  const curArticles = useMemo(() => {
    const start = (props.curPage - 1) * props.pageLimit
    const end = Math.min(start + props.pageLimit, props.articles.length)
    return props.articles.slice(start, end)
  }, [props.curPage, props.articles.length, props.articlesChanged])

  const totalPages = useMemo(() => {
    return Math.ceil(props.articles.length / props.pageLimit)
  }, [props.articles])

  const nextPage = () => {
    props.changePage(props.curPage + 1)
  }

  const prevPage = () => {
    props.changePage(props.curPage - 1)
  }

  const setCurPage = (page) => {
    props.changePage(page)
  }

  return (
    <div refresh-attr={props.articlesChanged.toString()}>
      <ul role="list" className="divide-y divide-gray-100">
        {curArticles.map((article) => (
          <li key={article.id} className="flex items-start justify-between gap-x-6 py-5">
            <SummaryEntry 
              article={article} 
              key={article.id} 
              playSingleAudio={props.playSingleAudio} 
              pauseAudio={props.pauseAudio} 
              resumeAudio={props.resumeAudio}
              curAudioPlaying={props.curAudioPlaying} 
              curAudio={props.curAudio}
            />
          </li>
        ))}
      </ul>
      <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
        <div className="-mt-px flex w-0 flex-1">
          <button
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            onClick={() => prevPage()}
            disabled={props.curPage == 1}
          >
            <ArrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            Previous
          </button>
        </div>
        <div className="hidden md:-mt-px md:flex">
          {props.curPage > 2 && (
            <>
              <button
                href="#"
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setCurPage(1)}
              >
                1
              </button>
              {props.curPage > 3 && (
                <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                  ...
                </span>
              )}
            </>
          )}
          {props.curPage > 1 && (
            <button
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setCurPage(props.curPage-1)}
            >
              {props.curPage-1}
             
            </button>
          )}
          {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
          <button
            className="inline-flex items-center border-t-2 border-primary5 px-4 pt-4 text-sm font-medium text-primary6"
            aria-current="page"
            disabled
          >
            {props.curPage}
          </button>
          {props.curPage < totalPages && (
            <button
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setCurPage(props.curPage+1)}
            >
              {props.curPage+1}
            </button>
          )}
          {props.curPage < (totalPages - 1) && (
            <>
              {props.curPage < totalPages - 2 && (
                <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                  ...
                </span>
              )}
              <button
                href="#"
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setCurPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        <div className="-mt-px flex w-0 flex-1 justify-end">
          <button
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            onClick={() => nextPage()}
            disabled={props.curPage == totalPages}
          >
            Next
            <ArrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </div>
  )
}


const mapStateToProps = ({summary}) => ({
  totalArticles: summary.totalArticles,
  pageLimit: summary.pageLimit,
  curPage: summary.curPage,
  curFeed: summary.curFeed,

  articlesChanged: summary.articlesChanged,
  queryIndex: summary.queryIndex,
  querySize: summary.querySize,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getFeed, 
  changePage,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryPagination)
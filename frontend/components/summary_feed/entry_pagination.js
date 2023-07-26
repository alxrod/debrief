import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid'
import { useState, useMemo } from 'react'
import SummaryEntry from './summary_entry'

export default function EntryPagination(props) {
  const [curPage, setCurPage] = useState(1)

  const [totalPages, setTotalPages] = useState(Math.ceil(props.articles.length / 20))

  const curArticles = useMemo(() => {
    const start = (curPage - 1) * 20
    const end = Math.min(start + 20, props.articles.length)
    return props.articles.slice(start, end)
  }, [curPage, props.articles])

  return (
    <div>
      {curArticles.map((article) => (
        <SummaryEntry 
        article={article} 
        key={article.id} 
        playSingleAudio={props.playSingleAudio} 
        pauseAudio={props.pauseAudio} 
        resumeAudio={props.resumeAudio}
        curAudioPlaying={props.curAudioPlaying} 
        curAudio={props.curAudio}
        />
      ))}
      <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
        <div className="-mt-px flex w-0 flex-1">
          <button
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            onClick={() => setCurPage(curPage - 1)}
            disabled={curPage == 1}
          >
            <ArrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            Previous
          </button>
        </div>
        <div className="hidden md:-mt-px md:flex">
          {curPage > 2 && (
            <>
              <button
                href="#"
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                onClick={() => setCurPage(1)}
              >
                1
              </button>
              {curPage > 3 && (
                <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                  ...
                </span>
              )}
            </>
          )}
          {curPage > 1 && (
            <button
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              {curPage-1}
            </button>
          )}
          {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
          <button
            className="inline-flex items-center border-t-2 border-primary5 px-4 pt-4 text-sm font-medium text-primary6"
            aria-current="page"
          >
            {curPage}
          </button>
          {curPage < totalPages && (
            <button
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              {curPage+1}
            </button>
          )}
          {curPage < (totalPages - 1) && (
            <>
              {curPage < totalPages - 2 && (
                <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                  ...
                </span>
              )}
              <button
                href="#"
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        <div className="-mt-px flex w-0 flex-1 justify-end">
          <button
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            onClick={() => setCurPage(curPage + 1)}
            disabled={curPage == totalPages}
          >
            Next
            <ArrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </div>
  )
}

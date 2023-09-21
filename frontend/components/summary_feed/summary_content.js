

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { useContext } from "react";
import SummaryEntry from './summary_entry'
import EntryPagination from './entry_pagination';
import {AudioPlayerContext} from './audio_player';

function SummaryContent(props) {

  const {
    queueEmpty,
    unreadCount,
    restart,
    skipBackward,
    skipForward,
    playFromStart,
    articles,
    articlesChanged,
    playSingle, 
    pause, 
    resume,
    playing, 
    current
  } = useContext(AudioPlayerContext);

  return (
    <div className="min-w-md max-w-md">
        {articles.length > 0 ? (
          <EntryPagination 
            articles={articles}
            articlesChanged={articlesChanged}
            playSingleAudio={playSingle} 
            pauseAudio={pause} 
            resumeAudio={resume}
            curAudioPlaying={playing} 
            curAudio={current}
            previewMode={props.previewMode}
          />
        ) : (
          <div key={"no-articles"} className="flex items-start justify-between py-5">
            <div className="min-w-0">
              <div className="flex justify-between items-center gap-x-3">
                  <p 
                    target="_blank" 
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    No articles in this feed yet
                  </p>
              </div>

              <div 
                className="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500"
                style={{
                  "overflow": "hidden",
                  "transition": "0.4s max-height",
                }}>
                Email links to debrief.later@gmail.com and we will automatically generate audio summaries or add a feed.
              </div>
            </div>
          </div>
        )}
      </div>
  )
}


const mapStateToProps = ({summary}) => ({
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SummaryContent)
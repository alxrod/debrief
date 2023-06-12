import React, {useState, useMemo, useEffect} from 'react';
import SummaryFeed from "../../components/summary_feed"
import { getWebsites } from '../../reducers/summary/dispatchers/summary.get.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

const FeedPage = (props) => {
  const [refreshWebsites, setRefreshWebsites] = useState(true)

  useEffect(() => {
    const stillGenCount = props.websites.filter(function (site) {
      return !site.summaryUploaded;
    }).length

    if (stillGenCount > 0 && refreshWebsites === false) {
      setRefreshWebsites(true)
    }
  }), [props.websites, refreshWebsites]

  useMemo(() => {
    if (props.isLoggedIn && refreshWebsites) {
      props.getWebsites().then(
        (sites) => {
          console.log(sites)
          console.log("Finished refresh")
          setTimeout(() => {
            setRefreshWebsites(false)
          }, 2000);
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }, [props.isLoggedIn, refreshWebsites])

  return (
    <div>
      <div>
        <div className="relative px-6 lg:px-8 flex justify-center">
            <div className="max-w-6xl flex flex-col-reverse items-center lg:items-start lg:flex-row pt-10 sm:pt-20 pb-32 sm:pb-40">
              <div>
                <div className="lg:mt-10">
                  <SummaryFeed
                  />
                </div>
              </div>
            </div>
        </div>
      </div>

    </div>
  )
}
const mapStateToProps = ({ user, summary}) => ({
  isLoggedIn: user.isLoggedIn,
  websites: summary.websites,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getWebsites,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedPage)
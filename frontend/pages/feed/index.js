import React, {useState, useMemo, useEffect} from 'react';
import SummaryFeed from "../../components/summary_feed"
import { getFeeds } from '../../reducers/summary/dispatchers/summary.get.dispatcher';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import ProtectedRoute from "../../components/protected";

const FeedPage = (props) => {
  useEffect(() => {
    if (props.isLoggedIn && props.user?.feeds?.length > 0) {
      let feeds = [];
      for (let feed of props.user.feeds) {
        feeds.push(feed.id)
      }
      console.log("Refreshing feeds")
      props.getFeeds(feeds)
    }
  }, [props.isLoggedIn, props.user?.feeds?.length])

  return (
    <ProtectedRoute>
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

    </ProtectedRoute>
  )
}
const mapStateToProps = ({ user, summary}) => ({
  user: user.user,
  isLoggedIn: user.isLoggedIn,
  articles: summary.articles,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getFeeds,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedPage)
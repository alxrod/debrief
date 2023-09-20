import React, {useState, useMemo, useEffect} from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import FeedGrid from "../../components/feed_grid";
import InterestList from "../../components/interest_list";

import ProtectedRoute from "../../components/protected";
import DigestPlayer from '../../components/digest_player';
import FeedCounter from '../../components/feed_counter';
import FeedUpdater from '../../components/summary_feed/feed_updater';

const HomePage = (props) => {


  return (
    <ProtectedRoute>
      <div>
        <div className="relative flex justify-center">
            <div className="max-w-6xl flex flex-col-reverse items-center lg:items-start lg:flex-row pt-10 sm:pt-20 pb-32 sm:pb-40">
              <div>
                <div className="lg:mt-10 grid grid-col-1 gap-y-10">
                  <FeedCounter>
                    <FeedUpdater>
                      <DigestPlayer />
                    </FeedUpdater>
                    <InterestList/>
                    <FeedGrid/>
                  </FeedCounter>
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
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
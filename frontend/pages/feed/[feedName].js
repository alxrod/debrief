import React, {useState, useMemo, useEffect} from 'react';
import SummaryFeed from "../../components/summary_feed"

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import ProtectedRoute from "../../components/protected";

export async function getStaticPaths() {
  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}

export async function getStaticProps({ params }) {
  return {
    props: {
      feedName: params.feedName,
    },
  };
}

const FeedPage = (props) => {
  return (
    <ProtectedRoute>
      <div>
        <div className="relative px-6 lg:px-8 flex justify-center">
            <div className="max-w-6xl flex flex-col-reverse items-center lg:items-start lg:flex-row pt-2 sm:pt-20 pb-32 sm:pb-40">
              <div>
                <div className="lg:mt-10">
                  <SummaryFeed feedName={props.feedName}/>
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
)(FeedPage)
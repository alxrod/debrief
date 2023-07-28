import React, { useEffect } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import { pullUser } from "../../reducers/user/dispatchers/user.dispatcher";

const AppWrapper = (props) => {
  
  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("creds")) ? true : false
    if (loggedIn && props.user === null) {
      props.pullUser().catch(() => {
        localStorage.removeItem("creds")
      })
    }
  },[])
  
  return (
    <>
      {props.children}
    </>
  )
}

const mapStateToProps = ({ user }) => ({
  isLoggedIn: user.isLoggedIn,
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  pullUser,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWrapper)

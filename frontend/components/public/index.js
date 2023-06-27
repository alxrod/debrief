import React, {useState, useEffect } from 'react'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { useRouter } from 'next/router';

const PublicRoute = (props) => {
  
  const router = useRouter()
  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("creds")) ? true : false
    if (loggedIn) {
      router.push("/feed")
    }
  },[])

  return (
    <>{props.children}</>
  )
}

const mapStateToProps = ({ user }) => ({
  user: user.user,
  isLoggedIn: user.isLoggedIn,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicRoute)
import React, {useState, useEffect } from 'react'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { useRouter } from 'next/router';
import { pullUser } from '../../reducers/user/dispatchers/user.dispatcher';

const ProtectedRoute = (props) => {
  const router = useRouter()
  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem("creds")) ? true : false
    if (!loggedIn) {
      router.push("/login")
    }
  },[])

  useEffect(() => {
    if (!props.isLoggedIn && props.anonymousUser) {
      router.push("/")
    }
  }, [props.isLoggedIn, props.anonymousUser])

  return (
    <>
      {props.user !== null && (
        <>{props.children}</>
      )}
    </>
  )
}

const mapStateToProps = ({ user }) => ({
  user: user.user,
  isLoggedIn: user.isLoggedIn,
  anonymousUser: user.anonymousUser
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  pullUser
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedRoute)
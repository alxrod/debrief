import React, {useState, useEffect } from 'react'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { useRouter } from 'next/router';
import { pullUser } from '../../reducers/user/dispatchers/user.dispatcher';

const ProtectedRoute = (props) => {
  
  const router = useRouter()
  useEffect(() => {
    if (!props.isLoggedIn) {
      router.push("/login")
    }
  },[props.user, props.isLoggedIn])

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
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  pullUser
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedRoute)
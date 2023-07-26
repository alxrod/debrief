import React, {useState, useEffect } from 'react'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { useRouter } from 'next/router';
import { pullUser } from '../../reducers/user/dispatchers/user.dispatcher';

const ProtectedRoute = (props) => {
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
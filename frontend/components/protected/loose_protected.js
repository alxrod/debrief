import React, {useState, useEffect } from 'react'

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { useRouter } from 'next/router';
import { pullUser } from '../../reducers/user/dispatchers/user.dispatcher';

const LooseProtectedRoute = (props) => {
  return (
    <>
      {( (props.user === null && !props.gettingUser) || props.user !== null) && (
        <>{props.children}</>
      )}
    </>
  )
}

const mapStateToProps = ({ user }) => ({
  gettingUser: user.gettingUser,
  user: user.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  pullUser
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LooseProtectedRoute)
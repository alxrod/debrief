import React from "react";

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import Link from 'next/link'
import LoginCard from "../../components/auth/login_card";
import PublicRoute from "../../components/public";

const Login = (props) => {

  return (
    <PublicRoute>
      <div className="min-h-full flex flex-col justify-start sm:justify-center py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-primary5 hover:text-primary4">
              Sign Up!
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginCard redirectLink={"/feed"}/>
          </div>
        </div>
      </div>
    </PublicRoute>
  )
}

const mapStateToProps = ({ user }) => ({
    isLoggedIn: user.isLoggedIn,
    message: user.message,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)

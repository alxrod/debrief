import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { confirmResetId, changePassword } from "../../reducers/user/dispatchers/user.dispatcher";

import { useRouter } from "next/router"

export async function getStaticPaths() {
  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}
export async function getStaticProps({ params }) {
  return {
    props: {
      resetId: params.resetId,
    },
  };
}

const ResetPassword = (props) => {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  
  const onNewPasswordChange = (e) => {
    setNewPassword(e.target.value)
  }
  
  const handleReset = (e) => {
      e.preventDefault()
      if (newPassword.length >= 5) {
        props.confirmResetId(props.resetId).then(
          (valid) => {
            if (valid) {
              props.changePassword(props.resetId, newPassword).then(
                () => {
                  router.push("/feed")
                },
                (error) => {
                  setErrorMsg(error)
                }
              )
            } else {
              console.log("VALID IS ", valid)
              setErrorMsg("The reset link you are using is invalid")
            }
          },
          () => {
            setErrorMsg("The reset link you are using is invalid")
          }
        )
      } else {
        setErrorMsg("please provide a 5 character or more password")
      }
  }
  
  if (props.isLoggedIn) {
    router.push("/feed")
  }
  return (
      <>
        <div className="min-h-full flex flex-col items-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Just enter your new password
            </p>
          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div>

                  {errorMsg !== "" ? (
                    <p className="text-center mb-2 text-red-400 text-xs">{errorMsg}</p>
                  ) : (
                    <div className="h-4 mb-2"></div>
                  )}
                  
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="text"
                      placeholder="new password"
                      autoComplete="password"
                      value={newPassword}
                      onChange={onNewPasswordChange}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary4 focus:border-primary4 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="h-8"></div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    onClick={handleReset}
                    className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary5 hover:bg-primary6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary4"
                  >
                    Change Password
                  </button>
                </div>
  
            </div>
          </div>
        </div>
      </>
    )
}

const mapStateToProps = ({ user }) => ({
    isLoggedIn: user.isLoggedIn,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  confirmResetId,
  changePassword,
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPassword)

import React, {useState} from "react";

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { register } from "../../reducers/user/dispatchers/user.dispatcher";

import RegisterCard from "../../components/auth/register_card";
import { useRouter } from 'next/router'

const Register = (props) => {
  const router = useRouter()

  const [serverError, setServerError] = useState("")

  const onSubmit = (values) => {
    props.register(values.email, values.password).then( () => {
        router.push("/feed")
    }, err => {
        setServerError(err)
    })
  }

  return (
      <>
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Aboard!</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              or <a className="text-primary4 font-semibold" href="#" onClick={() => router.push("/login")}>log in here</a>
            </p>


          </div>
  
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <RegisterCard onSubmit={onSubmit} serverError={serverError}/>
            </div>
            
          </div>
        </div>
      </>
  )
}

const mapStateToProps = ({ user }) => ({
    user: user.user,
    redirectLink: user.redirectLink
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  register,

}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register)

import React, {useState} from "react";

import { connect } from "react-redux";
import { bindActionCreators } from 'redux'
import { register, pullUser } from "../../reducers/user/dispatchers/user.dispatcher";

import RegisterCard from "../../components/auth/register_card";
import { useRouter } from 'next/router'
import PublicRoute from "../../components/public";
const Register = (props) => {
  const router = useRouter()

  const [serverError, setServerError] = useState("")

  const onSubmit = (values) => {
    props.register(values.email, values.password).then( () => {
      props.pullUser().then(() => {
        router.push("/home")
      })
    }, err => {
        setServerError(err)
    })
  }

  return (
      <PublicRoute>
        <div className="flex flex-col justify-start sm:justify-center py-8 sm:py-12 sm:px-6 sm:px-6 lg:px-8">
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
      </PublicRoute>
  )
}

const mapStateToProps = ({ user }) => ({
    user: user.user,
    redirectLink: user.redirectLink
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  register,
  pullUser
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register)

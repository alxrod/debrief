import { Formik } from 'formik';
import * as Yup from 'yup';

const RegisterCard = (props) => {

  const inputClassNames = `appearance-none mt-1 block w-full px-3 py-2 
  border border-gray-300 rounded-md shadow-sm 
  placeholder-gray-400 focus:outline-none focus:ring-primary4 
  focus:border-primary4 sm:text-sm`
  
  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
        fullName: "",
        email: (props.defaultEmail ? props.defaultEmail : ""),
      }}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string()
          .min(5, 'Must be 5 characters or more')
          .required('Required'),
      })}
      onSubmit={props.onSubmit}
    >
      {formik => (
        <form onSubmit={formik.handleSubmit}>
          {props.serverError !== "" && <p className="text-red-400 text-sm text-center">{props.serverError}</p> }

          <div className="mb-4">
            <div className="flex flex-wrap justify-between mb-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              {formik.touched.email ? <p className="text-red-400 text-sm">{formik.errors.email}</p> : null}
            </div>
            <input
              id="email"
              name="email"
              type="email"
              disabled={props.defaultEmail !== undefined}
              {...formik.getFieldProps('email')}
              className={inputClassNames + (props.defaultEmail !== undefined ? " text-gray-400" : "")}
            />
          </div>

          
          <div className="mb-4">
            <div className="flex flex-wrap justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              {formik.touched.password ? <p className="text-red-400 text-sm">{formik.errors.password}</p> : null}
            </div>
              <input
              id="password"
              name="password"
              type="password"
              {...formik.getFieldProps('password')}
              className={inputClassNames}
            />
          </div>

          <br/>
          <button
            type="submit"
            className={"w-full flex justify-center py-2 px-4 "+
                      "border border-transparent rounded-md "+
                      "shadow-sm text-sm font-medium text-white "+
                      "bg-primary5 hover:bg-primary6 focus:outline-none "+
                      "focus:ring-2 focus:ring-offset-2 focus:ring-primary4 "+
                      "disabled:bg-primary3 " 
                      }
          >
            Create Your Account
          </button>
        </form>
      )}
    </Formik>
  )
}

export default RegisterCard
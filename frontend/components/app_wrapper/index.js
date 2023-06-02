import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { connect } from "react-redux";
import { bindActionCreators } from 'redux'

import { setUser, pullUser } from "../../reducers/user/dispatchers/user.dispatcher";

const AppWrapper = (props) => {
  const router = useRouter()

  const [pullReq, setPullReq] = useState(true);

  const STD_ROLE = 3
  const UNAUTH_ROLE = 1 
  const STD_UNAUTH_ROLE = 4

  const routes = {
    "^/$": UNAUTH_ROLE,
    "^/unknown$": STD_UNAUTH_ROLE,
  
    "^/login$": UNAUTH_ROLE,
    "^/register$": UNAUTH_ROLE,
  
    "^/forgot-password$": UNAUTH_ROLE,
    "^/reset-password$": UNAUTH_ROLE,
    
  }

  useEffect( () => {
    authRedirect(router.pathname)
  }, [router.pathname]);

  const authRedirect = (wholepath) => {
    let used_key = ""

    let user = props.user
    let creds;
    if (!user) {
      user = JSON.parse(localStorage.getItem("user"));
      creds = JSON.parse(localStorage.getItem("creds"));
      if (!user) {
        user = JSON.parse(sessionStorage.getItem("user"));
        creds = JSON.parse(sessionStorage.getItem("creds"));
      }
      
      if (user) {
        props.setUser(user, creds)
      }
    }

    for (let i = 0; i < Object.keys(routes).length; i++) {
      if (wholepath.match(Object.keys(routes)[i])) {
        used_key = Object.keys(routes)[i]
        break;
      }
    }

    if (user === null && routes[used_key] === STD_ROLE) {
      props.pullUser().then(
        () => {
          return true
        },
        () => {
          props.setRedirect(wholepath)
          router.push("/login")
          return false
        }
      )
    } else if (user !== null && routes[used_key] === UNAUTH_ROLE) {
      router.push("/")
      return false
    }
    return true
  }


  useEffect( () => {
    if (pullReq == true && props.user !== null) {
      setPullReq(false);
      props.pullUser().then(() => {
        setTimeout(() => {
          setPullReq(true)
        }, 10 * 60 * 1000)
      });
    }
  }, [pullReq, props.user, props.user?.id])

  return (
    <div className="w-full h-full flex flex-col">
      {props.children}
    </div>
  )
}

const mapStateToProps = ({ user}) => ({
    user: user.user,
    isLoggedIn: user.isLoggedIn,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  pullUser,
  setUser,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWrapper)

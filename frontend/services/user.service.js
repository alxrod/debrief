import { AuthClient } from "../debrief_proto/user_grpc_web_pb";
import { 
    UserLoginRequest,
    UserRegisterRequest,
    UserLogoutRequest,
    UserPullRequest,

    ForgotRequest,

    ResetConfirmRequest,
    ChangePasswordRequest,

 } from "../debrief_proto/user_pb";

export const authClient = new AuthClient(process.env.NEXT_PUBLIC_API_URL);

class UserService {

    // Auth Requests
    login(email, password, remember) {
        var loginRequest = new UserLoginRequest();   
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        return new Promise( (resolve, reject) => { 
            authClient.login(loginRequest, null, function(error, response) {
                if (error) {
                    reject(error.message)
                    return 
                }
                var resp = response.toObject();
                var creds = {
                    email: resp.user.email,
                    password: password,
                    user_id: resp.user.id,
                    access_token: resp.token,
                    token_timeout: response.getTokenTimeout().toDate(),
                }
                if (remember) {
                    localStorage.setItem("creds", JSON.stringify(creds));
                    localStorage.setItem("user", JSON.stringify(resp.user));
                } else {
                    sessionStorage.setItem("creds", JSON.stringify(creds));
                    sessionStorage.setItem("user", JSON.stringify(resp.user));
                }
                resolve(resp)
            });
        });
    }   


    register(email, password) {
        var registerRequest = new UserRegisterRequest();   

        registerRequest.setEmail(email);
        registerRequest.setPassword(password);
    

        return new Promise (function (resolve, reject) {
            authClient.register(registerRequest, null, function(err, response) {
                if (err) {
                    reject(err)
                    console.log("Error: ", err)

                } else {
                    var resp = response.toObject();
                    
                    var creds = {
                        email: resp.user.email,
                        password: password,
                        user_id: resp.user.id,
                        access_token: resp.token,
                        token_timeout: response.getTokenTimeout().toDate(),
                    }
                    localStorage.setItem("creds", JSON.stringify(creds));
                    localStorage.setItem("user", JSON.stringify(resp.user));
                    resolve(resp)
                }
    
                
            });
        });
    }

    logout(token) {
        var logoutRequest = new UserLogoutRequest();   
        
        var user = JSON.parse(localStorage.getItem("user"));
        if (user === null) {
            return Error("You are not currently logged in")
        }
        logoutRequest.setUsername(user.username);
        logoutRequest.setToken(token);

        localStorage.removeItem("user");
        localStorage.removeItem("creds");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("creds");
        
        authClient.logout(logoutRequest, null, function(err, response) {
            if (err) {
                return err
            }
            var resp = response.toObject();
            

        });
        return Error("Request failed")
    }

    pull_user(token, user_id) {
        var pullRequest = new UserPullRequest();   
        pullRequest.setUserId(user_id);

        return new Promise( (resolve, reject) => { 
            var metadata = {"authorization": token}
            authClient.pull(pullRequest, metadata, function(error, response) {
                if (error) {
                    reject(error)
                    return
                }
                var resp = response.toObject();

                // just using to check where to save
                let creds = JSON.parse(localStorage.getItem("creds"))
                if (creds === null) {
                    localStorage.setItem("user", JSON.stringify(resp));
                } else {
                    sessionStorage.setItem("user", JSON.stringify(resp));
                }
                
                resolve(resp)
            });
        });
    }

    forgotPassword(email) {
        var forgotRequest = new ForgotRequest();   
        forgotRequest.setEmail(email);

        return new Promise( (resolve, reject) => { 
            authClient.forgotPassword(forgotRequest, null, function(error, response) {
                if (error) {
                    reject(error)
                    return 
                }
                var resp = response.toObject();
                resolve(resp)
            });
        });
    }

    confirmResetId(reset_id) {
        var confirmRequest = new ResetConfirmRequest();   
        confirmRequest.setResetId(reset_id);

        return new Promise( (resolve, reject) => { 
            authClient.confirmResetId(confirmRequest, null, function(error, response) {
                if (error) {
                    reject(error)
                    return 
                }
                var resp = response.toObject();
                resolve(resp.validId)
            });
        });
    }

    changePassword(reset_id, new_password) {
        var changeRequest = new ChangePasswordRequest();   
        changeRequest.setResetId(reset_id);
        changeRequest.setNewPassword(new_password);

        return new Promise( (resolve, reject) => { 
            authClient.changePassword(changeRequest, null, function(error, response) {
                if (error) {
                    reject(error)
                    return 
                }
                var resp = response.toObject();
                var creds = {
                    email: resp.user.email,
                    password: new_password,
                    user_id: resp.user.id,
                    access_token: resp.token,
                    token_timeout: response.getTokenTimeout().toDate(),
                }
                localStorage.setItem("creds", JSON.stringify(creds));
                localStorage.setItem("user", JSON.stringify(resp.user));
                resolve(resp)
            });
        });
    }

    authChecker(needAuth) { 
        let remember = true
        let creds = JSON.parse(localStorage.getItem("creds"))
        if (creds === null) {
            remember = false
            creds = JSON.parse(sessionStorage.getItem("creds"))
        }
        if (needAuth && creds === null) {
            return Promise.reject({})
        } else if (needAuth && creds) {
            const d = new Date(creds.token_timeout)
            if (d <= Date.now()) {
                return new Promise((resolve, reject) => {
                    var loginRequest = new UserLoginRequest();   
                    loginRequest.setEmail(creds.email);
                    loginRequest.setPassword(creds.password);

                    authClient.login(loginRequest, null, function(error, response) {
                        if (error) {
                            resolve(creds)
                            return
                        }
                        
                        var resp = response.toObject();

                        var new_creds = {
                            email: resp.user.email,
                            password: creds.password,
                            user_id: resp.user.id,
                            access_token: resp.token,
                            token_timeout: response.getTokenTimeout().toDate(),
                        }
                        if (remember) {
                            localStorage.setItem("creds", JSON.stringify(new_creds));
                        } else {
                            sessionStorage.setItem("creds", JSON.stringify(new_creds));
                        }
                       
                        resolve(new_creds)
                    })
                })
            } else {
                return Promise.resolve(creds)
            }
        } else {
            return Promise.reject({})
        }
    }
}

export default new UserService();
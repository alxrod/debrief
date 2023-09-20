import UserService from "../../../services/user.service";
import SummaryService from "../../../services/summary.service";

import * as userActions from "../user.actions";

export const register = (email,password) => {
    return dispatch => {
        return UserService.register(email, password).then(
            (response) => {
                dispatch({
                    type: userActions.SET_USER,
                    payload: {
                        user: response.user,
                    }
                });
                return Promise.resolve();
            },
            (error) => {
                dispatch({
                    type: userActions.CLEAR_USER,
                });
                return Promise.reject(error);
            }
        );
    }
};

export const login = (email, password, remember) => {
    return dispatch => {
        return UserService.login(email, password, remember).then(
            (data) => {
                dispatch({
                    type: userActions.SET_USER,
                    payload: {
                        user: data.user,
                    },
                });
                return Promise.resolve();
            },
            (error) => {
                dispatch({
                    type: userActions.CLEAR_USER,
                });
                return Promise.reject(error);
            }
        );
    }
};

export const logout = () => {
    return dispatch => {
        return UserService.logout().then(
        dispatch({
            type: userActions.CLEAR_USER,
        }))
    }
}

export const setUser = (user) => {
    return dispatch => {
        dispatch({
            type: userActions.SET_USER,
            payload: {user: user},
        });
        return Promise.resolve();
    }
}

export const changePlaybackSpeed = (speed) => {
    return dispatch => {
        UserService.changePlaybackSpeed(speed).then(
            (data) => {
                dispatch({
                    type: userActions.CHANGE_PLAYBACK_SPEED,
                    payload: {speed: speed},
                });
                return Promise.resolve();
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        return Promise.resolve();
    }
}


export const pullUser = () => {
    return dispatch => {
        return UserService.pullUser().then(
            (data) => {
                const user = data.user;
                user.feeds = data.feeds;
                dispatch({
                    type: userActions.SET_USER,
                    payload: {user},
                });
                return Promise.resolve(user);
            },
            (error) => {
                const message = 
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.messsage ||
                    error.toString();
                dispatch({
                    type: userActions.CLEAR_USER,
                });
                return Promise.reject(message);
            }
        );
    }
};

export const changeInterestQueryContent = (feed_id, query_content) => {
    return dispatch => {
      const unique_name = query_content.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
      const updated_interest = {
        "_id": feed_id,
        "query_content": query_content,
        "unique_name": unique_name,
      }
      console.log(updated_interest)
      return SummaryService.updateInterest(updated_interest).then(() => {
        dispatch({
            type: userActions.CHANGE_INTEREST_QUERY_CONTENT,
            payload: {
                feed_id: feed_id,
                query_content: query_content,
                unique_name: unique_name,
            }
        })
        return Promise.resolve();
     })
      
    }
}

export const deleteInterest = (feed_id) => {
    return dispatch => {
        return SummaryService.deleteInterest(feed_id).then(() => {
            dispatch({
                type: userActions.DELETE_FEED,
                payload: {
                    feed_id: feed_id,
                }
            })
            return Promise.resolve();
        })
    }
}
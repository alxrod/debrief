import SummaryService from "../../../services/summary.service";

import * as summaryActions from "../summary.actions";
import * as helpers from "../../helpers"

export const getWebsites = () => {
    return dispatch => {
        return helpers.authCheck(dispatch).then(
            (creds) => {
                return SummaryService.get(creds.access_token, creds.user_id).then(
                    (sites) => {
                        dispatch({
                            type: summaryActions.LOAD,
                            payload: sites,
                        });
                        return Promise.resolve(sites);
                    },
                    (error) => {
                      const message = 
                          (error.response &&
                          error.response.data &&
                          error.response.data.message) ||
                          error.messsage ||
                          error.toString();
                      dispatch({
                          type: summaryActions.CLEAR,
                      });
                      return Promise.reject(message);
                    }
                );
            },
            () => {
                return Promise.reject("Auth check failed")
            }
        )
    }
};

export const clearWebsites = () => {
  return dispatch => {
      dispatch({
          type: summaryActions.LOAD,
          payload: sites,
      });
      return Promise.resolve(sites);
  }       
};

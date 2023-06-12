import SummaryService from "../../../services/summary.service";

import * as summaryActions from "../summary.actions";
import * as helpers from "../../helpers"

export const toggleFlag = (website_id, flag_name, flag_status) => {
    return dispatch => {
        return helpers.authCheck(dispatch).then(
          (creds) => {
            return SummaryService.toggleFlag(creds.access_token, creds.user_id, website_id, flag_name, flag_status).then(
              () => {
                dispatch({
                    type: summaryActions.TOGGLE_FLAG,
                    payload: {
                      website_id: website_id,
                      name: flag_name,
                      status: flag_status,
                    },
                });
                return Promise.resolve();
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


import SummaryService from "../../../services/summary.service";

import * as summaryActions from "../summary.actions";
import * as userActions from "../../user/user.actions";

export const createInterest = (query_content) => {
  return dispatch => {
    return SummaryService.createInterest({
      "query_content": query_content,
    }).then(
      (new_interest) => {
        console.log("new interest")
        console.log(new_interest)
        new_interest.id = new_interest._id
        new_interest.isNewInterest = true
        dispatch({
          type: userActions.ADD_FEED_TO_USER,
          payload: new_interest
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
        return Promise.reject(message);
      }
    );
  }
};

export const joinInterest = (unique_name) => {
  return dispatch => {
    return SummaryService.joinInterest(unique_name).then(
      (new_interest) => {
        new_interest.id = new_interest._id
        dispatch({
          type: userActions.ADD_FEED_TO_USER,
          payload: new_interest
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
        return Promise.reject(message);
      }
    );
  }
};


// export const addUserToFeed = (feed_id, user_id) => {
//   return dispatch => {
//     return SummaryService.addUserToFeed(feed_id, user_id).then(
//       () => {
  
//         return Promise.resolve();
//       },
//       (error) => {
//         const message = 
//             (error.response &&
//             error.response.data &&
//             error.response.data.message) ||
//             error.messsage ||
//             error.toString();
//         return Promise.reject(message);
//       }
//     );
//   }
// }
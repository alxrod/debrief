
import api from './api';
class SummaryService {

  get(email, password) {
    // return api
    // .post("/user/login", {
    //   email,
    //   password
    // })
    // .then(response => {
    //   if (response.data.access_token) {
    //     console.log(response.data)
    //     TokenService.setCreds(response.data);
    //   }
    //   return response.data;
    // });
  }
  
  pullFeed(feed_id) {
    return api
    .get(("/feed/pull/"+feed_id), {})
    .then(response => {
      return response.data;
    }).catch(error => {
      console.log("FEED PULL ERROR: " + error.data.message);
      return error.data.message;
    });
  }

  pullAllFeeds() {
    return api
    .get(("/feed/pull-all"), {})
    .then(response => {
      return response.data;
    }).catch(error => {
      console.log("FEED PULL ERROR: " + error.data.message);
      return error.data.message;
    });
  }

  addUserToFeed(feed_id, user_id) {
    const params = {
      feed_id,
      "addition_id": user_id,
      type: "user",
    }
    console.log(params)
    return api
    .post(("/feed/add"), params)
    .then(response => {
      return response.data;
    }).catch(error => {
      console.log("ERROR: " + error.data.message);
      return error.data.message;
    });
  }

  toggleFlag(metadata) {
    return api
    .post("/metadata/update", {
      id: metadata._id,
      saved: metadata.saved,
      read: metadata.read,
      archived: metadata.archived,
    })
    .then(response => {
      return response.data;
    }).catch(error => {
      console.log("METADATA UPDATE ERROR: " + error.data.message);
      return error.data.message;
    });
  }   
}

export default new SummaryService();
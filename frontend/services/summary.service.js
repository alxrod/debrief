
import api from './api';
class SummaryService {
  
  pullFeed(feed_id, skip, limit) {
    let url = "/feed/pull/"+feed_id
    if (skip >= 0 && limit >= 0) {
      url += "?" + new URLSearchParams({
        skip: skip,
        limit: limit,
      })
    }
    return api
    .get(url, {})
    .then(response => {
      return response.data;
    }).catch(error => {
      console.log("ERROR: " + error.data.message);
      return error.data.message;
    });
  }

  pullDigest() {
    return api
    .get(("/feed/digest"), {})
    .then(response => {
      return response.data;
    }).catch(error => {
      return error.data.message;
    });
  }

  pullAllFeeds() {
    return api
    .get(("/feed/pull-all"), {})
    .then(response => {
      return response.data;
    }).catch(error => {
      return error.data.message;
    });
  }

  addUserToFeed(feed_id, user_id) {
    const params = {
      feed_id,
      "addition_id": user_id,
      type: "user",
    }
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
    .post("/metadata/update", metadata)
    .then(response => {
      return response.data;
    }).catch(error => {
      console.log("METADATA UPDATE ERROR: " + error.data.message);
      return error.data.message;
    });
  }   
}

export default new SummaryService();
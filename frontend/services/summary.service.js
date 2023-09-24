
import api from './api';
class SummaryService {
  
  pullFeed(feed_id, skip, limit, timestamp) {
    let url = "/feed/pull/"+feed_id
    let time = timestamp
    if (!time) {
      time = 0
    }
    if (skip >= 0 && limit >= 0) {
      url += "?" + new URLSearchParams({
        skip: skip,
        limit: limit,
        timestamp: time,
      })
    }
    return api
    .get(url)
    .then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }

  pullDigest() {
    return api
    .get(("/feed/digest"), {})
    .then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }

  pullAllFeeds() {
    return api
    .get(("/feed/pull-all"), {})
    .then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }

  pullAllInterests() {
    return api
    .get(("/feed/pull-new-interests"), {})
    .then(response => {
      return response.data;
    }).catch(error => {
      return error;
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
      return error;
    });
  }

  toggleFlag(metadata) {
    return api
    .post("/metadata/update", metadata)
    .then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }   

  createInterest(interest) {
    console.log("SUBMITTING ", interest)
    return api
    .post("/feed/create-interest", interest)
    .then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }  
  
  joinInterest(unique_name) {
    return api
    .post("/feed/join-interest", {"unique_name": unique_name})
    .then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }  

  updateInterest(interest) {
    return api
    .post("/feed/update-interest/"+interest._id, {
      "_id": interest._id,
      "query_content": interest.query_content,
      "unique_name": interest.unique_name,
    })
    .then(response => {
      return response.data;
    }).catch(error => {
      return error;
    });
  }

  changeInterestPrivate(id, private_status) {
    return api
    .post("/feed/change-interest-private", {
      "feed_id": id,
      "private": private_status
    })
    .then(response => {
      return response.data;
    }).catch(error => {
      return error;
    })
  }

  deleteFeed(id) {
    return api
    .post("/feed/delete-feed/"+id, {
      "_id": id,
    })
    .then(response => {
      return response.data;
    }).catch(error => {
      console.log("ERROR: " + error);
      return error;
    });
  }
  
}

export default new SummaryService();
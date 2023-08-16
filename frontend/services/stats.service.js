
import api from './api';
class StatsService {

  saveVisit(visit) {
    return api
    .post(("stats/visit/create"), visit)
    .then(response => {
      return
    }).catch(error => {
      console.log("ERROR: " + error.data.message);
      return
    });
  }

  addEvent(event) {
    return api
    .post(("stats/session/add-event"), event)
    .then(response => {
      return
    }).catch(error => {
      console.log("ERROR: " + error.data.message);
      return
    });
  }
}

export default new StatsService();
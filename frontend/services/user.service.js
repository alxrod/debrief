import api from './api';
import TokenService from "./token.service";

class UserService {
    login(email, password) {
      return api
      .post("/user/login", {
        email,
        password
      })
      .then(response => {
        if (response.data.access_token) {
          TokenService.setCreds(response.data);
        }
        return response.data;
      }).catch(error => {
        return error;
      })
    }   


    register(email, password) {
      return api.post("/user/register", {
        email,
        password
      })
      .then(response => {
        if (response.data.access_token) {
          TokenService.setCreds(response.data);
        }
        return response.data;
      }).catch(error => {
        return error;
      })
    }

    logout() {
      return new Promise((resolve, reject) => {
        TokenService.removeUser();
        resolve();
      })
    }

    pullUser() {
      return api
      .get("/user/cur", {})
      .then(response => {
        return response.data;
      }).catch(error => {
        return error;
      })
    }

    changePlaybackSpeed(speed) {
      return api
      .post("/user/change-playback", {
        playback_speed: speed,
      })
      .then(response => {
        return response.data;
      }).catch(error => {
        return error;
      })
    }


}

export default new UserService();
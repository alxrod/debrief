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
      });
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
      });
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
      });
    }


}

export default new UserService();
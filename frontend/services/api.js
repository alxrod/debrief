import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/user/login" && err.response) {
      // Access Token was expired
      console.log("ERROR", err.response)
      if ((err.response.status === 401 || err.response.status === 422) && !originalConfig._retry) {
        originalConfig._retry = true;
        
        try {
          const refresh = TokenService.getLocalRefreshToken();
          const rs = await axios.post(
            process.env.NEXT_PUBLIC_API_URL+"/user/refresh", 
            {},
            { headers: {"Authorization" : `Bearer ${refresh}`} }
          );
          const { access_token } = rs.data;
          
          TokenService.updateLocalAccessToken(access_token);
          originalConfig.headers["Authorization"] = 'Bearer ' + access_token;
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
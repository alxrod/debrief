class TokenService {
  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("creds"));
    return user?.refresh_token;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("creds"));
    return user?.access_token;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("creds"));
    user.access_token = token;
    localStorage.setItem("creds", JSON.stringify(user));
  }

  getCreds() {
    return JSON.parse(localStorage.getItem("creds"));
  }

  setCreds(creds) {
    localStorage.setItem("creds", JSON.stringify(creds));
  }

  removeUser() {
    localStorage.removeItem("creds");
  }
}

export default new TokenService();

class TokenService {
    getLocalAccessToken() {
      const currentToken = JSON.parse(localStorage.getItem("token"));
      return currentToken;
    }
  
    updateLocalAccessToken(token) {
      localStorage.setItem("token", JSON.stringify(token));
    }
  
    removeLocalAccessToken() {
      localStorage.removeItem("token");
    }

    /*
    getUser() {
      return JSON.parse(localStorage.getItem("user"));
    }
  
    setUser(user) {
      console.log(JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));
    }
  
    removeUser() {
      localStorage.removeItem("user");
    }
    */
  }
  
  export default new TokenService();
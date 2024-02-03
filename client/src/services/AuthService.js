import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8081/api/auth";

class AuthService {
  //註冊
  register(username, email, password, authenticateCode) {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      authenticateCode,
    });
  }
  //登入
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }

  //google登入
  loginByGoogle() {
    return axios.get(API_URL + "/google");
  }
  setUserInLocalByGoogle() {
    //google登入存cookie
    if (Cookies.get("user") && Cookies.get("token")) {
      console.log("google");
      const user = Cookies.get("user");
      const token = Cookies.get("token");
      localStorage.setItem("user", user);
      localStorage.setItem("token", token);
      // 在保存後清除 cookie
      Cookies.remove("user");
      Cookies.remove("token");
    }
  }
  //本地登入
  setUserInLocalByLocal(result) {
    const user = JSON.stringify(result.data.user);
    const token = JSON.stringify(result.data.token);
    localStorage.setItem("user", user);
    localStorage.setItem("token", token);
  }

  //取得當下使用者資訊
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  //登出
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
}

export default new AuthService();

// Post

// id int
// title chartext(255)
// content charteext
// date:
// author_id
// created_at:
// updated_at

// Comment
// id:
// user_id
// content:
// post_id:
// comment_id:

import axios from "axios";
const API_URL = "http://localhost:8081/api/shop";

class ShopService {
  //新增訂單
  createOrder(Email, Amt, Itemdesc, _id, account, realName, phone, orderList) {
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      const formData = new FormData();
      let postData = {
        Email,
        Amt,
        Itemdesc,
        _id,
        account,
        realName,
        phone,
        orderList,
      };
      return axios.post(API_URL + `/createOrder`, postData, {
        headers: { Authorization: token },
      });
    }
  }

  //載入訂單
  loadLatestOrder(_id, filter) {
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      return axios.get(API_URL + `/loadLatestOrder/${_id}/?orderNo=${filter}`, {
        headers: { Authorization: token },
      });
    }
  }

  //轉址成功 載入訂單資訊
}

export default new ShopService();

import axios from "axios";
const API_URL_POST = "http://localhost:8081/api/post";
const API_URL = "http://localhost:8081/api/shop";
const API_URL_VISITORS = "http://localhost:8081/api/visitors";

class ShopService {
  //add product
  addProduct({ title, price, stock, description }, file) {
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      let postData = { title, price, stock, description };
      const formData = new FormData();
      postData.title && formData.append("title", postData.title);
      postData.price && formData.append("price", postData.price);
      postData.stock && formData.append("stock", postData.stock);
      postData.description &&
        formData.append("description", postData.description);
      formData.append("file", file);
      return axios.post(API_URL + "/addProduct", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      console.log("權限不足");
      return { msg: "權限不足" };
    }
  }

  //edit product

  //delete product

  //loadLatestProduct
  loadLatestProduct() {
    return axios.get(API_URL_VISITORS + "/loadLatestProduct");
  }

  //按照product id 載入資料
  loadProductById(_id) {
    return axios.get(API_URL_VISITORS + `/loadProductById/${_id}`);
  }

  //即時取得localStorage購物車內容
  loadShoppingCart() {
    let totalPrice = JSON.parse(localStorage.getItem("orderTotal"));
    let totalOrder = JSON.parse(localStorage.getItem("orderList"));
    if (totalPrice) {
      const shoppingCart = { price: totalPrice, order: totalOrder };
      return shoppingCart;
    } else {
      return null;
    }
  }
  //清除localStorage購物車內容
  removeShoppingCartItem(_id) {
    let totalOrder = JSON.parse(localStorage.getItem("orderList"));
    let totalPrice = JSON.parse(localStorage.getItem("orderTotal"));
    //totalOrder => array
    if (totalOrder) {
      const indexToRemove = totalOrder.findIndex((item) => {
        return item._id === _id;
      });
      if (indexToRemove >= 0) {
        totalPrice -= totalOrder[indexToRemove].price;
        if (totalPrice == 0) {
          totalOrder.splice(indexToRemove, 1);
          localStorage.removeItem("orderTotal");
          localStorage.removeItem("orderList");
        } else {
          console.log(totalPrice);
          totalOrder.splice(indexToRemove, 1); // 移除索引位置的元素，只移除一個
          localStorage.setItem("orderTotal", JSON.stringify(totalPrice));
          localStorage.setItem("orderList", JSON.stringify(totalOrder));
        }
      }
    }
  }

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

  //依照使用者_id 載入訂單
  loadLatestOrder(_id, filter) {
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      return axios.get(API_URL + `/loadLatestOrder/${_id}/?orderNo=${filter}`, {
        headers: { Authorization: token },
      });
    }
  }
}

export default new ShopService();

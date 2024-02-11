import axios from "axios";
const API_URL = "http://localhost:8081/api/post";
const API_URL_VISITORS = "http://localhost:8081/api/visitors";

class PostService {
  //照instructor_id載入文章
  findUserPost(user_id) {
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      return axios.get(API_URL + `/${user_id}`, {
        headers: { Authorization: token },
      });
    }
  }
  //po文 包含上傳 封面圖片
  addPost({ title, category, content }, file) {
    let postData = { title, category, content };
    const formData = new FormData();
    postData.title && formData.append("title", postData.title);
    postData.category && formData.append("category", postData.category);
    postData.content && formData.append("content", postData.content);
    formData.append("file", file); // Append file
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      return axios.post(API_URL + "/addPost", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
    }
  }

  //update post
  editPost(id, { title, category, content }, file) {
    let postData = { title, category, content };
    const formData = new FormData();
    postData.title && formData.append("title", postData.title);
    postData.category && formData.append("category", postData.category);
    postData.content && formData.append("content", postData.content);
    formData.append("file", file); // Append file
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      return axios.patch(API_URL + `/editPost/${id}`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
    }
  }

  //將文章id存入localStorage
  setPostId(_id) {
    localStorage.setItem("postId", _id);
  }
  //按照文章id搜尋內容(不需要token)
  loadPostContent(post_id) {
    return axios.get(API_URL_VISITORS + `/${post_id}`);
  }
  //loaPost by latest(for banner)
  loadPostByLatest() {
    return axios.get(API_URL_VISITORS + "/loadPost/sortByLatest");
  }
  //loadPost by topLikes(for homepage)
  loadPostByTopLikes() {
    return axios.get(API_URL_VISITORS + "/loadPost/sortByTopLikes");
  }

  //like & unlike the post
  likePost(user_id, post_id) {
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      //patch 資料包含 req.body
      return axios.patch(
        API_URL + `/likePost/${user_id}`,
        {
          postId: post_id,
        },
        {
          headers: { Authorization: token },
        }
      );
    }
  }

  //according currentUser id find liked posts
  loadLikedPosts(user_id) {
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      return axios.get(API_URL + `/loadLikePost/${user_id}`, {
        headers: { Authorization: token },
      });
    }
  }

  //delete post
  deletePost(_id) {
    let token;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
      return axios.delete(API_URL + `/deletePost/${_id}`, {
        headers: { Authorization: token },
      });
    }
  }

  //依類別載入文章
  loadByCategoryAndSortByTopLatest(category) {
    return axios.get(
      API_URL_VISITORS + `/loadPost/sortByTopLatest/${category}`
    );
  }

  //商品相關
  // //add product
  // addProduct({ title, price, stock, description }, file) {
  //   let token;
  //   if (localStorage.getItem("token")) {
  //     token = JSON.parse(localStorage.getItem("token"));
  //     let postData = { title, price, stock, description };
  //     const formData = new FormData();
  //     postData.title && formData.append("title", postData.title);
  //     postData.price && formData.append("price", postData.price);
  //     postData.stock && formData.append("stock", postData.stock);
  //     postData.description &&
  //       formData.append("description", postData.description);
  //     formData.append("file", file);
  //     return axios.post(API_URL + "/addProduct", formData, {
  //       headers: {
  //         Authorization: token,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //   } else {
  //     console.log("權限不足");
  //     return { msg: "權限不足" };
  //   }
  // }

  // //loadLatestProduct
  // loadLatestProduct() {
  //   return axios.get(API_URL_VISITORS + "/loadLatestProduct");
  // }

  // //按照product id 載入資料
  // loadProductById(_id) {
  //   return axios.get(API_URL_VISITORS + `/loadProductById/${_id}`);
  // }

  // //即時取得localStorage購物車內容
  // loadShoppingCart() {
  //   let totalPrice = JSON.parse(localStorage.getItem("orderTotal"));
  //   let totalOrder = JSON.parse(localStorage.getItem("orderList"));
  //   if (totalPrice) {
  //     const shoppingCart = { price: totalPrice, order: totalOrder };
  //     return shoppingCart;
  //   } else {
  //     return null;
  //   }
  // }
  // //清除localStorage購物車內容
  // removeShoppingCartItem(_id) {
  //   let totalOrder = JSON.parse(localStorage.getItem("orderList"));
  //   let totalPrice = JSON.parse(localStorage.getItem("orderTotal"));
  //   //totalOrder => array
  //   if (totalOrder) {
  //     const indexToRemove = totalOrder.findIndex((item) => {
  //       return item._id === _id;
  //     });
  //     if (indexToRemove >= 0) {
  //       totalPrice -= totalOrder[indexToRemove].price;
  //       if (totalPrice == 0) {
  //         totalOrder.splice(indexToRemove, 1);
  //         localStorage.removeItem("orderTotal");
  //         localStorage.removeItem("orderList");
  //       } else {
  //         console.log(totalPrice);
  //         totalOrder.splice(indexToRemove, 1); // 移除索引位置的元素，只移除一個
  //         localStorage.setItem("orderTotal", JSON.stringify(totalPrice));
  //         localStorage.setItem("orderList", JSON.stringify(totalOrder));
  //       }
  //     }
  //   }
  // }
}

export default new PostService();

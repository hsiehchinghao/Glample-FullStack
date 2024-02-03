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
}

export default new PostService();

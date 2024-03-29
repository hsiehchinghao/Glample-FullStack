import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import PostService from "../services/PostService";
import ShopService from "../services/ShopService";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import updatePostBtnIcon from "../svg/writing-svgrepo-com(1).svg";
import deletePostIcon from "../svg/trash.svg";
import axios from "axios";

const Profile = ({ setShopCount, setShopItems }) => {
  const API_URL = "https://glample-mern-9b575194526d.herokuapp.com/";
  //如果是google登入，將資料存在localStorage
  AuthService.setUserInLocalByGoogle();
  const navigate = useNavigate();
  let props = useOutletContext();
  const [post_id, setPost_id] = useState(null);
  const [likePost, setLikePost] = useState(null);
  const [historyOrder, setHistoryOrder] = useState(null);
  const [productManage, setProductManage] = useState(null);
  const [ifLoadedPost, setIfLoadedPost] = useState(false);
  const [ifLoadedProduct, setIfLoadedProduct] = useState(false);
  const [ifLoadedLikePost, setIfLoadedLikePost] = useState(false);
  // const [orderFound, setOrderFound] = useState(false);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    window.scrollTo(0, 0);
    props.setCurrentUser(AuthService.getCurrentUser());
    if (AuthService.getCurrentUser()) {
      // const currentUser = AuthService.getCurrentUser();

      //身份是編輯
      //載入post的文章
      //載入商品資料

      if (currentUser.role == "instructor") {
        //發佈的文章
        PostService.findUserPost(currentUser._id)
          .then((result) => {
            console.log(result);
            setPost_id(() => {
              return result.data.post_id;
            });
            setIfLoadedPost(true);
            console.log(result.data.post_id);
          })
          .catch((e) => {
            console.log(e);
            navigate("/login");
          });

        //發佈的商品
        ShopService.loadLatestProduct()
          .then((result) => {
            console.log(result);
            setProductManage(() => {
              return result.data.result;
            });
            setIfLoadedProduct(true);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      //載入like文章
      PostService.loadLikedPosts(currentUser._id)
        .then((result) => {
          console.log(result);
          setLikePost(result.data.likePost);
          setIfLoadedLikePost(true);
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data == "Unauthorized") {
            AuthService.logout();
            navigate("/login");
          }
        });

      //載入歷史訂單
      ShopService.loadLatestOrder(
        currentUser._id,
        JSON.parse(localStorage.getItem("orderNo"))
      )
        .then((result) => {
          console.log(result);
          setHistoryOrder(result.data.result);
          if (result.data.orderFound) {
            //已付款成功，清除localStorage
            localStorage.removeItem("orderNo");
            localStorage.removeItem("orderDetails");
            localStorage.removeItem("orderList");
            localStorage.removeItem("orderTotal");
            //觸發shopList重新讀取localStorage
            setShopItems(() => {
              return ShopService.loadShoppingCart();
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      alert("Please Login First");
      navigate("/login");
    }
  }, []);
  //載入文章頁面
  const handlePerPost = (_id) => {
    PostService.setPostId(_id);
    navigate(`/post/${_id}`);
  };
  //修改文章按鈕
  const handleUpdate = (_id) => {
    let confirm = window.confirm("Double check to Edit the post?");
    if (confirm) {
      navigate(`/editPost/${_id}`);
    }
  };
  //刪除文章
  const handleDelete = async (_id) => {
    let confirm = window.confirm("Double check to delete the post?");
    if (confirm) {
      let result = await PostService.deletePost(_id);
      console.log(result);
      navigate("/profile");
      window.location.reload();
    }
  };

  //刪除商品
  const handleDeleteProduct = async (_id, username) => {
    if (currentUser) {
      if (currentUser.username != username) {
        alert("You are not reponse for the Product");
      } else {
        let confirm = window.confirm("Double check to delete the product?");
        if (confirm) {
          let result = await ShopService.deleteProduct(_id);
          navigate("/profile");
          window.location.reload();
        }
      }
    }
  };

  //進入商品頁
  const checkEachProduct = (_id) => {
    navigate(`/loadProduct/${_id}`);
  };

  return (
    <div className="profile">
      {props.currentUser ? (
        <div>
          <div className="accountSettingSection">
            <h1 className="profileHeader">
              {props.currentUser && props.currentUser.username}
              <br />
              Welcome Back !
              <br />
              你好 !
              <br />
              ようこそ !
            </h1>
          </div>
          {props.currentUser && props.currentUser.role == "instructor" && (
            <div className="allInstructorPost">
              <div className="instructorPostTitle">Your Posts</div>
              <div className="loadInstructorPostSection">
                {ifLoadedPost ? (
                  post_id && post_id.length != 0 ? (
                    post_id.map((index) => {
                      return (
                        <div
                          onClick={() => {
                            handlePerPost(index._id);
                          }}
                          key={index._id}
                          className="perPost"
                          style={{
                            backgroundImage: `url(${API_URL}${index.image})`,
                          }}
                        >
                          <div className="perPostData">
                            {index.title}
                            <br />
                            {index.date}
                            <div className="editBtn">
                              <div className="updatePostBtn">
                                <img
                                  src={updatePostBtnIcon}
                                  alt="update content"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdate(index._id);
                                  }}
                                />
                              </div>
                              <div className="deletePostBtn">
                                <img
                                  src={deletePostIcon}
                                  alt="delete content"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(index._id);
                                    handleDelete(index._id);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="errorMsg">
                      No articles have been added yet.
                    </div>
                  )
                ) : (
                  <div className="loader"></div>
                )}
              </div>
            </div>
          )}
          {/* 商品管理 */}
          {productManage && (
            <div className="allInstructorPost">
              <div className="instructorPostTitle">Manage Products</div>
              <div className="loadInstructorPostSection">
                {ifLoadedProduct ? (
                  productManage && productManage.length != 0 ? (
                    productManage.map((index) => {
                      return (
                        <div
                          onClick={() => {
                            checkEachProduct(index._id);
                          }}
                          key={index._id}
                          className="perPost"
                          style={{
                            backgroundImage: `url(${API_URL}${index.image})`,
                          }}
                        >
                          <div className="perPostData">
                            {index.title}
                            <br />
                            {index.date}
                            <div className="editBtn">
                              <div className="deletePostBtn">
                                <img
                                  src={deletePostIcon}
                                  alt="delete content"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(index._id);
                                    handleDeleteProduct(
                                      index._id,
                                      index.response
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="errorMsg">
                      You have not listed any products yet.
                    </div>
                  )
                ) : (
                  <div className="loader"></div>
                )}
              </div>
            </div>
          )}

          <div className="allLikesPosts">
            <div className="likePostTitle">Liked Posts ! いいね！</div>
            <div className="loadLikePostSection">
              {ifLoadedLikePost ? (
                likePost && likePost.length != 0 ? (
                  likePost.reverse().map((data) => {
                    return (
                      <div
                        key={data._id}
                        className="perLikePost"
                        style={{
                          backgroundImage: `url(${API_URL}${data.image})`,
                        }}
                        onClick={(e) => {
                          handlePerPost(data._id);
                        }}
                      >
                        <p className="perLikePostData">
                          {data.title}
                          <br />
                          {data.date}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="errorMsg">There isn't any liked post.</div>
                )
              ) : (
                <div className="loader"></div>
              )}
              {/* {likePost && likePost.length == 0 && (
                <div className="errorMsg">There isn't any liked post!</div>
              )} */}
            </div>
          </div>
          <div className="loadAllOrders">
            <div className="likePostTitle">Historical Orders ! 注文履歴 !</div>
            <div className="loadLikePostSection">
              {historyOrder && historyOrder.length != 0 ? (
                historyOrder.map((data) => {
                  return (
                    <div className="perOrder">
                      <div className="perOrderNo">
                        Order No.{data.MerchantOrderNo} /{" "}
                        {data.date.slice(0, 10)}
                      </div>
                      <div className="perOrderItems">
                        {data.orderList.map((i) => {
                          return (
                            <div className="perOrderItem">
                              <div
                                className="cover"
                                style={{
                                  backgroundImage: `url(${API_URL}${i.image})`,
                                }}
                              ></div>
                              <div className="productInfo">{i.title}</div>
                              <div className="productInfo">${i.price}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="perOrderTotalPrice">
                        Total:${data.Amt}NTD
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="errorMsg">There isn't any finish order!</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <h1 className="errorMsg">Login first</h1>
      )}
    </div>
  );
};

export default Profile;

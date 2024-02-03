import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import PostService from "../services/PostService";
import { useOutletContext, useNavigate, Link } from "react-router-dom";
import updatePostBtnIcon from "../svg/writing-svgrepo-com(1).svg";
import deletePostIcon from "../svg/trash.svg";

const Profile = () => {
  //如果是google登入，將資料存在localStorage
  AuthService.setUserInLocalByGoogle();
  const navigate = useNavigate();
  let props = useOutletContext();
  const [post_id, setPost_id] = useState(null);
  const [likePost, setLikePost] = useState(null);

  useEffect(() => {
    props.setCurrentUser(AuthService.getCurrentUser());
    window.scrollTo(0, 0);
    if (AuthService.getCurrentUser()) {
      const currentUser = AuthService.getCurrentUser();
      //載入post的文章
      if (currentUser.role == "instructor") {
        PostService.findUserPost(currentUser._id)
          .then((result) => {
            setPost_id(() => {
              return result.data.post_id;
            });
            console.log(result.data.post_id);
          })
          .catch((e) => {
            console.log(e);
            navigate("/login");
          });
      }
      //載入like文章
      PostService.loadLikedPosts(currentUser._id)
        .then((result) => {
          console.log(result);
          setLikePost(result.data.likePost);
        })
        .catch((e) => {
          console.log(e);
          if (e.response.data == "Unauthorized") {
            AuthService.logout();
            navigate("/login");
          }
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
    navigate(`/editPost/${_id}`);
  };
  //刪除文章
  const handleDelete = async (_id) => {
    let result = await PostService.deletePost(_id);
    console.log(result);
    navigate("/profile");
    window.location.reload();
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
              哩賀 !
              <br />
              ようこそ !
            </h1>
          </div>
          {props.currentUser && props.currentUser.role == "instructor" && (
            <div className="allInstructorPost">
              <div className="instructorPostTitle">Your Posts</div>
              <div className="loadInstructorPostSection">
                {post_id &&
                  post_id.map((index) => {
                    return (
                      <div
                        onClick={() => {
                          handlePerPost(index._id);
                        }}
                        key={index._id}
                        className="perPost"
                        style={{
                          backgroundImage: `url(${index.image})`,
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
                  })}
              </div>
            </div>
          )}

          <div className="allLikesPosts">
            <div className="likePostTitle">Liked Posts ! いいね！</div>
            <div className="loadLikePostSection">
              {likePost &&
                likePost.reverse().map((data) => {
                  return (
                    <div
                      key={data._id}
                      className="perLikePost"
                      style={{
                        backgroundImage: `url(${data.image})`,
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
                })}
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

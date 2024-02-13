import React, { useState, useEffect, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import PostService from "../services/PostService";
//like icon
import notLikeYetIcon from "../svg/icons8-like-64.png";
import likeIcon from "../svg/icons8-like-64 2.png";
import AuthService from "../services/AuthService";

const PostPage = () => {
  const API_URL = "https://glample-mern-9b575194526d.herokuapp.com/";
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState(null);
  const [error, setError] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const [likeLength, setLikeLength] = useState(null);
  const currentUser = useOutletContext().currentUser;
  const { id } = useParams();
  const likeScrollRef = useRef(null);

  useEffect(() => {
    PostService.loadPostContent(id)
      .then((result) => {
        const postData = result.data.findPost;
        setPostContent(() => {
          return postData;
        });
        setLikeLength(() => {
          return postData.like.length;
        });
        if (AuthService.getCurrentUser()) {
          console.log(postData.like);
          console.log(currentUser._id);
          console.log(postData.like.includes(currentUser._id));
          if (postData.like.includes(currentUser._id)) {
            setIsLike(true);
          }
        }
      })
      .catch((e) => {
        console.log(e);
        setError(true);
      });

    return () => {
      localStorage.removeItem("postId");
    };
  }, []);

  const handleLike = (e) => {
    if (!AuthService.getCurrentUser()) {
      alert("Please login first");
      navigate("/login");
    } else {
      LikePost(currentUser._id, id);
      if (likeScrollRef.current) {
        console.log(likeScrollRef.current);
        if (!isLike) {
          setIsLike(true);
          setLikeLength((prev) => {
            return prev + 1;
          });
        } else {
          setIsLike(false);
          setLikeLength((prev) => {
            return prev - 1;
          });
        }
      }
    }
  };

  const LikePost = async (user_id, post_id) => {
    let result = await PostService.likePost(user_id, post_id);
    console.log(result);
  };

  return (
    <>
      {error && <div className="errorPage">OOPS! THERE'S SOMETHING WRONG</div>}
      {postContent ? (
        <>
          <div className="likeBtnPostPageSection">
            <div className="likeBtnPostPage" onClick={handleLike}>
              <div
                className={isLike ? "liked" : "likeBtnBar"}
                ref={likeScrollRef}
              >
                <img src={notLikeYetIcon} alt="likeIcon" />
                <img src={likeIcon} alt="likeIcon" />
              </div>
            </div>
            <div
              className={isLike ? `likedwords` : `likeWords`}
            >{`いいね！X${likeLength}`}</div>
          </div>
          <div
            className="postPageBanner"
            style={{ backgroundImage: `url(${API_URL}${postContent.image})` }}
          ></div>
          <div
            className="postPage"
            style={{ backgroundImage: `url(${API_URL}${postContent.image})` }}
          >
            <div className="postMain">
              <div className="postInfo">
                <h1 className="postTitle">{postContent.title}</h1>
                <span className="postCategory">{postContent.category}</span>
                <div className="postAutorAndPostDate" style={{ color: "#fff" }}>
                  <span className="postAuthor">
                    Written By {postContent.authorname}
                  </span>
                  /
                  <span className="postDate">
                    {postContent.date.slice(0, 10)}
                  </span>
                </div>
              </div>
              <div
                className="ql-editor postContent"
                dangerouslySetInnerHTML={{ __html: postContent.content }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="loadingPage">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
};

export default PostPage;

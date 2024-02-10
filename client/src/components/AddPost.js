import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import Quill from "quill";
import ImageResize from "quill-image-resize-module-react";
import ImageCompress from "quill-image-compress";
import "react-quill/dist/quill.snow.css";
import PostService from "../services/PostService";
import AuthService from "../services/AuthService";

const AddPost = () => {
  //resize IMG compress IMG html editor
  Quill.register("modules/imageCompress", ImageCompress);
  Quill.register("modules/imageResize", ImageResize);
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      [{ font: [] }],
      [{ size: [] }],
      [{ color: [] }],
      [{ background: [] }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["image", "video", "link"],
    ],
    //resize
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
    //compress
    imageCompress: {
      quality: 0.7, // default
      maxWidth: 1000, // default
      maxHeight: 1000, // default
      imageType: "image/jpeg", // default
      debug: true, // default
      suppressErrorLogging: false, // default
      insertIntoEditor: undefined, // default
    },
  };

  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: "",
    category: "",
    content: "",
  });

  const [cover, setCover] = useState("file name");
  const [preview, setPreview] = useState();
  const [ifPreview, setIfPreview] = useState(false);
  const [Error, setError] = useState(false);
  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const contentRef = useRef(null);

  //初次載入useEffect
  useEffect(() => {
    //頁面置頂
    window.scrollTo(0, 0);
    //身份確認
    // console.log(AuthService.getCurrentUser());
    if (!AuthService.getCurrentUser()) {
      alert("Staff Only");
      navigate("/login");
    } else {
      if (AuthService.getCurrentUser().role != "instructor") {
        alert("Staff Only");
        navigate("/profile");
      }
    }
  }, []);

  //上傳圖片預覽useEffect
  useEffect(() => {
    if (cover) {
    }
  }, [cover]);

  //預覽封面圖片
  const handleCoverPreview = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    console.log(e.target.files[0]);
    console.log(URL.createObjectURL(e.target.files[0]));
    // I've kept this example simple by using the first image instead of multiple
    setCover(e.target.files[0].name);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  //預覽貼文
  const handlePreviewPostBtn = () => {
    setPostData((prev) => {
      return {
        title: titleRef.current.value,
        category: categoryRef.current.value,
        content: contentRef.current.value,
      };
    });
    setIfPreview((prev) => {
      return () => {
        return postData.title && postData.category && postData.content
          ? true
          : false;
      };
    });
  };

  //提交貼文
  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = document.querySelector("#fileUpload").files[0];
    // postData.content = value;
    console.log(postData);
    let result = await PostService.addPost(postData, file);
    console.log(result);

    result ? navigate("/profile") : setError(true);
  };
  return (
    <>
      {AuthService.getCurrentUser() &&
      AuthService.getCurrentUser().role == "instructor" ? (
        <div className="addPostPage">
          <h1 className="addPostTitle">Add Post</h1>
          <div className="addPostAndRender">
            <form action="post" className="addPostMain">
              <div className="titleAndCategory">
                <label htmlFor="title">Title</label>
                <textarea
                  className="titleInput"
                  type="text"
                  id="title"
                  name="title"
                  ref={titleRef}
                  rows="14"
                  cols="10"
                  wrap="hard"
                />
                <label htmlFor="">Category</label>
                <select
                  className="categorySelection"
                  name="category"
                  id="category"
                  ref={categoryRef}
                  // onChange={handleCategory}
                >
                  <option value="" defaultChecked>
                    CATEGORY
                  </option>
                  <option value="FASHION">FASHION</option>
                  <option value="MUSIC">MUSIC</option>
                  <option value="MOVIE">MOVIE</option>
                  <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                </select>
              </div>
              <div className="editorContainer">
                <ReactQuill modules={modules} theme="snow" ref={contentRef} />
              </div>
              <div className="postCover">
                <div className="uploadImgWord">
                  Upload Cover Image (square / landscape)
                </div>
                <div className="uploadImgSection">
                  <label htmlFor="fileUpload" className="customFileUpload">
                    Click to select
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/jpg, image/png, image/jpeg, image/svg, image/JPG, image/JPEG, image/gif, image/GIF, image/webp"
                    onChange={handleCoverPreview}
                  />
                  <div style={{ overflow: "scroll" }}>{cover}</div>
                </div>
                <div className="postCoverPreview">
                  {preview ? <img src={preview} alt="" /> : "preview"}
                </div>
              </div>
              <div className="previewBtn" onClick={handlePreviewPostBtn}>
                Double Check!
              </div>
            </form>
            <div className="previewPostTitle">Post Preview</div>
            <div className="previewPost">
              {postData.title && (
                <h1 className="previewPostTitle ">{postData.title}</h1>
              )}
              {postData.category && (
                <>
                  <span className="previewPostCategory">
                    {postData.category}
                  </span>
                  <span>
                    {new Date().getFullYear()}/{new Date().getMonth() + 1} /{" "}
                    {new Date().getDate()}
                  </span>
                </>
              )}
              <div
                className="ql-editor postContent"
                dangerouslySetInnerHTML={{ __html: postData.content }}
              />
            </div>
            {postData.title && postData.category && postData.content ? (
              <button
                className="submitPost"
                type="submit"
                onClick={handleSubmit}
                disabled={!ifPreview}
              >
                Submit
              </button>
            ) : (
              <button
                className="submitPost"
                type="submit"
                onClick={handleSubmit}
                disabled
              >
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="errorPage">Edditor Only</div>
      )}
    </>
  );
};

export default AddPost;

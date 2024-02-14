import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import PostService from "../services/PostService";
import ShopService from "../services/ShopService";
import AuthService from "../services/AuthService";

const AddProduct = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [postData, setPostData] = useState({
    title: "",
    price: "",
    stock: "",
  });
  const [cover, setCover] = useState("file name");
  const [preview, setPreview] = useState();
  const [ifPreview, setIfPreview] = useState(false);

  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const stockRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentUser(AuthService.getCurrentUser());
  }, []);

  //預覽封面
  const handleCoverPreview = (e) => {
    if (!e.target.files || e.target.files.length == 0) {
      return;
    }
    console.log(URL.createObjectURL(e.target.files[0]));
    setPreview(URL.createObjectURL(e.target.files[0]));
    setCover(e.target.files[0].name);
  };

  //預覽商品貼文
  const handlePreviewPostBtn = () => {
    setPostData((prev) => {
      return {
        title: titleRef.current.value,
        price: priceRef.current.value,
        stock: stockRef.current.value,
        description: descriptionRef.current.value,
      };
    });
    setIfPreview((prev) => {
      return () => {
        return postData.title && postData.price && postData.stock
          ? true
          : false;
      };
    });
  };

  const handleSubmit = async (e) => {
    try {
      const title = postData.title;
      const price = postData.price;
      const stock = postData.stock;
      const description = postData.description;
      const response = JSON.parse(localStorage.getItem("user")).username;
      const file = document.querySelector("#fileUpload").files[0];
      const result = await ShopService.addProduct(
        { title, price, stock, description, response },
        file
      );
      console.log(result);
      navigate("/profile");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="addProductPage">
      {currentUser && currentUser.role == "instructor" ? (
        <div className="addPostPage">
          <h1 className="addPostTitle">Add Product</h1>
          <div className="addPostAndRender">
            <form action="post" className="addPostMain">
              <div className="titleAndPrice">
                <label htmlFor="title">Title</label>
                <input
                  className="titleInput"
                  type="text"
                  id="title"
                  ref={titleRef}
                />
                <label htmlFor="price">Price(NTD)</label>
                <input
                  type="number"
                  id="price"
                  className="productPriceInput"
                  ref={priceRef}
                />
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  className="productStockInput"
                  ref={stockRef}
                />
              </div>
              <div className="postCover">
                <div className="uploadImgWord">Upload Cover Image (square)</div>
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
              <div className="productDescription">
                <label htmlFor="description">Introduce the MAG!</label>
                <textarea
                  ref={descriptionRef}
                  name="description"
                  id="description"
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
            </form>
            <div className="previewPostBtn" onClick={handlePreviewPostBtn}>
              Double Check!
            </div>
            <div className="previewPost">
              {postData.title && (
                <div className="previewPostTitleAndImg">
                  <h1 className="previewPostTitle ">{postData.title}</h1>
                  <div className="previewPostImg">
                    <img src={preview} alt="" />
                  </div>
                  <div className="previewDescription">
                    {postData.description}
                  </div>
                </div>
              )}
              <div className="previewPostPrAndSt">
                {postData.price && (
                  <div className="previewPostPrice">
                    PRICE:{postData.price}NTD
                  </div>
                )}
                {postData.stock && (
                  <div className="previewPostStock">STOCK:{postData.stock}</div>
                )}
              </div>
            </div>

            {postData.title &&
            postData.price &&
            postData.stock &&
            postData.description ? (
              <button
                className="submitPost"
                type="submit"
                onClick={handleSubmit}
                disabled={!ifPreview}
              >
                Submit
              </button>
            ) : (
              <>
                <button
                  className="submitPost"
                  type="submit"
                  onClick={handleSubmit}
                  disabled
                >
                  Submit
                </button>
                <p style={{ color: "#aaa" }}>(*double check before submit)</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="errorPage">Edditor Only</div>
      )}
    </div>
  );
};

export default AddProduct;

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PostService from "../services/PostService";
import ShopService from "../services/ShopService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const ProductPage = ({ shopItems, setShopItems, shopCount, setShopCount }) => {
  const API_URL = "https://glample-mern-9b575194526d.herokuapp.com/";
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  // console.log(id);
  useEffect(() => {
    window.scrollTo(0, 0);
    ShopService.loadProductById(id)
      .then((result) => {
        // console.log(result);
        setProductData(() => {
          return result.data.result;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleAddItems = () => {
    let nowTotal = window.localStorage.getItem("orderTotal");
    if (window.localStorage.getItem("orderTotal")) {
      window.localStorage.setItem(
        "orderTotal",
        parseInt(productData.price) + parseInt(nowTotal)
      );
    } else {
      window.localStorage.setItem("orderTotal", productData.price);
    }
    let orderList = JSON.parse(window.localStorage.getItem("orderList"));
    if (orderList) {
      localStorage.setItem(
        "orderList",
        JSON.stringify([...orderList, productData])
      );
    } else {
      localStorage.setItem("orderList", JSON.stringify([productData]));
    }
    setShopCount((prev) => {
      return prev + 1;
    });
  };

  return (
    <div className="productPage">
      <div className="productCover">
        <img src={productData && `${API_URL}${productData.image}`} alt="" />
      </div>
      <div className="productContent">
        {productData && (
          <>
            <div className="productTitle">{productData.title}</div>
            <div className="productPrice">
              Price: <p>${productData.price}NTD</p>
            </div>
            <div className="productStock">
              NOW Stock:
              <br />
              <p>{productData.stock - productData.orderCount}</p>
            </div>
            <div className="productDescription">{productData.description} </div>

            <button className="addToCart" onClick={handleAddItems}>
              <FontAwesomeIcon
                style={{ padding: "0 5px" }}
                icon={faShoppingCart}
              />
              Add To Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;

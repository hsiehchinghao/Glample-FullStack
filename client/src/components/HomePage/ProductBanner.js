import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostService from "../../services/PostService";
import ShopService from "../../services/ShopService";

const ProductBanner = () => {
  const API_URL = "https://glample-mern-9b575194526d.herokuapp.com/";
  const navigate = useNavigate();
  const [latestProduct, setLatestProduct] = useState(null);
  useEffect(() => {
    ShopService.loadLatestProduct()
      .then((result) => {
        console.log(result);
        setLatestProduct(result.data.result[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleClickToProduct = (_id) => {
    navigate(`/loadProduct/${_id}`);
  };

  return (
    <div className="productBanner">
      <div className="productBannerTitle">
        <p className="productBannerFirst">The physical is always enchanting.</p>
        <p className="productBannerSecond">本体最高！</p>
      </div>
      <div className="productBannerContent">
        <div
          className="latestProduct"
          style={{
            backgroundImage: `url(${API_URL}${
              latestProduct && latestProduct.image
            })`,
          }}
          onClick={() => {
            handleClickToProduct(latestProduct && latestProduct._id);
          }}
        >
          <p className="productTitle">{latestProduct && latestProduct.title}</p>
        </div>
        <p className="latestProductTitle">最新出版！</p>
      </div>
      <Link to="product" className="viewMoreBtn">
        view more..
      </Link>
    </div>
  );
};

export default ProductBanner;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostService from "../services/PostService";
import ShopService from "../services/ShopService";

const ProductList = () => {
  const API_URL = "http://localhost:8081";
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    ShopService.loadLatestProduct()
      .then((result) => {
        console.log(result);
        setProduct(() => {
          return result.data.result;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleClickToProduct = (_id) => {
    // ShopService .loadProductById(_id);
    navigate(`/loadProduct/${_id}`);
  };
  return (
    <div className="productListPage">
      <h1 className="productListPageTitle">PHYSICAL IS ALWAYS ENCHAINTING.</h1>
      <div className="productListPageProducts">
        <div className="productListPageBackdrop">
          {product &&
            product.map((data) => {
              return (
                <div className="productListPageProduct" key={data._id}>
                  <div className="productCover">
                    <div
                      style={{
                        backgroundImage: `url(${API_URL}${data.image})`,
                      }}
                      onClick={() => {
                        handleClickToProduct(data._id);
                      }}
                    ></div>
                  </div>
                  <div className="productInfo">
                    <p className="productTitle">{data.title}</p>
                    <p>Price:${data.price}NTD</p>
                    <p>Stock:{data.stock}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

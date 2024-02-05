import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostService from "../services/PostService";

const ProductList = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    PostService.loadLatestProduct()
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
    // PostService.loadProductById(_id);
    navigate(`/loadProduct/${_id}`);
  };
  return (
    <div className="productListPage">
      <h1 className="productListPageTitle">
        The physical is always enchanting.
      </h1>
      <div className="productListPageProducts">
        <div className="productListPageBackdrop">
          {product &&
            product.map((data) => {
              return (
                <div className="productListPageProduct" key={data._id}>
                  <div className="productCover">
                    <div
                      style={{ backgroundImage: `url(${data.image})` }}
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

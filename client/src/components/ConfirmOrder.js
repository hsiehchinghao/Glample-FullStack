import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import PostService from "../services/PostService";
import ShopService from "../services/ShopService";
import AuthService from "../services/AuthService";

const ConfirmOrder = ({ shopItems, setConfirmOrder }) => {
  const API_URL = "http://localhost:8081";
  const navigate = useNavigate();
  const currentUser = useOutletContext().currentUser;
  const phoneRef = useRef();
  const realNameRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //Email, Amt, Itemdesc, _id, account, realName, phone, orderList

  const handleSubmit = async (e) => {
    try {
      //確認資料填妥才能提交!
      if (AuthService.getCurrentUser()) {
        if (realNameRef.current.value && phoneRef.current.value) {
          //製作商品描述字串
          let ItemDesc = "";
          shopItems.map((i) => {
            ItemDesc += `${i.title},`;
          });
          console.log(ItemDesc);
          //新增訂單到資料庫
          let result = await ShopService.createOrder(
            currentUser.email,
            JSON.parse(localStorage.getItem("orderTotal")),
            ItemDesc,
            currentUser._id,
            currentUser.username,
            realNameRef.current.value,
            phoneRef.current.value,
            JSON.parse(localStorage.getItem("orderList"))
          );
          console.log(result.data);
          setConfirmOrder(result.data);
          //將訂單編號set在 localStorage
          localStorage.setItem(
            "orderNo",
            JSON.stringify(result.data.order.MerchantOrderNo)
          );
          localStorage.setItem("orderDetails", JSON.stringify(result.data));
          navigate("/doubleConfirm");
        } else {
          alert("Please confirm the realname & phone first!");
        }
      } else {
        alert("Please Login First");
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {shopItems ? (
        AuthService.getCurrentUser() ? (
          <div className="confirmOrderPage ">
            <h1 className="confirmOrderTitle">Confirm Order</h1>
            <div className="confirmOrderForm">
              <div className="emailAndAccount">
                <div className="userName">
                  <label htmlFor="">Account:</label>
                  <input
                    type="text"
                    value={currentUser.username}
                    // placeholder={currentUser.username}
                    disabled
                  />
                </div>
                <div className="mail">
                  <label htmlFor="">Mail:</label>
                  <input type="text" value={currentUser.email} disabled />
                </div>
              </div>
              <div className="realNameAndPhone">
                <div className="realName">
                  <label htmlFor="">Real Name:</label>
                  <input type="text" ref={realNameRef} />
                </div>
                <div className="phone">
                  <label htmlFor="">Phone:</label>
                  <input type="number" ref={phoneRef} />
                </div>
              </div>

              <div className="orderConfirmSection">
                <div className="shopItems">
                  {shopItems &&
                    shopItems.map((data) => {
                      return (
                        <div className="perItem" key={data._id}>
                          <div className="perItemInfo">
                            <p>{data.title}</p>
                            <p>${data.price}NTD</p>
                          </div>
                          <div className="perItemCover">
                            <img src={`${API_URL}${data.image}`} alt="" />
                          </div>
                        </div>
                      );
                    })}
                </div>
                {shopItems && (
                  <p className="totalPrice">
                    Total:${localStorage.getItem("orderTotal")}NTD
                  </p>
                )}
              </div>
              <div className="checkoutDataBtn" onClick={handleSubmit}>
                SUBMIT!
              </div>
            </div>
          </div>
        ) : (
          <div className="error">Login First!</div>
        )
      ) : (
        <div className="error">Still Empty!</div>
      )}
    </>
  );
};

export default ConfirmOrder;

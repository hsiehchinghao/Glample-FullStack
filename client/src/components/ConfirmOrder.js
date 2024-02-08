import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import PostService from "../services/PostService";
import ShopService from "../services/ShopService";

const ConfirmOrder = ({ shopItems, setConfirmOrder }) => {
  const navigate = useNavigate();
  const currentUser = useOutletContext().currentUser;
  // console.log(currentUser);
  const phoneRef = useRef();
  const realNameRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //Email, Amt, Itemdesc, _id, account, realName, phone, orderList
  const handleSubmit = async (e) => {
    let ItemDesc = "";
    shopItems.map((i) => {
      ItemDesc += `${i.title},`;
    });
    console.log(ItemDesc);

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
    // navigate("/doubleConfirm");
  };

  return (
    <>
      {shopItems ? (
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
                          <img src={data.image} alt="" />
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
        <div className="error">Still Empty!</div>
      )}
    </>
  );
};

export default ConfirmOrder;

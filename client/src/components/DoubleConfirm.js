import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoubleConfirm = ({ confirmOrder }) => {
  const API_URL = "http://localhost:8081";
  const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(localStorage.getItem("orderList"));
    if (localStorage.getItem("orderList")) {
      if (localStorage.getItem("orderDetails")) {
        console.log(JSON.parse(localStorage.getItem("orderDetails")));
      }
    }
  }, []);

  const handleAlert = (e) => {
    alert(
      "藍新測試環境信用卡資料：{卡號：4000-2211-1111-1111/有效月年：01/28/背面末三碼：111}"
    );
  };

  return (
    <div className="doubleCheckPage">
      {localStorage.getItem("orderList") && localStorage.getItem("orderNo") ? (
        <>
          <h1 className="doubleConfirmTitle"> Double Confirm Your Order!</h1>
          <div className="doubleConfirmOrderContent">
            <div className="allItems">
              <div className="orderData">
                <p>
                  Purchaser's Name:
                  <br />
                  {orderDetails && orderDetails.order.buyerName}
                </p>
                <p>
                  Purchaser's Phone:
                  <br />
                  {orderDetails && orderDetails.order.buyerPhone}
                </p>
                <p>
                  Ordered Items:
                  <br />
                  <div>
                    {orderDetails &&
                      orderDetails.order.orderList.map((item) => {
                        return (
                          <div
                            className="productCover"
                            style={{
                              backgroundImage: `url(${API_URL}${item.image})`,
                            }}
                          >
                            <p>
                              {item.title}
                              <br />${item.price}NTD
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </p>
                <p className="totalPriceReminder">
                  Total:{"  "}${orderDetails && orderDetails.order.Amt}NTD
                </p>
              </div>
            </div>
          </div>
          <form
            className="dataForSubmit"
            action="https://ccore.newebpay.com/MPG/mpg_gateway"
            method="post"
          >
            <input
              style={{ display: "none" }}
              type="text"
              name="MerchantID"
              value={orderDetails && orderDetails.MerchantID}
            />
            <input
              style={{ display: "none" }}
              type="text"
              name="TradeSha"
              value={orderDetails && orderDetails.order.TradeSha}
            />
            <input
              style={{ display: "none" }}
              type="text"
              name="TradeInfo"
              value={orderDetails && orderDetails.order.TradeInfo}
            />
            <input
              style={{ display: "none" }}
              type="text"
              name="TimeStamp"
              value={orderDetails && orderDetails.order.TimeStamp}
            />
            <input
              style={{ display: "none" }}
              type="text"
              name="Version"
              value={orderDetails && orderDetails.Version}
            />
            <input
              style={{ display: "none" }}
              type="text"
              name="NotifyUrl"
              value={orderDetails && orderDetails.NotifyUrl}
            />
            <input
              style={{ display: "none" }}
              type="text"
              name="ReturnUrl"
              value={orderDetails && orderDetails.ReturnUrl}
            />
            <input
              style={{ display: "none" }}
              type="text"
              name="MerchantOrderNo"
              value={orderDetails && orderDetails.order.MerchantOrderNo}
            />
            <input
              style={{ display: "none" }}
              type="text"
              name="Amt"
              value={orderDetails && orderDetails.order.Amt}
            />
            <input
              style={{ display: "none" }}
              type="text"
              value={orderDetails && orderDetails.ReturnUrl}
            />
            <button className="goNewebPay" type="submit" onClick={handleAlert}>
              PAY FOR IT!
            </button>
          </form>
        </>
      ) : (
        <div className="error">There's No Order!</div>
      )}
    </div>
  );
};

export default DoubleConfirm;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoubleConfirm = ({ confirmOrder }) => {
  useEffect(() => {
    console.log(confirmOrder);
  }, []);

  const handleSubmit = async (e) => {
    let prodDesc = "";
    confirmOrder.order.orderList.map((item) => {
      prodDesc += `${item._id},`;
    });
    let token = JSON.parse(localStorage.getItem("token"));
    return await axios.post("https://ccore.newebpay.com/MPG/mpg_gateway", {
      MerchantID: confirmOrder.MerchantID,
      TradeInfo: confirmOrder.TradeInfo,
      TradeSha: confirmOrder.TradeSha,
      TimeStamp: confirmOrder.order.TimeStamp,
      MerchantOrderNo: confirmOrder.order.MerchantOrderNo,
      PayerEmail: confirmOrder.order.Email,
    });
  };

  return (
    <div className="doubleCheckPage">
      DoubleConfirm
      <form action="">
        <input type="text" value={confirmOrder && confirmOrder.MerchantID} />
        <input
          type="text"
          value={confirmOrder && confirmOrder.order.shaEncrypt}
        />
        <input
          type="text"
          value={confirmOrder && confirmOrder.order.aesEncrypt}
        />
        <input
          type="text"
          value={confirmOrder && confirmOrder.order.TimeStamp}
        />
        <input type="text" value={confirmOrder && confirmOrder.Version} />
        <input type="text" value={confirmOrder && confirmOrder.NotifyUrl} />
        <input type="text" value={confirmOrder && confirmOrder.ReturnUrl} />
        <input type="text" value={confirmOrder && confirmOrder.order.orderNo} />
        <input type="text" value={confirmOrder && confirmOrder.order.price} />
        <input type="text" value={confirmOrder && confirmOrder.ReturnUrl} />
      </form>
      <button onClick={handleSubmit}>submit</button>
    </div>
  );
};

export default DoubleConfirm;

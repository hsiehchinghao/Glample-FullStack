import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const Layout = ({
  currentUser,
  setCurrentUser,
  shopItems,
  setShopItems,
  shopCount,
  setShopCount,
  currentSub,
  setCurrentSub,
  setSearchContent,
  searchContent,
}) => {
  return (
    <div className="main">
      <Nav
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        shopItems={shopItems}
        setShopItems={setShopItems}
        shopCount={shopCount}
        setShopCount={setShopCount}
        currentSub={currentSub}
        setCurrentSub={setCurrentSub}
        searchContent={searchContent}
        setSearchContent={setSearchContent}
      />
      <Outlet
        context={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}
      />
      <Footer />
    </div>
  );
};

export default Layout;

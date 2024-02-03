import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const Layout = ({ currentUser, setCurrentUser }) => {
  return (
    <div className="main">
      <Nav currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Outlet
        context={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}
      />
      <Footer />
    </div>
  );
};

export default Layout;

import React, { useState, useEffect, useRef } from "react";
import AuthService from "../services/AuthService";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import logo from "../logo-svg/logo.svg";
import search from "../svg/icons8-search (1).svg";

const Nav = ({ currentUser, setCurrentUser }) => {
  console.log("render~");
  const navigate = useNavigate();
  //解決google跳轉回來的問題
  useEffect(() => {
    if (AuthService.getCurrentUser()) {
      setCurrentUser(AuthService.getCurrentUser());
    }
    // determineColor(location.pathname);
  }, []);

  //不同Outlet 不同字體顏色
  // const location = useLocation();
  // let fontColor = determineColor(location.pathname);
  // function determineColor(pathname) {
  //   if (pathname == "/" || pathname == "/profile") {
  //     return "#eeeeeeee";
  //   } else {
  //     return "#ccc";
  //   }
  // }

  // const handleColorBk = (e) => {
  //   e.target.style.color = "#000";
  //   if (e.target.style.border) {
  //     e.target.style.border = "5px #000 solid";
  //   }
  // };
  // const handleColorWt = (e) => {
  //   e.target.style.color = fontColor;
  //   if (e.target.style.border) {
  //     e.target.style.border = `5px ${fontColor} solid`;
  //   }
  // };

  //監聽滾動
  const [nav, setNav] = useState(true);
  const [scrollData, setScrollData] = useState({ Y: 0, lastY: 0 });
  useEffect(() => {
    const handleScroll = (e) => {
      if (window.scrollY == 0) {
        setNav(true);
      }
      scrollData.Y = window.scrollY;
      setScrollData((prev) => {
        scrollData.lastY = prev.Y;
        return { Y: window.scrollY, lastY: prev.Y };
      });
      // console.log(window.scrollY);
      if (window.scrollY >= 0) {
        if (window.scrollY - scrollData.lastY > 0) {
          setNav(false);
        } else {
          if (window.scrollY == 0) {
            setNav(true);
          } else {
            setNav(true);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    //卸載時執行
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //選單開關
  const navBarListRef = useRef(null);
  const handleCLoseNav = () => {
    if (navBarListRef.current) {
      navBarListRef.current.style.transform = "translateX(100%)";
    }
  };
  const handleOpenNav = () => {
    if (navBarListRef.current) {
      navBarListRef.current.style.transform = "translateX(0)";
    }
  };
  //加載首頁
  const handleToHomePage = () => {
    navigate("/");
    window.location.reload();
    window.scrollTo(0, 0);
  };
  //登出按鈕
  const handleLogout = () => {
    window.alert("Logout");
    AuthService.logout();
    setCurrentUser(null); //觸發currentUser判斷
    handleCLoseNav();
  };

  return (
    <>
      <div className={nav ? "navSection " : "navSection shrinkNavSection "}>
        <nav className="navBar">
          <Link to="/" onClick={handleToHomePage}>
            <div className="logoSection">
              <div className="logo">
                <img src={logo} alt="logo" />
              </div>
              <div className="logoWord">Glample.</div>
            </div>
          </Link>
          <div className="flexEnd">
            <div className="searchBar">
              <div className="searchlogo">
                <img src={search} alt="searchlogo" />
              </div>
              <input type="text" placeholder="search" />
            </div>
            <div className="menuBtn" onClick={handleOpenNav}>
              Menu
            </div>
            <div
              className="navBarList"
              ref={navBarListRef}
              style={{ textDecoration: "none" }}
            >
              <div className="navBarListBanner">
                <Link className="navBarListBannerLogo" to="/">
                  <div className="naBarListBannerLogo"> Glample.</div>
                </Link>
                <div className="navBarListClose" onClick={handleCLoseNav}>
                  X
                </div>
              </div>
              {currentUser && currentUser.role == "instructor" && (
                <Link
                  className="navBarListOption"
                  to="/post"
                  onClick={handleCLoseNav}
                >
                  Add Post
                </Link>
              )}
              {!currentUser && (
                <Link
                  className="navBarListOption"
                  to="/login"
                  onClick={handleCLoseNav}
                >
                  Login
                </Link>
              )}
              {currentUser && (
                <Link
                  className="navBarListOption"
                  to="/profile"
                  onClick={handleCLoseNav}
                >
                  Profile
                </Link>
              )}

              {currentUser && (
                <Link
                  className="navBarListOption"
                  onClick={handleLogout}
                  to="/"
                >
                  Logout
                </Link>
              )}

              {!currentUser && (
                <Link
                  className="navBarListOption"
                  to="/register"
                  onClick={handleCLoseNav}
                >
                  signup
                </Link>
              )}

              <Link
                className="navBarListOption"
                to="/"
                onClick={handleCLoseNav}
              >
                About Us
              </Link>
              <div className="navBarSubBanner">
                グラン
                <br />
                プル
              </div>
            </div>
          </div>
        </nav>
        <div className="padSearchBar">
          <div className="searchlogo">
            <img src={search} alt="searchlogo" />
          </div>
          <input type="text" placeholder="search" />
        </div>
        <ul className="categoryList">
          <Link>
            <li
            // style={{ color: fontColor }}
            // onMouseEnter={handleColorBk}
            // onMouseLeave={handleColorWt}
            >
              FASHION
            </li>
          </Link>
          <Link>
            <li
            // style={{ color: fontColor }}
            // onMouseEnter={handleColorBk}
            // onMouseLeave={handleColorWt}
            >
              MOVIE
            </li>
          </Link>
          <Link>
            <li
            // style={{ color: fontColor }}
            // onMouseEnter={handleColorBk}
            // onMouseLeave={handleColorWt}
            >
              MUSIC
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default Nav;

import React, { useState, useEffect, useRef } from "react";
import AuthService from "../services/AuthService";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import logo from "../logo-svg/logo.svg";
import search from "../svg/icons8-search (1).svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import PostService from "../services/PostService";
import deletePostIcon from "../svg/trash.svg";

const Nav = ({
  currentUser,
  setCurrentUser,
  shopItems,
  setShopItems,
  shopCount,
  setShopCount,
}) => {
  const API_URL = "http://localhost:8081";
  console.log("render~");
  const navigate = useNavigate();

  const shopListRef = useRef(null);
  const shopListItemsRef = useRef(null);
  const shopCartAddRef = useRef(null);

  //解決google跳轉回來的問題
  useEffect(() => {
    if (AuthService.getCurrentUser()) {
      setCurrentUser(AuthService.getCurrentUser());
    }
  }, []);

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
    //監聽螢幕尺寸，購物清單更動
    const handleShopListPosition = (e) => {
      if (window.innerWidth > 850) {
        if (shopListRef.current) {
          shopListRef.current.style.top = "138px";
        }
      } else {
        if (shopListRef.current) {
          shopListRef.current.style.top = "178px";
          shopListItemsRef.current.style.height = "380px";
        }
      }
      shopListRef.current.style.width = "0";
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleShopListPosition);

    if (shopListRef.current) {
      if (window.innerWidth > 850) {
        shopListRef.current.style.top = "138px";
      } else {
        shopListRef.current.style.top = "178px";
        shopListItemsRef.current.style.height = "380px";
      }
    }

    //卸載時執行
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleShopListPosition);
    };
  }, []);

  //監聽shopList更新
  useEffect(() => {
    setNav(() => {
      return true;
    });
    const shoppingCartContent = PostService.loadShoppingCart();
    console.log(shoppingCartContent);
    if (shoppingCartContent) {
      setShopItems(() => {
        return shoppingCartContent.order;
      });
    } else {
      setShopItems(null);
    }
  }, [shopCount]);

  //刪除shopList上的商品
  const removeProduct = (_id) => {
    PostService.removeShoppingCartItem(_id);
    if (!PostService.loadShoppingCart()) {
      setShopItems(null);
    }

    setShopCount((prev) => {
      return prev - 1;
    });
  };

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

  //購物清單開關
  const handleCloseShopList = () => {
    if (shopListRef.current) {
      shopListRef.current.style.width = "0";
    }
  };

  //打開購物清單
  const handleOpenShopList = (e) => {
    e.stopPropagation();
    if (shopListRef.current) {
      if (window.innerWidth > 850) {
        shopListRef.current.style.width = "50dvw";
      } else if (850 > window.innerWidth && window.innerWidth > 500) {
        shopListRef.current.style.width = "70dvw";
      } else {
        shopListRef.current.style.width = "100dvw";
      }
    }
  };

  //送出確認訂單
  const handleSubmitShopList = (e) => {
    shopListRef.current.style.width = "0";
    if (AuthService.getCurrentUser()) {
      navigate("/confirmOrder");
    } else {
      navigate("/login");
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
              className="shoppingCartDiv"
              onClick={handleOpenShopList}
              ref={shopCartAddRef}
            >
              <FontAwesomeIcon className="shoppingCart" icon={faShoppingCart} />
              {shopItems && (
                <div className="addItems">{shopItems && shopItems.length}</div>
              )}
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
                  ADD POST
                </Link>
              )}
              {currentUser && currentUser.role == "instructor" && (
                <Link
                  className="navBarListOption"
                  to="/addProduct"
                  onClick={handleCLoseNav}
                >
                  ADD MAG
                </Link>
              )}

              {!currentUser && (
                <Link
                  className="navBarListOption"
                  to="/login"
                  onClick={handleCLoseNav}
                >
                  LOGIN
                </Link>
              )}
              {currentUser && (
                <Link
                  className="navBarListOption"
                  to="/profile"
                  onClick={handleCLoseNav}
                >
                  PROFILE
                </Link>
              )}

              {!currentUser && (
                <Link
                  className="navBarListOption"
                  to="/register"
                  onClick={handleCLoseNav}
                >
                  SIGNUP
                </Link>
              )}

              <Link
                className="navBarListOption"
                to="/product"
                onClick={handleCLoseNav}
              >
                LET'S BUY
              </Link>

              {currentUser && (
                <Link
                  className="navBarListOption"
                  onClick={handleLogout}
                  to="/"
                >
                  LOGOUT
                </Link>
              )}

              <div className="navBarSubBanner">
                グラン
                <br />
                プル
              </div>
            </div>
            <div className="shopList" ref={shopListRef}>
              <div className="closeShopListBtn" onClick={handleCloseShopList}>
                X
              </div>
              <div className="shopListItems" ref={shopListItemsRef}>
                {!shopItems && <div className="stillEmpty">Still Empty</div>}
                {shopItems &&
                  shopItems.map((data) => {
                    return (
                      <>
                        <div className="shopListItem" key={data._id}>
                          <div className="deletePostBtn">
                            <img
                              src={deletePostIcon}
                              alt="delete content"
                              onClick={() => {
                                removeProduct(data._id);
                              }}
                            />
                          </div>
                          <div className="shopListItemImg">
                            <img src={`${API_URL}${data.image}`} alt="" />
                          </div>
                          <div className="shopListItemTitleAndPrice">
                            <p className="shopListItemTitle">{data.title}</p>
                            <p className="shopListItemPrice">
                              Price:{data.price}NTD
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
              {shopItems && PostService.loadShoppingCart() && (
                <>
                  <div className="orderTotal">
                    Total Price : ${PostService.loadShoppingCart().price}NTD
                  </div>
                  <div className="checkoutBtn" onClick={handleSubmitShopList}>
                    CHECKOUT!
                  </div>
                </>
              )}
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
            <li>FASHION</li>
          </Link>
          <Link>
            <li>MOVIE</li>
          </Link>
          <Link>
            <li>MUSIC</li>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default Nav;

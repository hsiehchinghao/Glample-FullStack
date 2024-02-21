import "./style/style.css";
import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AuthService from "./services/AuthService";
import Homepage from "./components/Homepage";
import Layout from "./Layout";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import Category from "./components/Category";
import PostPage from "./components/PostPage";
import Edit from "./components/Edit";
import AddPost from "./components/AddPost";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import ProductPage from "./components/ProductPage";
import ConfirmOrder from "./components/ConfirmOrder";
import DoubleConfirm from "./components/DoubleConfirm";
import AllPosts from "./components/AllPosts";

function App() {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [shopItems, setShopItems] = useState(null);
  const [shopCount, setShopCount] = useState(0);
  const [confirmOrder, setConfirmOrder] = useState(null);
  const [currentSub, setCurrentSub] = useState(null);
  const [searchContent, setSearchContent] = useState(null);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
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
            }
          >
            <Route index element={<Homepage />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route
              path="profile"
              element={
                <Profile
                  setShopItems={setShopItems}
                  setShopCount={setShopCount}
                />
              }
            ></Route>
            <Route path="register" element={<Register />}></Route>
            <Route
              path="allPosts"
              element={<AllPosts searchContent={searchContent} />}
            ></Route>
            <Route
              path="allPosts/:search"
              element={<AllPosts searchContent={searchContent} />}
            ></Route>
            <Route path="post" element={<AddPost />}></Route>
            <Route path="editPost/:id" element={<Edit />}></Route>
            <Route
              path="category/:category"
              element={
                <Category
                  currentSub={currentSub}
                  setCurrentSub={setCurrentSub}
                />
              }
            ></Route>
            <Route path="post/:id" element={<PostPage />}></Route>
            <Route path="addProduct" element={<AddProduct />}></Route>
            <Route path="product" element={<ProductList />}></Route>
            <Route
              path="loadProduct/:id"
              element={
                <ProductPage
                  shopItems={shopItems}
                  setShopItems={setShopItems}
                  shopCount={shopCount}
                  setShopCount={setShopCount}
                />
              }
            ></Route>
            <Route
              path="confirmOrder"
              element={
                <ConfirmOrder
                  shopItems={shopItems}
                  setConfirmOrder={setConfirmOrder}
                />
              }
            ></Route>
            <Route
              path="doubleConfirm"
              element={
                <DoubleConfirm
                  shopItems={shopItems}
                  confirmOrder={confirmOrder}
                />
              }
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

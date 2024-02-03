import "./style/style.css";
import { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from "axios";
import AuthService from "./services/AuthService";
import Frontpage from "./pages/Frontpage";
import Homepage from "./components/Homepage";
import Layout from "./Layout";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import PostPage from "./components/PostPage";
// import Test from "./components/Test";
import AddPost from "./components/AddPost";
import Edit from "./components/Edit";
// import Test2 from "./components/Test2";
import Test3 from "./components/Test3";
function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
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
              />
            }
          >
            <Route index element={<Homepage />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="profile" element={<Profile />}></Route>
            <Route path="register" element={<Register />}></Route>
            <Route path="logout" element={<Logout />}></Route>
            <Route path="post" element={<AddPost />}></Route>
            <Route path="editPost/:id" element={<Edit />}></Route>
            <Route path="post/:id" element={<PostPage />}></Route>
            {/* <Route path="test2" element={<Test2 />}></Route> */}
            <Route path="test3" element={<Test3 />}></Route>
          </Route>
          {/* <Route path="/test" element={<Test />}></Route> */}
          <Route path="/addpost" element={<AddPost />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

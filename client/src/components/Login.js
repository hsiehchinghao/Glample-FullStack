import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AuthService from "../services/AuthService";
import googlelogo from "../svg/googlelogo.svg";

const Login = () => {
  let props = useOutletContext();
  const navigate = useNavigate();
  if (props.currentUser) {
    navigate("/profile");
  }
  useEffect(() => {
    if (props.currentUser) {
      alert("已經登入");
      navigate("/profile");
    }
  }, []);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    console.log(e.target.value);
    console.log(email);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      let result = await AuthService.login(email, password);
      console.log(result);
      AuthService.setUserInLocalByLocal(result); //response的資料存在localStorage
      props.setCurrentUser(AuthService.getCurrentUser()); //改變當下使用者
      navigate("/profile");
    } catch (e) {
      setMessage(e.response.data);
      console.log(e);
    }
  };

  return (
    <div className="loginComponent">
      <h1 className="loginTitle">Login</h1>
      {message && <h2 className="errorMsg">{message}</h2>}
      <form className="loginForm">
        <label htmlFor="email">email :</label>
        <input type="text" name="email" onChange={handleEmail} ref={emailRef} />
        <label htmlFor="password">password :</label>
        <input
          type="password"
          name="password"
          onChange={handlePassword}
          ref={passwordRef}
        />
        <button className="submitBtn" type="submit" onClick={handleLogin}>
          Login
        </button>
      </form>
      <div className="saperateLine">OR</div>
      <div className="googleBtn">
        <a
          className="googleLink"
          href="https://glample-mern-9b575194526d.herokuapp.com/api/auth/google"
        >
          <div className="googleIconWrapper">
            <img className="googleIcon" src={googlelogo} alt="googlesvg" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Login;

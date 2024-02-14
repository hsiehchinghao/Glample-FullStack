import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AuthService from "../services/AuthService";
import googlelogo from "../svg/googlelogo.svg";

const Register = () => {
  let props = useOutletContext();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (props.currentUser) {
      alert("Already login");
      navigate("/profile");
    }
  }, []);

  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [authenticateCode, setAuthenticateCode] = useState("");
  let [message, setMessage] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleAuthenticateCode = (e) => {
    setAuthenticateCode(e.target.value);
  };

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      let result = await AuthService.register(
        username,
        email,
        password,
        authenticateCode
      );
      alert(result.data.msg);
      console.log(result.data); //使用者資訊
      console.log("前往登入頁面");
      navigate("/login");
    } catch (e) {
      console.log(e);
      e.response.data ? setMessage(e.response.data.msg) : setMessage("error");
    }
  };

  return (
    <div className="signUpPage">
      <h1 className="signUpTitle">SIGNUP</h1>
      {message && <div className="errorMsg">{message}</div>}
      <form className="signUpForm ">
        <label htmlFor="username">username :</label>
        <input type="text" name="username" onChange={handleUsername} />
        <label htmlFor="email">email :</label>
        <input type="text" name="email" onChange={handleEmail} />
        <label htmlFor="password">password :</label>
        <input type="password" name="password" onChange={handlePassword} />
        <div className="checkInstructorDiv">
          <label htmlFor="checkInstructor">for instructor</label>
          <input id="checkToSwitch" type="checkbox" name="checkInstructor" />

          <label htmlFor="authenticateCode" className="hideInstructorCode">
            instructor authenticate :
          </label>
          <input
            className="hideInstructorCode"
            type="password"
            name="authenticateCode"
            onChange={handleAuthenticateCode}
          />
        </div>

        <button
          className="submitBtn"
          type="submit"
          style={{ marginTop: "20px" }}
          onClick={handleRegister}
        >
          submit
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
          <p>LOGIN BY GOOGLE</p>
        </a>
      </div>
    </div>
  );
};

export default Register;

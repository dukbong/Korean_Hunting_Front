import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useHistory 대신 useNavigate 사용
import axios from "axios";
import useUserStore from './useUserStore'; // useUserStore 불러오기
import "./css/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useUserStore();
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = () => {
    if(!(username && password)){
      alert("로그인에 실패하였습니다.");
      return;
    }
    axios
      .post("/login", { userId: username, userPwd: password })
      .then((response) => {
        const token = response.data.accessToken;
        if (token) {
          localStorage.setItem("token", token);
          setUserId(username);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          alert(error.response.data.message);
        } else {
          alert("로그인 중 오류가 발생했습니다.");
        }
      });
  };

  const handleSignup = () => {
    navigate("/join");
  };

  return (
    <div className="login-container">
      <h2 className="login-heading">Login</h2>
      <form>
        <div className="login-input">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ID"
          />
        </div>
        <div className="login-input">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
          />
        </div>
        <button type="button" onClick={handleLogin} className="login-button">
          로그인
        </button>
        <button type="button" onClick={handleSignup} className="signup-button">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Login;

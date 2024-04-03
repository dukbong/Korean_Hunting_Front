import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useHistory 대신 useNavigate 사용
import axios from "axios";
import useUserStore from './useUserStore'; // useUserStore 불러오기
import "./css/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const { setUserId } = useUserStore();
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    // URL에서 코드 추출
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");
    if (codeParam) {
      // 추출된 코드를 상태에 설정
      setCode(codeParam);
    }
  }, []);

  useEffect(() => {
    // 코드가 설정되면 서버에 전송
    // alert("code = " + code);
    if (code) {
      axios.post("/githubcallback", { code })
        .then((res) => {
          // alert(res.headers.authorization);
          console.log(res);
          const token = res.headers.authorization;
        if (token) {
          localStorage.setItem("token", token.substring(7));
          setUserId(res.data.userId);
          navigate("/dashboard");
        }
        })
        .catch((error) => {
          console.error("Error sending code to server:", error);
        });
    }
  }, [code, navigate]);

  const handleLogin = () => {
    if(!(username && password)){
      alert("로그인에 실패하였습니다.");
      return;
    }
    axios
      .post("/login", { userId: username, userPwd: password })
      .then((response) => {
        const token = response.headers.authorization;
        if (token) {
          localStorage.setItem("token", token.substring(7));
          setUserId(username);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        if (
          error.response && error.response.data && error.response.data.message
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

  const githubhandleLogin = () => {
    axios.get("/githublogin")
    .then((res) => {
      console.log(res);
      let data = res.data;
      window.location.href = data.githubAuthUrl;
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return (
    <div className="login-main">
    <div className="login-container">
      <h2 className="login-heading">LOGIN</h2>
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
        <button type="button" onClick={githubhandleLogin} className="github-button">
          <div className="github-div">
            <img src="/image/github-mark-white.png" alt="Github Login" />
            GitHub 로그인
          </div>
        </button>
        <button type="button" onClick={handleLogin} className="login-button">
          로그인
        </button>
        <button type="button" onClick={handleSignup} className="signup-button">
          회원가입
        </button>
      </form>
    </div>
    </div>
  );
};

export default Login;

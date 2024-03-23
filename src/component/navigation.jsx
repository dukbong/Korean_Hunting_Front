import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "./useUserStore"; // useUserStore 불러오기
// import axios from "axios";
import axiosInstance from "./apiIntercepter";
import "./css/navigation.css";

const Navigation = () => {
  const { userId, setUserId } = useUserStore();
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용
  const location = useLocation();

  // 현재 경로가 로그인 또는 회원가입 페이지인지 확인
  const isLoginPage = location.pathname === "/login";
  const isJoinPage = location.pathname === "/join";

  // 로그인 상태 확인
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
      const token = localStorage.getItem("token");
      axiosInstance
        .get("/logout", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setUserId("");
          navigate("/login");
        })
        .catch((err) => {
          console.log("error!");
        });
  };

  const handleMain = () => {
    navigate("/dashboard");
  };

  const handleGit = () => {
    const githubUrl = "https://github.com/dukbong/Korean_Hunting_Back";
    window.open(githubUrl, "_blank");
  };

  const handleUserIdClick = () => {
    navigate("/info");
  };

  if (isAuthenticated && !isLoginPage && !isJoinPage) {
    return (
      <nav className="nav-container">
        <div className="left-content">
          <img id="logoimg" onClick={handleMain} src={process.env.PUBLIC_URL + '/image/applogo2.png'} alt="앱 로고" width={370} height={50} />
        </div>
        <div className="right-content">
          <ul>
          <img id="gitimg" onClick={handleGit} src={process.env.PUBLIC_URL + '/image/github.png'} alt="깃허브 로고" width={24} height={24} />
            <li>
              <span onClick={handleUserIdClick}><button>{userId}</button></span>
              <button onClick={handleLogout}>| Logout</button>
            </li>
          </ul>
        </div>
      </nav>
    );
  } else {
    return null;
  }
};

export default Navigation;

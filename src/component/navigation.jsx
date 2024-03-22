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

  const handleUserIdClick = () => {
    navigate("/info");
  };

  if (isAuthenticated && !isLoginPage && !isJoinPage) {
    return (
      <nav className="nav-container">
        <div className="left-content" onClick={handleMain}>
          <span>Korean Hunting</span>
        </div>
        <div className="right-content">
          <ul>
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

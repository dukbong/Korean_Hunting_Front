import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "./useUserStore"; // useUserStore 불러오기
import axios from "axios";
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
      axios
        .get("/logout", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          console.log("logout!");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setUserId("");
          navigate("/login");
        })
        .catch((err) => {
          console.log("error!");
        });
  };

  if (isAuthenticated && !isLoginPage && !isJoinPage) {
    return (
      <nav className="nav-container">
        <div className="left-content">
          <span>Korean Hunting</span>
        </div>
        <div className="right-content">
          <ul>
            <li>
              <span>{userId}</span>
            </li>
            <li>
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

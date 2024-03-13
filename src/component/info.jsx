import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./apiIntercepter";
import './css/info.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null); // 유저 정보 상태
  const [errorMsg, setErrorMsg] = useState(""); // 유저 정보 상태
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      axiosInstance
        .get("/info", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUserInfo(response.data);
        })
        .catch((error) => {
          console.log(error);
          setErrorMsg(
            "정보를 불러오는데 실패했습니다. 다시 시도해주시기 바랍니다."
          );
        });
    }
  }, [navigate]);

  return (
    <div className="jenkins-user-info-container">
      {userInfo ? (
        <div>
          <h2 className="jenkins-user-info-heading">회원 정보</h2>
          <table className="jenkins-user-info-table">
            <tbody>
              <tr>
                <td>Username:</td>
                <td>{userInfo.userId}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{userInfo.email}</td>
              </tr>
              <tr>
                <td>Company:</td>
                <td>{userInfo.company}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>{errorMsg}</p>
      )}
    </div>
  );
};

export default UserInfo;

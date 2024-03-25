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
          if(error.response.status === 401){
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/login");
          }else{
            setErrorMsg(
              "정보를 불러오는데 실패했습니다. 다시 시도해주시기 바랍니다."
            );
          }
        });
    }
  }, [navigate]);

  const createApiToken = () => {

    const formData = new FormData();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem("token");
    formData.append("userId", userId);
    axiosInstance
      .get("/crateApi", { headers: { Authorization: `Bearer ${token}` }, params: { userId: userId } })
      .then((res) => {
        console.log(res);
      });
  }


  const copyToken = () => {
    navigator.clipboard.writeText(userInfo.apiToken)
      .then(() => {
        alert("토큰이 복사되었습니다!");
      })
      .catch((error) => {
        console.error("토큰 복사 실패:", error);
      });
  };
  return (
    <div className="userInfo-main">
      {userInfo ? (
        <div>
          <div className="user-info">
              <div className="user-info-id">
                <h3>WelCome! {userInfo.userId}</h3>
              </div>
              <div className="user-info-email">
                <h3>Email</h3>
                <h3>{userInfo.email}</h3>
              </div>
              <div className="user-info-company">
                <h3>Company</h3>
                <h3>{userInfo.company}</h3>
              </div>
          </div>
          <div>
            <h3>개인 API인증키</h3>
            <p>인증키의 유효기간은 7일 입니다.</p>
            <table>
              <tr>
                <td>
                  구분
                </td>
                <td>
                  발급일자
                </td>
                <td>
                  인증키
                </td>
              </tr>
              <tr>
                <td>일반</td>
                <td>{userInfo.issuance}</td>
                <td>
                  <span onClick={copyToken}>
                      {userInfo.apiToken.length > 20
                        ? userInfo.apiToken.substring(0, 20) + "..."
                        : userInfo.apiToken}
                  </span>
                  <button onclick={createApiToken}>Issuance</button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      ) : (
        <p>{errorMsg}</p>
      )}
    </div>
  );
};

export default UserInfo;

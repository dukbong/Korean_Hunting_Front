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
          console.log(response.data);
          setUserInfo(response.data);
        })
        .catch((error) => {
          if(error.response?.status === 401){
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
      .get("/createApi", { headers: { Authorization: `Bearer ${token}` }, params: { userId: userId } })
      .then((res) => {
        console.log(res);
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          apiToken: res.data.apiToken,  // 반환된 데이터에서 apiToken 값을 가져와 업데이트
          issuanceTime: res.data.issuanceTime,
          tokenExpiresIn: res.data.tokenExpiresIn
        }));
        console.log(userInfo);
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

  const isButtonEnabled = userInfo && 
  (!userInfo.tokenExpiresIn || new Date(userInfo.tokenExpiresIn) <= new Date());

  return (
    <div className="userInfo-main">
      {userInfo ? (
        <div>
          <div className="user-info">
              <div className="user-info-id">
                <h3>WelCome!</h3>
              </div>
              <div className="user-info-email">
                <h3>Email</h3>
                <h3>{userInfo?.email}</h3>
              </div>
              <div className="user-info-company">
                <h3>Company</h3>
                <h3>{userInfo?.company}</h3>
              </div>
          </div>
          <div className="table-container">
            <h3>개인 API인증키</h3>
            <table>
              <thead>
              <tr>
                <th>
                  구분
                </th>
                <th>
                  발급일자
                </th>
                <th>
                  만료시간
                </th>
                <th>
                  인증키
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>일반</td>
                <td>{userInfo.issuanceTime}</td>
                <td>{userInfo.tokenExpiresIn}</td>
                <td>
                  <span onClick={copyToken}>
                      {userInfo.apiToken?.length > 20
                        ? userInfo.apiToken?.substring(0, 20) + "..."
                        : userInfo.apiToken}
                  </span>
                  <button className="info-button" onClick={createApiToken} disabled={!isButtonEnabled}>Issuance</button>
                </td>
              </tr>
              </tbody>
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

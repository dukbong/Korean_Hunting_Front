import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./apiIntercepter";
import './css/info.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null); // 유저 정보 상태
  const [buildHistory, setBuildHistory] = useState(null); // 프로젝트 빌드 히스토리 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태
  const [selectedTab, setSelectedTab] = useState("apiToken"); // 선택된 탭 상태
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }else{
      document.getElementById("userApi").click();
    }
  }, [navigate]);

  const userApiPage = () => {
    const token = localStorage.getItem("token");
    axiosInstance
    .get("/info", { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      // console.log(response.data);
      setUserInfo(response.data);
    })
    .catch((error) => {
      if(error.response?.status === 401){
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      }
    });
  }

  const createApiToken = () => {
    const formData = new FormData();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem("token");
    formData.append("userId", userId);
    axiosInstance
      .get("/createApi", { headers: { Authorization: `Bearer ${token}` }, params: { userId: userId } })
      .then((res) => {
        // console.log(res);
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          apiToken: res.data.apiToken,  // 반환된 데이터에서 apiToken 값을 가져와 업데이트
          issuanceTime: res.data.issuanceTime,
          tokenExpiresIn: res.data.tokenExpiresIn
        }));
        // console.log(userInfo);
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

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    if (tab === "projectHistory") {
      projectBuildHistory(1); // 첫 번째 페이지로 데이터 요청
    } else {
      userApiPage();
    }
  };

  const projectBuildHistory = (pageNumber) => {
    setCurrentPage(pageNumber); // 현재 페이지 번호 업데이트
    const token = localStorage.getItem("token");
    axiosInstance
      .get(`/buildHistory?page=${pageNumber}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        // console.log(response.data);
        setBuildHistory(response.data.content); // 서버에서 받은 페이지별 데이터를 상태에 설정
        setTotalPages(response.data.totalPages);
      });
  };

  // 페이지 번호를 클릭하여 해당 페이지 데이터 요청
  const handleClickPage = (pageNumber) => {
    projectBuildHistory(pageNumber);
  };

  // 다음 페이지로 이동하는 함수
  const nextPage = () => {
    const nextPageNumber = currentPage + 1;
    setCurrentPage(nextPageNumber); // 다음 페이지로 이동
    projectBuildHistory(nextPageNumber); // 다음 페이지의 데이터 가져오기
  };
  
  // 이전 페이지로 이동하는 함수
  const prevPage = () => {
    const prevPageNumber = currentPage - 1;
    setCurrentPage(prevPageNumber); // 이전 페이지로 이동
    projectBuildHistory(prevPageNumber); // 이전 페이지의 데이터 가져오기
  };

  return (
    <div className="userInfo-main">
      <div className="left-container">
        <div id="userApi" className={`tab ${selectedTab === "apiToken" ? "active" : ""}`} onClick={() => handleTabClick("apiToken")}>
          개인 API 인증키 발급
        </div>
        <div className={`tab ${selectedTab === "projectHistory" ? "active" : ""}`} onClick={() => handleTabClick("projectHistory")}>
          Project Build History
        </div>
      </div>
      <div className="right-container">
        {selectedTab === "apiToken" && userInfo && (
          <div className="table-container">
            <h3>개인 API 인증키</h3>
            <table>
              <tbody>
                <tr>
                  <th>발급일자</th>
                  <th>만료시간</th>
                  <th>개인 API 인증키</th>
                </tr>
                <tr>
                  <td>{userInfo.issuanceTime}</td>
                  <td>{userInfo.tokenExpiresIn}</td>
                  <td>
                    <span onClick={copyToken}>
                      {userInfo.apiToken?.length > 20
                        ? userInfo.apiToken?.substring(0, 20) + "..."
                        : userInfo.apiToken}
                    </span>
                    <button className="info-button" onClick={createApiToken} disabled={!isButtonEnabled}>발급</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {selectedTab === "projectHistory" && buildHistory && (
          <div className="table-container">
            <h3>Project Build History</h3>
                        {/* 페이지 이동 버튼 */}
                        <div className="pagination-container">
                          <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button"><img src={process.env.PUBLIC_URL + '/image/left.png'} alt="이전"></img></button>
                          {[...Array(totalPages)].map((_, index) => (
                           <button key={index + 1} onClick={() => handleClickPage(index + 1)} className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}>{index + 1}</button>
                          ))}
                          <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-button"><img src={process.env.PUBLIC_URL + '/image/right.png'} alt="다음"></img></button>
                        </div>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Project Name</th>
                  <th>Build Time</th>
                  <th>Status</th>
                </tr> 
              </thead>
              <tbody>
                {buildHistory.map((build, index) => (
                  <tr key={index} className={build.status ? "success-status" : "failure-status"}>
                    <td>{build.id}</td>
                    <td>{build.projectName}</td>
                    <td>{build.buildTime}</td>
                    <td>{build.status ? 'SUCCESS' : 'FAILURE'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
        {selectedTab === "projectHistory" && !buildHistory && (
          <div className="table-container">
            <p>NOT FOUND BUILD HISTORY</p>
          </div>
        )}    
      </div>
    </div>
  );
};

export default UserInfo;

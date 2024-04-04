import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./apiIntercepter";
import './css/info.css';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null); // 유저 정보 상태
  const [buildHistory, setBuildHistory] = useState(null); // 프로젝트 빌드 히스토리 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호 상태
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태
  const [selectedTab, setSelectedTab] = useState("apiToken"); // 선택된 탭 상태
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용
  const MAX_PAGE_BUTTONS = 10; // 페이지바에 표시되는 최대 버튼 수
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
        console.log(response.data);
        setBuildHistory(response.data.content); // 서버에서 받은 페이지별 데이터를 상태에 설정
        setTotalPages(response.data.totalPages);
      });
  };

  // 페이지 번호를 클릭하여 해당 페이지 데이터 요청
  const handleClickPage = (pageNumber) => {
    projectBuildHistory(pageNumber);
  };

  const renderPageButtons = () => {
    const buttons = [];
    const startPage = Math.floor((currentPage - 1) / MAX_PAGE_BUTTONS) * MAX_PAGE_BUTTONS + 1; // 현재 페이지가 속한 페이지 그룹의 시작 페이지 계산
    const endPage = Math.min(startPage + MAX_PAGE_BUTTONS - 1, totalPages); // 페이지 그룹의 끝 페이지 계산
    const nextPageButton = document.getElementById("nextPage");

    if (nextPageButton) {
      if (endPage === totalPages) {
        nextPageButton.setAttribute("disabled", "disabled");
      } else {
        nextPageButton.removeAttribute("disabled");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handleClickPage(i)}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }
  
    return buttons;
  };

  // 다음 페이지로 이동하는 함수
  const prevPage = () => {
    const prevStartPage = Math.min(1, Math.ceil(currentPage / MAX_PAGE_BUTTONS) * MAX_PAGE_BUTTONS - MAX_PAGE_BUTTONS);
    setCurrentPage(prevStartPage);
    projectBuildHistory(prevStartPage);
  };
  
  
  const nextPage = () => {
    const nextStartPage = Math.ceil(currentPage / MAX_PAGE_BUTTONS) * MAX_PAGE_BUTTONS + 1;
    setCurrentPage(nextStartPage);
    projectBuildHistory(nextStartPage);
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
                    <span onClick={copyToken} style={{ cursor: "pointer" }}>
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
            {totalPages !== 0 && (
                <div className="pagination-container">
                <button id="prevPage" onClick={prevPage} disabled={currentPage <= MAX_PAGE_BUTTONS} className="pagination-button">
                  <img src={process.env.PUBLIC_URL + '/image/left.png'} alt="이전"></img>
                </button>
                {renderPageButtons()}
                <button id="nextPage" onClick={nextPage} className="pagination-button">
                  <img src={process.env.PUBLIC_URL + '/image/right.png'} alt="다음"></img>
                </button>
              </div>
            )}

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
                {totalPages !== 0 && buildHistory.map((build, index) => (
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

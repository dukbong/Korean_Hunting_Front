import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/dashboard.css';
import adImage from './image/test.jpg';
import axiosInstance from "./apiIntercepter";

function DashBoard() {

  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]); 

  const [file, setFile] = useState(null);
  const [modifyDate, setModifyDate] = useState("");
  const [directory, setDirectory] = useState("");
  // 파일 선택 시 실행되는 함수
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if(selectedFile){
      DateConvertString(selectedFile.lastModifiedDate);
    }else{
      setModifyDate("");
    }
  };

  // 파일의 마지막 수정 시간
  const DateConvertString = (fileDate) =>{
    const fileModifyDate = fileDate;
    const date = new Date(fileModifyDate);
    const koreaOffset = 9 * 60 * 60 * 1000; // 한국 표준시는 GMT+9
    date.setTime(date.getTime() + koreaOffset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth()는 0부터 시작하므로 1을 더하고, 두 자리 숫자로 만듭니다.
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    setModifyDate(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
  };

  // 파일 업로드 시 실행되는 함수
  const handleUpload = () => {
    if (file) {
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      axiosInstance.post("/file/upload", formData, {
        headers : {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        console.log(convertToHierarchy(res.data.directory));
        setDirectory(res.data.directory);
      })
      .catch((err) => {
        console.log(err);
      })
    } else {
      alert("파일을 선택해주세요.");
    }
  };

  // 계층으로 표현하기 위한 함수... 아직 작성중.
  function convertToHierarchy(data) {
    const hierarchy = [];
  
    data.forEach((item) => {
      const parts = item.split("\\");
      let currentLevel = hierarchy;
  
      parts.forEach((part, index) => {
        const existingPath = currentLevel.find((node) => node.name === part);
        if (existingPath) {
          currentLevel = existingPath.children;
        } else {
          const newNode = { name: part, children: [] };
          currentLevel.push(newNode);
          currentLevel = newNode.children;
        }
  
        if (index === parts.length - 1) {
          currentLevel.push({ name: part, type: "file" });
        }
      });
    });
  
    return hierarchy;
  }

  return (
    <div>
      <h1>Code에 숨은 한글 찾기</h1>
      <div className="dashboard-container">
        <div className="file-upload-container">
          <div className='file file--upload'>
            <label htmlFor='input-file' className="upload-label">
            <i className="fa-regular fa-cloud-arrow-down" style={{ color: '#ffffff' }}></i>File Upload
            </label>
            <input id='input-file' type="file" onChange={handleFileChange} accept=".zip" />
          </div>
          {file && (
            <div>
              <p className="file-info">Name : {file?.name}</p>
              <p className="file-info">Modify Date : {modifyDate}</p>
              <button className="upload-button" onClick={handleUpload}>SEARCH</button>
            </div>
          )}
        </div>
        <div className="scroll-container">
          <div className="content">
            {directory && directory.length > 0 ? (
              directory.map((item, index) => (
                <p key={index} className={item.endsWith('_$INSERT') ? 'red' : ''}> - {item.endsWith('_$INSERT') ? item.slice(0, -8) : item}</p>
              ))
            ) : (
              null
            )}
          </div>
        </div>
      </div>
      <div className="ads">
        <img src={adImage} alt="광고" className="ad-image" />
      </div>
    </div>
  );
}

export default DashBoard;

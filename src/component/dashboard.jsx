import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/dashboard.css';
import adImage from './image/test.jpg';
import axios from "axios";

function DashBoard() {

  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]); 

  const [file, setFile] = useState(null);

  // 파일 선택 시 실행되는 함수
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // 파일 업로드 시 실행되는 함수
  const handleUpload = () => {
    if (file) {
      console.log("Uploading file:", file);
    } else {
      alert("파일을 선택해주세요.");
    }
  };

  return (
    <div>
      <div className="dashboard-container">
        <div className="file-upload-container">
        <label htmlFor="file-upload">SEND FILE : </label>
          <input type="file" onChange={handleFileChange} accept=".zip" />
          <button onClick={handleUpload}>파일 업로드</button>
        </div>
        <div className="scroll-container">
          <div className="content">

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

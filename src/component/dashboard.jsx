import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/dashboard.css';
import axiosInstance from "./apiIntercepter";
import Modal from "./modal"; // Modal 컴포넌트 임포트
// import DisplayAds from "./displayads";

function DashBoard() {

  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [file, setFile] = useState(null);
  const [directory, setDirectory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extractionStrategyType, setExtractionStrategyType] = useState("EXTRACTION_KOREAN");

  // 파일 선택 시 실행되는 함수
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);

    if(selectedFile.size > 314572800){
      alert("최대 용량은 300MB 입니다.");
      setDirectory("");
      return;
    }

    setFile(selectedFile);
    if (!selectedFile) {
      setDirectory("");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 파일 업로드 시 실행되는 함수
  const handleUpload = () => {
    if (file) {
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("extractionStrategyType", extractionStrategyType);

      const token = localStorage.getItem("token");

      axiosInstance.post("/file/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          const hierarchy = convertToHierarchy(res.data.directory);
          setDirectory(hierarchy);

          console.log(hierarchy);
          if (res.data.content) {
            const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
            const decodedContent = decodeContent(res.data.content);
            saveContentToFile(decodedContent, fileNameWithoutExtension + ".txt");
          } else {
            alert("다운 받을 파일이 없습니다.");
          }

          openModal();
        })
        .catch((err) => {
          console.log(err);
        })
    } else {
      alert("파일을 선택해주세요.");
    }
  };

  function decodeContent(encodedContent) {
    // Base64 디코딩
    const decodedContent = atob(encodedContent);
    // UTF-8 디코딩
    const decodedText = decodeURIComponent(escape(decodedContent));
    return decodedText;
  }

  function saveContentToFile(content, fileName) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }



  // 계층으로 표현하기 위한 함수
  const convertToHierarchy = (files) => {
    const hierarchy = {};

    files.forEach((filePath) => {
      const segments = filePath.split("\\");
      let currentLevel = hierarchy;

      segments.forEach((segment, index) => {
        if (!currentLevel[segment]) {
          currentLevel[segment] = {};
        }
        if (index === segments.length - 1) {
          currentLevel[segment] = filePath; // 마지막 세그먼트에 파일 경로 할당
        } else {
          currentLevel = currentLevel[segment];
        }
      });
    });

    return hierarchy;
  };

  const generateHierarchyKeys = (hierarchy, level = 0, parentName = "") => {
    let result = [];

    // 객체가 아닌 경우를 먼저 처리
    for (const key in hierarchy) {
      if (typeof hierarchy[key] !== "object") {
        const isLast = Object.keys(hierarchy).indexOf(key) === Object.keys(hierarchy).length - 1;
        const indentation = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'.repeat(level) + (parentName ? "* " + key : key);
        result.push(indentation + (isLast ? "" : "\n"));
        delete hierarchy[key]; // 처리된 항목은 삭제하여 나중에 객체를 처리할 때 중복되지 않도록 함
      }
    }

    // 객체인 경우를 나중에 처리하여 하위 항목들을 표시
    for (const key in hierarchy) {
      const isObject = typeof hierarchy[key] === "object";
      const objectName = parentName ? parentName + " ─ " + key : key;
      const indentation = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'.repeat(level) + objectName;

      result.push(indentation + "\n");

      if (isObject) {
        const childLines = generateHierarchyKeys(hierarchy[key], level + 1, objectName);
        result = result.concat(childLines);
      }
    }

    return result;
  };

  return (
    <div className="dashMain">
    <div className="container">
      <div className="image-container">
        <img src={process.env.PUBLIC_URL + '/image/applogo.png'} alt="앱 로고" width={370} height={50} />
        <p>소스 코드를 탐색하며 결과를 알려드립니다.</p>
      </div>
      <div className="dashboard-container">
        <div className="file-upload-container">
          <div className='file file--upload'>
            <label htmlFor='input-file' className="upload-label">
              <i className="fa-regular fa-cloud-arrow-down" style={{ color: '#ffffff' }}></i>File Upload
            </label>
            <input id='input-file' type="file" onChange={handleFileChange} accept=".zip, .jar" />
          </div>
          {file && (
            <div>
              <p className="file-info">{file?.name}</p>
              <div>
                <span>Condition : </span>
                <select className="custom-select" value={extractionStrategyType} onChange={(e) => setExtractionStrategyType(e.target.value)}>
                  <option value="EXTRACTION_KOREAN">Korean</option>
                  <option value="EXTRACTION_TAG">TagText</option>
                </select>
              </div>
              <button className="upload-button" onClick={handleUpload}>SEARCH</button>
            </div>
          )}
        </div>
        
        {/* 모달 */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="scroll-container">
            <div className="content">
              {directory ? (
                <ul className="tree">
                  {generateHierarchyKeys(directory).map((key, index) => {
                    const isInsert = key.trim().endsWith("_$INSERT"); // _$INSERT 여부 확인
                    const displayKey = key.replace("_$INSERT", ""); // _$INSERT 제거
                    return (
                      <li key={index} className={`tree-node ${isInsert ? 'insert' : ''}`}>
                        <span className="node">{displayKey}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                null
              )}
            </div>
          </div>
        </Modal>
      
      </div>
    </div>
            {/* <div className="ads">
              <DisplayAds />
            </div>  */}
    </div>
  );
}

export default DashBoard;

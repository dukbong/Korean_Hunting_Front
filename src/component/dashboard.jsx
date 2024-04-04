import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/dashboard.css';
import axiosInstance from "./apiIntercepter";
import Modal from "./modal"; // Modal 컴포넌트 임포트

function DashBoard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const [file, setFile] = useState(null);
  const [directory, setDirectory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extractionStrategyType, setExtractionStrategyType] = useState("EXTRACTION_KOREAN");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);

    if (selectedFile.size > 314572800) {
      alert("최대 용량은 300MB 입니다.");
      setDirectory([]);
      return;
    }

    setFile(selectedFile);
    if (!selectedFile) {
      setDirectory([]);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
          const hierarchy = convertToHierarchy(res.data.directory) || [];
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

  function convertToHierarchy(directory) {
    const hierarchy = {};
    directory.forEach(dir => {
      const pathElements = dir.split('/');
      let currentLevel = hierarchy;
      pathElements.forEach(element => {
        if (!currentLevel[element]) {
          currentLevel[element] = {};
        }
        currentLevel = currentLevel[element];
      });
    });
    return hierarchy;
  }

  function decodeContent(encodedContent) {
    const decodedContent = atob(encodedContent);
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
              <div className="modal-content">
                {renderHierarchy(directory)}
              </div>
            </div>
          </Modal>

        </div>

      </div>
    </div>
  );
}

function renderHierarchy(hierarchy, level = 0) {
  return (
    <ul className="tree">
      {Object.keys(hierarchy).map((key, index) => {
        const isInsert = key.trim().endsWith("_$INSERT");
        const displayKey = isInsert ? key.replace("_$INSERT", "") : key;
        return (
          <li key={index} className={`tree-node ${isInsert ? 'insert' : ''}`}>
            <div className="line" style={{ left: `${level * 20}px` }}></div>
            <span className={`node ${isInsert ? 'red' : ''}`} style={{ paddingLeft: `${(level + 1) * 20}px` }}>{displayKey}</span>
            {renderHierarchy(hierarchy[key], level + 1)}
          </li>
        );
      })}
    </ul>
  );
}



export default DashBoard;

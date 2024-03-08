import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

function OtherPage() {

  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h1>OtherPage</h1>
    </div>
  );
}

export default OtherPage;

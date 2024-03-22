import React, { useState, useEffect } from "react";
import axiosInstance from "./apiIntercepter";
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용

const AdminUsers = () => {
  const [userInfoList, setUserInfoList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axiosInstance
      .get("/admin/get/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if(response){
          // 정상 접근
          setUserInfoList(response.data.message);
        }else {
          // 전 페이지로 이동
          navigate(-1);
        }
      })
      .catch((error) => {
            console.log(error);
            navigate("/dashboard");
      });
  }, [navigate]);

  return (
    <div>
      {userInfoList.length > 0 ? (
        <div>
          <h2>User Info</h2>
          {userInfoList.map((userInfo, index) => (
            <div key={index}>
              <p>Username: {userInfo.userId}</p>
              <p>Email: {userInfo.email}</p>
              <p>Company: {userInfo.company}</p>
              <hr />
            </div>
          ))}
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default AdminUsers;

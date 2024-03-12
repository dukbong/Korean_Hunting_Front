import React, { useState, useEffect } from "react";
import axiosInstance from "./apiIntercepter";

const AdminUsers = () => {
  const [userInfoList, setUserInfoList] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axiosInstance
      .get("/admin/get/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserInfoList(response.data.message);
      })
      .catch((error) => {
          if(error.response.status === 401){
            setErrorMsg("읽을 권한이 없습니다.");
          }else{
            setErrorMsg(
              "정보를 불러오는데 실패했습니다. 다시 시도해주시기 바랍니다."
            );
          }
      });
  }, []);

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
        <p>{errorMsg}</p>
      )}
    </div>
  );
};

export default AdminUsers;

import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [userInfoList, setUserInfoList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("/admin/get/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserInfoList(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        localStorage.setItem(
            "token",
            error.response.headers.authorization.substring(7)
          );
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
        <p>정보를 불러오는데 실패했습니다.</p>
      )}
    </div>
  );
};

export default AdminUsers;

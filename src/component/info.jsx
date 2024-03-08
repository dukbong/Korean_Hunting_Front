import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const UserInfo = () => {
    const [userInfo, setUserInfo] = useState(null); // 유저 정보 상태

    const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token){
            navigate("/login");
        } else {
            axios.get("/info", { headers: { Authorization: `Bearer ${token}` } })
                .then(response => {
                    setUserInfo(response.data);
                })
                .catch(error => {
                    console.log(error)
                });
        }

    }, [navigate]);

    return (
        <div>
            {userInfo ? (
                <div>
                    <h2>User Info</h2>
                    <p>Username: {userInfo.userId}</p>
                    <p>Email: {userInfo.email}</p>
                    <p>Email: {userInfo.company}</p>
                </div>
            ) : (
                <p>정보를 불러오는데 실패했습니다.</p>
            )}
        </div>
    );
}

export default UserInfo;

// axiosInstance.js

import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  
  response => {
    let newToken = response.headers.authorization;
    if (newToken) {
      newToken = newToken.substring(7);
      localStorage.setItem("token", newToken);
    }
    return response;
  },
  error => {
    console.log("-----");
    console.log(error);
    const status = error.response.status;
    if(status === 403){
      // 권한 문제
      alert(error.response.data);
    }

    if(status === 401){
      // 인증 문제
      alert(error.response.data);
    } 
    
  }
);
export default axiosInstance;

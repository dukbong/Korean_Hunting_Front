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
);
export default axiosInstance;

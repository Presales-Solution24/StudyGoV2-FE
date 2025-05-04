// src/api/axiosInstance.js

import axios from "axios";

// Buat instance Axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Tambahkan interceptor untuk menyisipkan token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    if (token) {
      config.headers.Authorization = token; // token sudah mengandung 'Bearer'
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

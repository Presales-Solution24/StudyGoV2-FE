// src/api/axiosInstance.js

import axios from "axios";

// Ganti token ini dengan token yang kamu dapat dari API (sementara)
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3NDYyNTkyNjJ9.8eUR3NPhPbM2bnBE_1seFbyCI0N7MIYgTjmouL8uslw";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api", // Default base URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;

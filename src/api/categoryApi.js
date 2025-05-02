// src/api/categoryApi.js
import axiosInstance from "./axiosInstance";

const categoryApi = {
  getAll: () => axiosInstance.get("/categories"),
  getById: (id) => axiosInstance.get(`/categories/${id}`),
  create: (data) => axiosInstance.post("/categories", data),
  update: (id, data) => axiosInstance.put(`/categories/${id}`, data),
  delete: (id) => axiosInstance.delete(`/categories/${id}`),
};

export default categoryApi;

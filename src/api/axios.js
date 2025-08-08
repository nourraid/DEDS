import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // عدليه حسب سيرفرك
});

// إضافة الـ token في كل طلب محمي
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

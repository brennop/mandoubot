import axios from "axios";

const api = axios.create({
  baseURL: process.env.CGR_URL,
  headers: {
    Authorization: process.env.CGR_KEY,
    "Content-Type": "application/json",
  },
});

export const newDidGood = (data) => api.post("/did_goods", data);

export default api;

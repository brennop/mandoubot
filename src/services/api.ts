import axios from "axios";

export type DidGood = {
  sender_id: number;
  receiver_id: number;
  description: string;
  photo: string;
};

const api = axios.create({
  baseURL: process.env.CGR_URL,
  headers: {
    Authorization: process.env.CGR_KEY,
    "Content-Type": "application/json",
  },
});

export const newDidGood = (data: DidGood) => api.post("/did_goods", data);

export default api;

import axios from "axios";

// Make sure NEXT_PUBLIC_API_URL is set in your .env for deployment
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

export default api;

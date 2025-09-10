// apps/web/src/lib/api.ts
import axios from "axios";

console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

export default api;

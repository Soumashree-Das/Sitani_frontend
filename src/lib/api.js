// src/lib/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api/v1`,
  withCredentials: true, // Optional, remove if not using cookies/sessions
});

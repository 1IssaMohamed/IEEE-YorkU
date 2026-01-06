/**
 * API Client Configuration
 * 
 * Axios instance configured to communicate with the Express backend
 * The "/api" baseURL is proxied to http://localhost:5000 in development (see vite.config.js)
 * In production, ensure your backend serves these routes
 */
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;

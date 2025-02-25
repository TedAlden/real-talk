import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";

// Creates an axios instance with preset configuration to be shared
// across request configurations
const axiosInstance = axios.create({
  baseURL: url, // Base URL for all requests to have endpoint added to
  timeout: 5000, // Timeout for requests (in milliseconds)
  headers: {
    "Content-Type": "application/json", // Default headers for requests
  },
});

export default axiosInstance;

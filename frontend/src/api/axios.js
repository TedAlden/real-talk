import axios from "axios";

const url = import.meta.env.BACKEND_URI
  ? import.meta.env.BACKEND_URI
  : import.meta.env.PORT
  ? `http://localhost:${import.meta.env.PORT}`
  : "http://localhost:5001";

// Creates an axios instance with preset configuration to be shared across request configurations
const axiosInstance = axios.create({
  baseURL: url, // Base URL for all requests. Change to API server url when it's set up
  timeout: 5000, // Set a default timeout for all requests (in milliseconds)
  headers: {
    "Content-Type": "application/json", // Set default headers for all requests
  },
});

export default axiosInstance;
